var express = require('express');
var router = express.Router();
var Q = require('Q');
var _ = require('lodash');

var Config = require('../config/config.js');
var mainUtils = require('../utils/main_utils.js');
var dateUtils = require('../utils/date.js');
var categoryModel = require('../models/categories.js');


router.get('/:category', function (req, res, next) {
    var pageNumber = 1,
        category = req.params.category;

    showCategoriesPage(res, pageNumber, category);
});

router.get('/:category/page/:number', function (req, res, next) {
    var pageNumber = +req.params.number,
        category = req.params.category;

    showCategoriesPage(res, pageNumber, category);
});

function showCategoriesPage(res, pageNumber, category) {
    mainUtils.pagination.setDefaultOptions();
    mainUtils.pagination.currentPage = pageNumber;
    mainUtils.pagination.pageType = '/view_category/';
    mainUtils.pagination.category = category;
    mainUtils.pagination.countSkipRows();

    categoryModel.createConnection();
    categoryModel.connection.connect();

    Q.all([categoryModel.countPostsWithCategory(mainUtils.pagination.category), categoryModel.getCategories()])
        .then(function (results) {
            mainUtils.pagination.rowCounter = results[0][0][0].rowCounter;
            mainUtils.categories.categoriesData = results[1][0];

            if (!_.find(mainUtils.categories.categoriesData, {category_name: mainUtils.pagination.category})) {
                res.redirect('/404');
                categoryModel.connection.end();
                return;
            }

            categoryModel.getPostsCategories()
                .then(function (results) {
                    mainUtils.categories.postsCategories = results[0];
                    mainUtils.pagination.changePaginationObj();

                    if (!mainUtils.pagination.checkCurrentPage()) {
                        res.redirect('/404');
                        categoryModel.connection.end();
                        return;
                    }

                    categoryModel.getPostsWithCategory(mainUtils.pagination.category, mainUtils.pagination)
                        .then(function (results) {
                            res.render('main.html', mainUtils.posts.preparePostsForRender(results[0]));
                            categoryModel.connection.end();
                        });
                });
        })
        .catch(function (error) {
            console.log(error);
            res.status(500);
        });
}

module.exports = router;
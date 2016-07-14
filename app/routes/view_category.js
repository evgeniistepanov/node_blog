var express = require('express');
var router = express.Router();
var Q = require('Q');
var _ = require('lodash');

var Config = require('../config/config.js');
var mainUtils = require('../utils/main_utils.js');
var dateUtils = require('../utils/date.js');
var CategoryModel = require('../models/categories.js');

var categoriesData,
    postCategories,
    categoryName;

router.get('/:category', function (req, res, next) {
    categoryName = req.params.category;
    mainUtils.pagination.setDefaultOptions();
    mainUtils.pagination.pageType = '/view_category/';
    mainUtils.pagination.category = categoryName;
    mainUtils.pagination.currentPage = 1;
    mainUtils.pagination.countSkipRows();

    CategoryModel.createConnection();
    CategoryModel.connection.connect();

    Q.all([CategoryModel.countPostsWithCategory(categoryName), CategoryModel.getCategories()])
        .then(function (results) {
            mainUtils.pagination.rowCounter = results[0][0][0].rowCounter;
            categoriesData = results[1][0];

            if (!_.find(categoriesData, {category_name: categoryName})) {
                res.redirect('/404');
                CategoryModel.connection.end();
                return;
            }

            CategoryModel.getPostsCategories()
                .then(function (results) {
                    postCategories = results[0];
                    mainUtils.pagination.changePaginationObj();

                    CategoryModel.getPostsWithCategory(categoryName, mainUtils.pagination)
                        .then(function (results) {
                            res.render('main.html', preparePostsForRender(results[0]));
                            CategoryModel.connection.end();
                        });
                });
        })
        .catch(function (error) {
            console.log(error);
        });
});

router.get('/:category/page/:number', function (req, res, next) {
    mainUtils.pagination.setDefaultOptions();
    mainUtils.pagination.currentPage = +req.params.number;
    categoryName = req.params.category;

    mainUtils.pagination.pageType = '/view_category/';
    mainUtils.pagination.category = categoryName;
    mainUtils.pagination.countSkipRows();

    CategoryModel.createConnection();
    CategoryModel.connection.connect();

    Q.all([CategoryModel.countPostsWithCategory(categoryName), CategoryModel.getCategories()])
        .then(function (results) {
            mainUtils.pagination.rowCounter = results[0][0][0].rowCounter;
            categoriesData = results[1][0];

            if (!_.find(categoriesData, {category_name: categoryName})) {
                res.redirect('/404');
                CategoryModel.connection.end();
                return;
            }

            CategoryModel.getPostsCategories()
                .then(function (results) {
                    postCategories = results[0];
                    mainUtils.pagination.changePaginationObj();

                    if (!mainUtils.pagination.checkCurrentPage()) {
                        res.redirect('/404');
                        CategoryModel.connection.end();
                        return;
                    }

                    CategoryModel.getPostsWithCategory(categoryName, mainUtils.pagination)
                        .then(function (results) {
                            res.render('main.html', preparePostsForRender(results[0]));
                            CategoryModel.connection.end();
                        });
                });
        })
        .catch(function (error) {
            console.log(error);
        });
});

function makePostsPreview(posts) {
    posts.forEach(function (item) {
        var index = item.content.indexOf(Config.previewTag);
        if (index !== -1) {
            item.content = item.content.slice(0, index);
        }
    });
}

function preparePostsForRender(results) {
    makePostsPreview(results);

    var postsData = {
        posts: results,
        page: mainUtils.pagination.currentPage,
        rowCounter: mainUtils.pagination.rowCounter,
        paginationObj: mainUtils.pagination,
        categoriesSidebar: mainUtils.categories.sliceCategories(categoriesData)
    };

    postsData.posts.forEach(function (item) {
        item.date = dateUtils.convertToDayMonthYear(item.date)
    });

    addCategoriesToPosts(postsData);

    return postsData;
}

function addCategoriesToPosts(postsData) {
    var obj = {};
    postCategories.forEach(function (item) {
        var category_obj = {};
        if (Array.isArray(obj[item.post_id])) {
            category_obj.category_name = _.find(categoriesData, {category_id: item.category_id}).category_name;
            category_obj.category_id = item.category_id;
            obj[item.post_id].push(category_obj);
        } else {
            obj[item.post_id] = [];
            category_obj.category_name = _.find(categoriesData, {category_id: item.category_id}).category_name;
            category_obj.category_id = item.category_id;
            obj[item.post_id].push(category_obj);
        }
    });

    postsData.posts.forEach(function (item) {
        if (obj[item.post_id]) {
            item.categories = obj[item.post_id];
        }
    });
}

module.exports = router;
var express = require('express');
var router = express.Router();
var posts = require('../json/posts.json');
var Q = require('Q');
var _ = require('lodash');

var mainUtils = require('../utils/main_utils.js');
var postsModel = require('../models/posts.js');

router.get('/', function (req, res, next) {
    var pageNumber = 1;
    showIndexPage(res, pageNumber);
});

router.get('/page/:number', function (req, res, next) {
    var pageNumber = +req.params.number;
    showIndexPage(res, pageNumber);
});

function showIndexPage(res, pageNumber) {
    mainUtils.pagination.setDefaultOptions();
    mainUtils.pagination.currentPage = pageNumber;
    mainUtils.pagination.countSkipRows();

    postsModel.createConnection();
    postsModel.connection.connect();

    Q.all([postsModel.countPosts(), postsModel.getCategories()])
        .then(function (results) {
            mainUtils.pagination.rowCounter = results[0][0][0].rowCounter;
            mainUtils.categories.categoriesData = results[1][0];

            postsModel.getPostsCategories().then(function (results) {
                mainUtils.categories.postsCategories = results[0];
                mainUtils.pagination.changePaginationObj();

                if (!mainUtils.pagination.checkCurrentPage()) {
                    res.redirect('/404');
                    postsModel.connection.end();
                    return;
                }

                postsModel.getPostsWithUsers(mainUtils.pagination)
                    .then(function (results) {
                        res.render('main.html', mainUtils.posts.preparePostsForRender(results[0]));
                        postsModel.connection.end();
                    });
            });
        })
        .catch(function (error) {
            console.log(error);
            res.status(500);
        });
}

module.exports = router;
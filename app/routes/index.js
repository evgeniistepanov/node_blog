var express = require('express');
var router = express.Router();
var posts = require('../json/posts.json');
var Q = require('Q');
var _ = require('lodash');

var mainUtils = require('../utils/main_utils.js');
var PostsModel = require('../models/posts.js');


router.get('/', function (req, res, next) {
    mainUtils.pagination.setDefaultOptions();
    mainUtils.pagination.currentPage = 1;
    mainUtils.pagination.countSkipRows();

    PostsModel.createConnection();
    PostsModel.connection.connect();

    Q.all([PostsModel.countPosts(), PostsModel.getCategories()]).then(function (results) {
        mainUtils.pagination.rowCounter = results[0][0][0].rowCounter;
        mainUtils.categories.categoriesData = results[1][0];

        PostsModel.getPostsCategories().then(function (results) {
            mainUtils.categories.postCategories = results[0];
            mainUtils.pagination.changePaginationObj();

            PostsModel.getPostsWithUsers(mainUtils.pagination)
                .then(function (results) {
                    res.render('main.html', mainUtils.posts.preparePostsForRender(results[0]));
                    PostsModel.connection.end();
                });
        });
    });
});

router.get('/page/:number', function (req, res, next) {
    mainUtils.pagination.setDefaultOptions();
    mainUtils.pagination.currentPage = +req.params.number;
    mainUtils.pagination.countSkipRows();

    PostsModel.createConnection();
    PostsModel.connection.connect();

    Q.all([PostsModel.countPosts(), PostsModel.getCategories()]).then(function (results) {
        mainUtils.pagination.rowCounter = results[0][0][0].rowCounter;
        mainUtils.categories.categoriesData = results[1][0];

        PostsModel.getPostsCategories().then(function (results) {
                mainUtils.categories.postCategories = results[0];
                mainUtils.pagination.changePaginationObj();

                if (!mainUtils.pagination.checkCurrentPage()) {
                    res.redirect('/404');
                    PostsModel.connection.end();
                    return;
                }

                PostsModel.getPostsWithUsers(mainUtils.pagination)
                    .then(function (results) {
                        res.render('main.html', mainUtils.posts.preparePostsForRender(results[0]));
                        PostsModel.connection.end();
                    });
            }
        );
    });
});

module.exports = router;
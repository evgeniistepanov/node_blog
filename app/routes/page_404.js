var express = require('express');
var router = express.Router();
var posts = require('../json/posts.json');
var mysql = require('mysql');
var Q = require('Q');

var postsModel = require('../models/posts');

var mainUtils = require('../utils/main_utils.js');

router.get('/', function (req, res, next) {
    postsModel.createConnection();
    postsModel.connection.connect();

    postsModel.getCategories()
        .then(function (results) {
            categoriesData = results[0];
            res.status(404);
            res.render('page_404.html', preparePageData());
            postsModel.connection.end();
        })
        .catch(function (err) {
            console.log(err);
            res.status(500);
            res.end();
        });

    function preparePageData() {
        var pageData = {
            categoriesSidebar: mainUtils.categories.sliceCategories(categoriesData)
        };

        return pageData;
    }
});

module.exports = router;

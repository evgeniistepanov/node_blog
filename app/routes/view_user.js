var express = require('express');
var router = express.Router();
var posts = require('../json/posts.json');
var Q = require('Q');

var dateUtils = require('../utils/date.js')
var mainUtils = require('../utils/main_utils.js')

var UserModel = require('../models/user.js');
var CategoriesModel = require('../models/categories.js');


router.get('/:username', function (req, res, next) {
    var pageData = {},
        username = req.params.username;

    UserModel.createConnection();
    UserModel.connection.connect();
    CategoriesModel.setConnection(UserModel.connection);

    Q.all([CategoriesModel.getCategories(), UserModel.getUserInfo(username)])
        .then(function (results) {

            if (results[1][0].length === 0) {
                res.redirect('/404');
                UserModel.connection.end();
                return;
            }

            pageData.categoriesSidebar = results[0][0];
            pageData.categoriesSidebar = mainUtils.categories.sliceCategories(pageData.categoriesSidebar);
            pageData.userData = results[1][0][0];
            pageData.userData.registration_date = dateUtils.convertToDayMonthYear(pageData.userData.registration_date);
            mainUtils.pagination.countSkipRows();
            res.render('view_user.html', pageData);

            UserModel.connection.end();
        })
        .catch(function (error) {
            console.log(error);
            res.status(500);
        });
});


module.exports = router;

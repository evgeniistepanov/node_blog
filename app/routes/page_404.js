var express = require('express');
var router = express.Router();
var posts = require('../json/posts.json');
var mysql = require('mysql');
var Q = require('Q');
var dateUtils = require('../utils/date.js');
var mainUtils = require('../utils/main_utils.js');

var connection;

function connectToMySQL() {
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'node_blog'
    });
    connection.connect();
}

router.get('/', function (req, res, next) {
    var categoriesData;

    connectToMySQL();

    getCategories()
        .then(function (results) {
            categoriesData = results[0];
            res.render('page_404.html', preparePageData())
            connection.end();
        });

    function getCategories() {
        var defered = Q.defer(),
            sql = 'SELECT * FROM category';
        connection.query(sql, defered.makeNodeResolver());
        return defered.promise;
    }


    function preparePageData(results) {
        var pageData = {
            categoriesSidebar: mainUtils.sliceCategories(categoriesData)
        };

        return pageData;
    }
});

module.exports = router;

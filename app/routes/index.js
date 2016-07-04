var express = require('express');
var router = express.Router();
var posts = require('../json/posts.json');
var mysql = require('mysql');
var Q = require('Q');

var connection = null;

function connectToMySQL() {
    connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'node_blog'
    });
    connection.connect();
}


var mainModel = require('../models/main.js');

var paginationConfig = {
    postsPerPage: 10
};


router.get('/', function(req, res, next) {
    connectToMySQL();

    connection.query('SELECT * FROM post LIMIT 10', function(err, results) {
        console.log(err, results);
        var pageData = {};
        pageData.posts = results;
        res.locals.page = null;

        connection.end();

        res.render('main.html', pageData);
    });
});

router.get('/page/:number', function(req, res, next) {
    var pageNumber = +req.params.number,
        rowCounter;

    connectToMySQL();
    countSkipRows();

    countRows().then(function (results) {
        rowCounter = results[0][0].rowCounter;
        query();
    });

    function countSkipRows() {
        if (pageNumber > 1) {
            paginationConfig.skip = paginationConfig.postsPerPage * pageNumber;
        } else {
            paginationConfig.skip = 0;
        }
    }

    function countRows(){
        var defered = Q.defer(),
            sql = 'SELECT COUNT(*) AS rowCounter FROM post';
        connection.query(sql,defered.makeNodeResolver());
        return defered.promise;
    }

    function query() {
        var sql = 'SELECT * FROM post LIMIT ' + paginationConfig.skip + ', ' + paginationConfig.postsPerPage;
        connection.query(sql, function(err, results) {
            console.log(err, results);
            var pageData = {};
            pageData.posts = results;
            pageData.page = pageNumber;
            pageData.rowCounter = rowCounter;
            pageData.paginationObj = createPaginationObj();
            console.log(pageData.paginationObj);
            res.render('main.html', pageData);
            connection.end();
        });
    }

    function createPaginationObj() {
        var paginationObj = {
            from: 1,
            to: 1,
            currentPage: pageNumber,
            rowCounter: rowCounter

        };

        paginationObj.to = +(rowCounter/paginationConfig.postsPerPage).toFixed();
        if (rowCounter % paginationConfig.postsPerPage >= 1 ) {
            paginationObj.to += 1;
        }

        return paginationObj;
    }

});

module.exports = router;

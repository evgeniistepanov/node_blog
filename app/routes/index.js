var express = require('express');
var router = express.Router();
var posts = require('../json/posts.json');
var mysql = require('mysql');
var Q = require('Q');

var connection;

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
        postsPerPage: 10,
        paginationObj: {
            from: 1,
            to: 1
        }
    },
    pageNumber,
    rowCounter;

router.get('/', function(req, res, next) {
    connectToMySQL();
    pageNumber = 1;

    countSkipRows();
    countRows().then(function (results) {
        rowCounter = results[0][0].rowCounter;
        changePaginationObj();
        query();
    });

    function query() {
        connection.query('SELECT * FROM post LIMIT ' + paginationConfig.postsPerPage, function(err, results) {
            var pageData = {
                posts: results,
                page: pageNumber,
                rowCounter: rowCounter,
                paginationObj: paginationConfig.paginationObj
            };

            res.render('main.html', pageData);
            connection.end();
        });
    }

});

router.get('/page/:number', function(req, res, next) {
    pageNumber = +req.params.number;

    connectToMySQL();
    countSkipRows();

    countRows().then(function (results) {
        rowCounter = results[0][0].rowCounter;
        changePaginationObj();
        if (!checkPageNumber()) {
            res.status(404).render('404.html');
        } else {
            query();
        }
    });

    function checkPageNumber() {
        var check = true;
        if (isNaN(pageNumber)) {
            check = false;
        } else if (paginationConfig.paginationObj.to < pageNumber || pageNumber <= 0) {
            check = false;
        }
        return check;
    }

    function query() {
        var sql = 'SELECT * FROM post LIMIT ' + paginationConfig.skip + ', ' + paginationConfig.postsPerPage;
        connection.query(sql, function(err, results) {
            var pageData = {
                posts: results,
                page: pageNumber,
                rowCounter: rowCounter,
                paginationObj: paginationConfig.paginationObj
            };
            res.render('main.html', pageData);
            connection.end();
        });
    }

});



function countRows(){
    var defered = Q.defer(),
        sql = 'SELECT COUNT(*) AS rowCounter FROM post';
    connection.query(sql,defered.makeNodeResolver());
    return defered.promise;
}

function countSkipRows() {
    if (pageNumber > 1) {
        paginationConfig.skip = paginationConfig.postsPerPage * (pageNumber -1);
    } else {
        paginationConfig.skip = 0;
    }
}

function changePaginationObj() {
    paginationConfig.paginationObj.currentPage = pageNumber;
    paginationConfig.paginationObj.rowCounter = rowCounter;
    paginationConfig.paginationObj.to = +(rowCounter/paginationConfig.postsPerPage).toFixed();

    if (rowCounter % paginationConfig.postsPerPage >= 1 ) {
        paginationConfig.paginationObj.to += 1;
    }

    if (pageNumber !== 1 ) {
        paginationConfig.paginationObj.prevPage = pageNumber - 1;
    } else {
        paginationConfig.paginationObj.prevPage = 0;
    }

    if (pageNumber !== paginationConfig.paginationObj.to ) {
        paginationConfig.paginationObj.nextPage = pageNumber + 1;
    } else {
        paginationConfig.paginationObj.nextPage = 0;
    }
}

module.exports = router;
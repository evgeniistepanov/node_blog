var express = require('express');
var router = express.Router();
var posts = require('../json/posts.json');
var mysql = require('mysql');
var Q = require('Q');
var dateUtils = require('../utils/date.js')


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

router.get('/:id', function(req, res, next) {

    connectToMySQL();
    query();

    function query() {
        var sql = 'SELECT * FROM post WHERE post_id = ' + req.params.id;
        connection.query(sql, function(err, results) {
            var pageData = {
                title: results[0].title,
                content: results[0].content,
                date: dateUtils.convertToDayMonthYear(results[0].date)
            };

            res.render('view_post.html', pageData);
            connection.end();
        });
    }


});


module.exports = router;

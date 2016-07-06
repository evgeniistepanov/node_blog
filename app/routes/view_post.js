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

/*
router.get('/', function(req, res, next) {
    connectToMySQL();
 for (var i = 0; i <= 51; i++) {
    var content = '<p class="lead">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus, vero, obcaecati, aut, error quam sapiente nemo saepe quibusdam sit excepturi nam quia corporis eligendi eos magni recusandae laborum minus inventore?</p>' +
              '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut, tenetur natus doloremque laborum quos iste ipsum rerum obcaecati impedit odit illo dolorum ab tempora nihil dicta earum fugiat. Temporibus, voluptatibus.</p>' +
              '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut, tenetur natus doloremque laborum quos iste ipsum rerum obcaecati impedit odit illo dolorum ab tempora nihil dicta earum fugiat. Temporibus, voluptatibus.</p>' +
              '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut, tenetur natus doloremque laborum quos iste ipsum rerum obcaecati impedit odit illo dolorum ab tempora nihil dicta earum fugiat. Temporibus, voluptatibus.</p>';

     connection.query('UPDATE post SET content = ? WHERE post_id = ?', [content, i]);
 }

    for (var i = 0; i <= 51; i++) {
        var content = 'Test post ' + i;

        connection.query('UPDATE post SET title = ? WHERE post_id = ?', [content, i]);
    }

    for (var i = 0; i <= 51; i++) {
        var content = 'Test post ' + i;

        connection.query('UPDATE post SET author_id = ? WHERE post_id = ?', [1, i]);
    }

});*/


router.get('/:id', function(req, res, next) {
    connectToMySQL();
    query();



    function query() {
        var sql = 'SELECT * FROM post LEFT JOIN author USING (author_id) WHERE post_id = ' + req.params.id;
        connection.query(sql, function(err, results) {
            var pageData = {
                author: results[0].author_name,
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

var express = require('express');
var router = express.Router();
var posts = require('../json/posts.json');
var mysql = require('mysql');
var Q = require('Q');
var dateUtils = require('../utils/date.js')
var mainUtils = require('../utils/main_utils.js')

var connection,
    categoriesData;

function connectToMySQL() {
    connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'node_blog'
    });
    connection.connect();
}

router.get('/', function(req, res, next) {
    connectToMySQL();
 /*for (var i = 0; i <= 51; i++) {
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

        connection.query('UPDATE post SET author_id = ? WHERE post_id = ?', [1, i]);
    }*/

/*    for (var i = 0; i <= 51; i++) {

        connection.query('UPDATE post SET post_category_id = ? WHERE post_id = ?', [4, i]);
    }*/

});


router.get('/:id', function(req, res, next) {
    connectToMySQL();

    getCategories()
        .then(function (results) {
        categoriesData = results[0];
        query();
    });

    function query() {
        var sql = 'SELECT * FROM post LEFT JOIN author USING (author_id) WHERE post_id = ' + req.params.id;
        connection.query(sql, function(err, results) {
            res.render('view_post.html', prepareSinglePostForRender(results));
            connection.end();
        });
    }

    function getCategories() {
        var defered = Q.defer(),
            sql = 'SELECT * FROM category';
        connection.query(sql,defered.makeNodeResolver());
        return defered.promise;
    }

    function prepareSinglePostForRender(results) {
        var postData = {
            author: results[0].author_name,
            title: results[0].title,
            content: results[0].content,
            date: dateUtils.convertToDayMonthYear(results[0].date),
            categories: mainUtils.sliceCategories(categoriesData)
        };

        return postData;
    }
});


module.exports = router;

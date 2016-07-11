var express = require('express');
var router = express.Router();
var posts = require('../json/posts.json');
var Q = require('Q');

var dateUtils = require('../utils/date.js')
var mainUtils = require('../utils/main_utils.js')

var PostsModel = require('../models/posts.js');

var categoriesData,
    postCategories = [];

router.get('/', function (req, res, next) {
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

router.get('/:id', function (req, res, next) {
    var id = +req.params.id;

    PostsModel.createConnection();
    PostsModel.connection.connect();

    Q.all([PostsModel.getCategories(), PostsModel.getSinglePostCategories(id)])
        .then(function (results) {
            categoriesData = results[0][0];
            postCategories = results[1][0];
            PostsModel.getSinglePost(id)
                .then(function (results) {
                    if (results[0].length === 0) {
                        res.redirect('/404');
                        PostsModel.connection.end();
                        return;
                    }

                    res.render('view_post.html', prepareSinglePostForRender(results[0]));
                    PostsModel.connection.end();
                });
        });

    function prepareSinglePostForRender(results) {
        var postData = {
            author: results[0].author_name,
            title: results[0].title,
            content: results[0].content,
            date: dateUtils.convertToDayMonthYear(results[0].date),
            postCategories: postCategories,
            categoriesSidebar: mainUtils.sliceCategories(categoriesData)
        };

        return postData;
    }
});


module.exports = router;

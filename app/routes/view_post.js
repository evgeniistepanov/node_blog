var express = require('express');
var router = express.Router();
var posts = require('../json/posts.json');
var Q = require('Q');

var mainUtils = require('../utils/main_utils.js');

var postsModel = require('../models/posts.js');
var commentsModel = require('../models/comments.js');

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

    postsModel.createConnection();
    postsModel.connection.connect();
    commentsModel.setConnection(postsModel.connection);

    Q.all([postsModel.getCategories(), postsModel.getSinglePostCategories(id), commentsModel.getCommentsForPost(id)])
        .then(function (results) {
            mainUtils.categories.categoriesData = results[0][0];
            mainUtils.singlePost.postCategories = results[1][0];
            mainUtils.singlePost.postComments = results[2][0];

            postsModel.getSinglePost(id)
                .then(function (results) {

                    if (results[0].length === 0) {
                        res.redirect('/404');
                        postsModel.connection.end();
                        return;
                    }

                    res.render('view_post.html', mainUtils.singlePost.prepareSinglePostForRender(results[0]));
                    postsModel.connection.end();
                });
        })
        .catch(function (error) {
            console.log(error);
            res.status(500);
        });
});


module.exports = router;

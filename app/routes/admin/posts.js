var express = require('express');
var router = express.Router();
var Q = require('Q');
var _ = require('lodash');
var Config = require('../../config/config.js');

var dateUtils = require('../../utils/date');
var mainUtils = require('../../utils/main_utils');


var PostsModel = require('../../models/posts');
var AdminPanelModel = require('../../models/admin_panel');
var CommentsModel = require('../../models/comments');
var UserModel = require('../../models/user');

var paginationConfig = {
    postsPerPage: 10,
    paginationObj: {
        from: 1,
        to: 1,
        pageType: ''
    }
};

var pageNumber,
    rowCounter,
    categoriesData,
    postCategories;

router.get('/', function (req, res, next) {
    pageNumber = 1;
    countSkipRows();

    PostsModel.createConnection();
    PostsModel.connection.connect();

    Q.all([PostsModel.countPosts(), PostsModel.getCategories()]).then(function (results) {
        rowCounter = results[0][0][0].rowCounter;
        categoriesData = results[1][0];

        PostsModel.getPostsCategories().then(function (results) {
            postCategories = results[0];
            changePaginationObj();

            PostsModel.getPostsWithUsers(paginationConfig)
                .then(function (results) {
                    res.render('admin/posts.html', preparePostsForRender(results[0]));
                    PostsModel.connection.end();
                });
        });
    });

});

router.get('/:number', function (req, res, next) {
    pageNumber = +req.params.number;
    countSkipRows();

    PostsModel.createConnection();
    PostsModel.connection.connect();

    Q.all([PostsModel.countPosts(), PostsModel.getCategories()]).then(function (results) {
        rowCounter = results[0][0][0].rowCounter;
        categoriesData = results[1][0];

        PostsModel.getPostsCategories().then(function (results) {
                postCategories = results[0];
                changePaginationObj();

                if (!checkPageNumber()) {
                    res.redirect('/404');
                    PostsModel.connection.end();
                    return;
                }

                PostsModel.getPostsWithUsers(paginationConfig)
                    .then(function (results) {
                        res.render('admin/posts.html', preparePostsForRender(results[0]));
                        PostsModel.connection.end();
                    });
            }
        );
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

});



function countSkipRows() {
    if (pageNumber > 1) {
        paginationConfig.skip = paginationConfig.postsPerPage * (pageNumber - 1);
    } else {
        paginationConfig.skip = 0;
    }
}

function changePaginationObj() {
    paginationConfig.paginationObj.currentPage = pageNumber;
    paginationConfig.paginationObj.rowCounter = rowCounter;
    paginationConfig.paginationObj.to = +(rowCounter / paginationConfig.postsPerPage).toFixed();

    if (rowCounter % paginationConfig.postsPerPage > 0) {
        paginationConfig.paginationObj.to += 1;
    }

    if (pageNumber !== 1) {
        paginationConfig.paginationObj.prevPage = pageNumber - 1;
    } else {
        paginationConfig.paginationObj.prevPage = 0;
    }

    if (pageNumber !== paginationConfig.paginationObj.to) {
        paginationConfig.paginationObj.nextPage = pageNumber + 1;
    } else {
        paginationConfig.paginationObj.nextPage = 0;
    }
}

function makePostsPreview(posts) {
    posts.forEach(function (item) {
        var index = item.content.indexOf(Config.previewTag);
        if (index !== -1) {
            item.content = item.content.slice(0, index);
        }
    });
}

function preparePostsForRender(results) {
    makePostsPreview(results);

    var postsData = {
        posts: results,
        page: pageNumber,
        rowCounter: rowCounter,
        paginationObj: paginationConfig.paginationObj,
        categoriesSidebar: mainUtils.sliceCategories(categoriesData)
    };

    postsData.posts.forEach(function (item) {
        item.date = dateUtils.convertToDayMonthYear(item.date)
    });

    addCategoriesToPosts(postsData);

    return postsData;
}

function addCategoriesToPosts(postsData) {
    var obj = {};
    postCategories.forEach(function (item) {
        var category_obj = {};
        if (Array.isArray(obj[item.post_id])) {
            category_obj.category_name = _.find(categoriesData, {category_id: item.category_id}).category_name;
            category_obj.category_id = item.category_id;
            obj[item.post_id].push(category_obj);
        } else {
            obj[item.post_id] = [];
            category_obj.category_name = _.find(categoriesData, {category_id: item.category_id}).category_name;
            category_obj.category_id = item.category_id;
            obj[item.post_id].push(category_obj);
        }
    });

    postsData.posts.forEach(function (item) {
        if (obj[item.post_id]) {
            item.categories = obj[item.post_id];
        }
    });
}




module.exports = router;
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var Q = require('Q');
var _ = require('lodash');

var mainUtils = require('../utils/main_utils.js');
var dateUtils = require('../utils/date.js');

var connection;
var CategoryModel = require('../models/categories.js');

var paginationConfig = {
        postsPerPage: 10,
        paginationObj: {
            from: 1,
            to: 1
        }
    };

var pageNumber = 1,
    rowCounter,
    categoriesData,
    postCategories,
    categoryName;

router.get('/:category', function(req, res, next) {
    connectToMySQL();
    countSkipRows();
    categoryName = connection.escape(req.params.category);


    Q.all([countRows(),getCategories()]).then(function(results){
        rowCounter = results[0][0][0].rowCounter;
        categoriesData = results[1][0];

        getPostsCategories().then(function (results) {
            postCategories = results[0];
            console.log(results);
            changePaginationObj();
            query();
        });
    });

    function query() {
        var sql = 'SELECT * FROM post' +
        ' JOIN post_category ON post.post_id = post_category.post_id' +
        ' JOIN category ON category.category_id= post_category.category_id' +
        ' LEFT JOIN author USING (author_id)' +
        ' WHERE category.category_name=' + categoryName +
        ' ORDER BY post.post_id DESC LIMIT ' + paginationConfig.postsPerPage;

        connection.query(sql, function(err, results) {
            res.render('main.html', preparePostsForRender(results));
            connection.end();
        });
    }

});

router.get('/:category/page/:number', function(req, res, next) {
    pageNumber = +req.params.number;
    categoryName = req.params.category;
    //connectToMySQL();
    countSkipRows();

    CategoryModel.createConnection();
    CategoryModel.connection.connect();

    //ORDER BY post_id DESC LIMIT ' + paginationConfig.skip + ', ' + paginationConfig.postsPerPage;

    Q.all([CategoryModel.countPostsWithCategory(categoryName), CategoryModel.getCategories()])
        .then(function(results) {
            rowCounter = results[0][0][0].rowCounter;
            categoriesData = results[1][0];

            if (!_.find(categoriesData, {category_name: categoryName})) {
                res.redirect('/404');
            }

            CategoryModel.getPostsCategories()
                .then(function(results){
                    postCategories = results[0];
                    changePaginationObj();

                    if (!checkPageNumber()) {
                        res.redirect('/404');
                    } else {
                        CategoryModel.getPostsWithCategory(categoryName)
                            .then(function(results){
                                res.render('main.html', preparePostsForRender(results[0]));
                                CategoryModel.connection.end();
                            });
                    }
                });
        })
        .catch(function(error){
            console.log(error);
        });

    /*

    categoryName = connection.escape(req.params.category);

    Q.all([countRows(),getCategories()]).then(function(results){
        rowCounter = results[0][0][0].rowCounter;
        categoriesData = results[1][0];

        getPostsCategories().then(function (results) {
            postCategories = results[0];
            changePaginationObj();

            if (!checkPageNumber()) {
                res.status(404).render('404.html');
            } else {
                query();
            }
        });
    });


    }*/

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


function connectToMySQL() {
    connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'node_blog'
    });
    connection.connect();
}

function countRows(){
    var defered = Q.defer(),
     sql =  'SELECT COUNT(*) AS rowCounter FROM post' +
        ' JOIN post_category ON post.post_id = post_category.post_id' +
        ' JOIN category ON category.category_id= post_category.category_id' +
        ' WHERE category.category_name=' + categoryName;

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

    if (rowCounter % paginationConfig.postsPerPage > 0) {
        paginationConfig.paginationObj.to += 1;
    }

    if (pageNumber !== 1 ) {
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

function getCategories() {
    var defered = Q.defer(),
        sql = 'SELECT * FROM category';
    connection.query(sql,defered.makeNodeResolver());
    return defered.promise;
}

function getPostsCategories() {
    var defered = Q.defer(),
        sql = 'SELECT * FROM post_category';
    connection.query(sql,defered.makeNodeResolver());
    return defered.promise;
}

function makePostsPreview(posts) {
    posts.forEach(function (item) {
        var index = item.content.indexOf('<!--preview-->')
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

    postsData.posts.forEach(function(item){
        item.date = dateUtils.convertToDayMonthYear(item.date)
    });


    var obj = {};
    postCategories.forEach(function(item){
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

    postsData.posts.forEach(function(item){
        if (obj[item.post_id]) {
            item.categories = obj[item.post_id];
        }
    });

    return postsData;
}

module.exports = router;
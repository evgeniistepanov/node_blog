var express = require('express');
var router = express.Router();
var posts = require('../json/posts.json');
//var q = require('q');

router.get('/', function(req, res, next) {
    var pageData = {};
    pageData.posts = posts;
    res.render('main.html', pageData);
});

module.exports = router;

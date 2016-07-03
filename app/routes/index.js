var express = require('express');
var router = express.Router();
//var users = require('../json/users.json');
//var q = require('q');

router.get('/', function(req, res, next) {
    //console.log(users);
    //var pageData = {options:{ title: 'Hey', message: 'Hello there!'}, users: users};
    var pageData = {
        options:
        {
            title: 'Hey',
            message: 'Hello there!'
        }
    };
    res.render('test.html', pageData);
});

module.exports = router;

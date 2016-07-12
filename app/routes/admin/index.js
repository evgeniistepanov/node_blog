var express = require('express');
var router = express.Router();
var Q = require('Q');
var _ = require('lodash');

router.get('/', function (req, res, next) {
    console.log('fas');
    res.render('admin/index.html');
});

module.exports = router;
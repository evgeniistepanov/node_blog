var express = require('express');
var router = express.Router();
var Q = require('Q');
var _ = require('lodash');
var dateUtils = require('../../utils/date.js');

var AdminPanelModel = require('../../models/admin_panel');
var CommentsModel = require('../../models/comments');
var UserModel = require('../../models/user');

router.get('/', function (req, res, next) {
    AdminPanelModel.createConnection();
    AdminPanelModel.connection.connect();
    CommentsModel.setConnection(AdminPanelModel.connection);
    UserModel.setConnection(AdminPanelModel.connection);

    Q.all([AdminPanelModel.countAllData(),CommentsModel.getLastComment(), UserModel.getLastUser()])
        .then(function (results) {
            var pageData = {};
            pageData.dataCounter = results[0][0][0];
            pageData.lastComment = results[1][0][0];
            pageData.lastComment.date = dateUtils.convertToDayMonthYear(pageData.lastComment.date);
            pageData.lastUser = results[2][0][0];
            pageData.lastUser.registration_date = dateUtils.convertToDayMonthYear(pageData.lastUser.registration_date);

            var labels = [];
            var counters = [];
            for (var prop in pageData.dataCounter) {
                labels.push(prop);
                counters.push(pageData.dataCounter[prop]);
            }

            pageData.dataForChart = {labels: labels, counters: counters};
            res.render('admin/index.html', pageData);
            AdminPanelModel.connection.end();
        });
});

module.exports = router;
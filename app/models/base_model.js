var mysql = require('mysql');
var Q = require('Q');
var config = require('../config/config.js');

var baseModel = {
    mysql: mysql,
    Q: Q,
    connection: null,
    createConnection: function () {
        this.connection = this.mysql.createConnection(config.mysqlConfig);
    },
    testQuery: function (sql) {
        this.connection.query(sql, function (err, res) {
            console.log(err, res);
        });
    },
    setConnection: function (connection) {
        this.connection = connection;
    }
};

module.exports = baseModel;
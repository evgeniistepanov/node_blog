var mysql = require('mysql');
var Q = require('Q');
var Config = require('../config/config.js');

var BaseModel = {
    mysql: mysql,
    Q: Q,
    connection: null,
    createConnection: function(){
        this.connection = this.mysql.createConnection(Config.mysqlConfig);
    },
/*    connect: function(){
        this.connection.connect();
    },*/
    testQuery: function(sql){
        this.connection.query(sql, function(err, res){
            console.log(err, res);
        });
    }
};

module.exports = BaseModel;
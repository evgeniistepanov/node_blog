var baseModel = require('./base_model.js');
var user = Object.create(baseModel);

user.getUserInfo = function(username) {
    var defered = this.Q.defer(),
        sql = 'SELECT * FROM user WHERE user_name = ' + this.connection.escape(username);
    this.connection.query(sql, defered.makeNodeResolver());
    defered.promise.catch(function (error) {
        console.log(error);
    });
    return defered.promise;
};

user.getLastUser = function() {
    var defered = this.Q.defer(),
        sql = 'SELECT * FROM user ORDER BY user_id DESC LIMIT 1';
    this.connection.query(sql, defered.makeNodeResolver());
    defered.promise.catch(function (error) {
        console.log(error);
    });
    return defered.promise;
};

module.exports = user;


var baseModel = require('./base_model.js');
var comments = Object.create(baseModel);

comments.getCommentsForPost = function (id) {
    var defered = this.Q.defer(),
        sql = 'SELECT * FROM comment LEFT JOIN user USING (user_id) WHERE post_id = ' + this.connection.escape(id);
    this.connection.query(sql, defered.makeNodeResolver());
    defered.promise.catch(function (error) {
        console.log(error);
    });
    return defered.promise;
};

comments.countCommentsForPosts = function (id) {
    var defered = this.Q.defer(),
        sql = 'SELECT count(*) FROM comment post_id = ' + this.connection.escape(id);
    this.connection.query(sql, defered.makeNodeResolver());
    defered.promise.catch(function (error) {
        console.log(error);
    });
    return defered.promise;
};

comments.getLastComment = function() {
    var defered = this.Q.defer(),
        sql = 'SELECT * FROM comment LEFT JOIN user USING (user_id) WHERE user_id = user.user_id ORDER BY comment_id DESC LIMIT 1';
    this.connection.query(sql, defered.makeNodeResolver());
    defered.promise.catch(function (error) {
        console.log(error);
    });
    return defered.promise;
};

module.exports = comments;


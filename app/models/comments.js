var BaseModel = require('./base_model.js');
var Comments = Object.create(BaseModel);

Comments.getCommentsForPost = function (id) {
    var defered = this.Q.defer(),
        sql = 'SELECT * FROM comment LEFT JOIN user USING (user_id) WHERE post_id = ' + this.connection.escape(id);
    this.connection.query(sql, defered.makeNodeResolver());
    defered.promise.catch(function (error) {
        console.log(error);
    });
    return defered.promise;
};

Comments.countCommentsForPosts = function (id) {
    var defered = this.Q.defer(),
        sql = 'SELECT count(*) FROM comment post_id = ' + this.connection.escape(id);
    this.connection.query(sql, defered.makeNodeResolver());
    defered.promise.catch(function (error) {
        console.log(error);
    });
    return defered.promise;
};


module.exports = Comments;


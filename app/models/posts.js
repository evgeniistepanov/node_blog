var BaseModel = require('./base_model.js');
var Posts = Object.create(BaseModel);

Posts.countPosts = function () {
    var defered = this.Q.defer(),
        sql = 'SELECT COUNT(*) AS rowCounter FROM post';
    this.connection.query(sql, defered.makeNodeResolver());
    return defered.promise;
};

Posts.getCategories = function () {
    var defered = this.Q.defer(),
        sql = 'SELECT * FROM category';
    this.connection.query(sql, defered.makeNodeResolver());
    return defered.promise;
};

Posts.getPostsCategories = function () {
    var defered = this.Q.defer(),
        sql = 'SELECT * FROM post_category';
    this.connection.query(sql, defered.makeNodeResolver());
    return defered.promise;
};

Posts.getPostsWithUsers = function (paginationConfig) {
    var sql = 'SELECT *, (SELECT COUNT(post_id) FROM comment' +
        '  WHERE comment.post_id = post.post_id) as comments_counter FROM post' +
        ' LEFT JOIN user USING (user_id) ORDER BY post_id DESC LIMIT ' + paginationConfig.skip + ', ' + paginationConfig.postsPerPage;
    var defered = this.Q.defer();
        //sql = 'SELECT * FROM post LEFT JOIN user USING (user_id) ORDER BY post_id DESC LIMIT ' + paginationConfig.skip + ', ' + paginationConfig.postsPerPage;
    this.connection.query(sql, defered.makeNodeResolver());

    defered.promise.catch(function (error) {
        console.log(error);
    });

    return defered.promise;
};

Posts.getSinglePostCategories = function (id) {
    var defered = this.Q.defer(),
        sql = 'SELECT * FROM `post_category` LEFT JOIN category USING (category_id) WHERE post_id =' + this.connection.escape(id);
    this.connection.query(sql, defered.makeNodeResolver());

    return defered.promise;
};

Posts.getSinglePost = function (id) {
    var defered = this.Q.defer(),
        sql = 'SELECT * FROM post LEFT JOIN user USING (user_id) WHERE post_id = ' + this.connection.escape(id);
    this.connection.query(sql, defered.makeNodeResolver());

    defered.promise.catch(function (error) {
        console.log(error);
    });
    return defered.promise;
};

module.exports = Posts;
var BaseModel = require('./base_model.js');
var PostCategories = Object.create(BaseModel);

PostCategories.getPostsWithCategory = function (category, paginationConfig) {
    var defered = this.Q.defer(),
        sql = 'SELECT * FROM post' +
            ' JOIN post_category ON post.post_id = post_category.post_id' +
            ' JOIN category ON category.category_id= post_category.category_id' +
            ' LEFT JOIN author USING (author_id)' +
            ' WHERE category.category_name= ' + this.connection.escape(category) +
            ' ORDER BY post.post_id DESC LIMIT ' + paginationConfig.skip + ', ' + paginationConfig.postsPerPage;
    this.connection.query(sql, defered.makeNodeResolver());
    defered.promise.catch(function (error) {
        console.log(error);
    });
    return defered.promise;
};

PostCategories.countPostsWithCategory = function (category) {
    var defered = this.Q.defer(),
        sql = 'SELECT COUNT(*) AS rowCounter FROM post' +
            ' JOIN post_category ON post.post_id = post_category.post_id' +
            ' JOIN category ON category.category_id= post_category.category_id' +
            ' WHERE category.category_name=' + this.connection.escape(category);
    this.connection.query(sql, defered.makeNodeResolver());
    return defered.promise;
};

PostCategories.getCategories = function () {
    var defered = this.Q.defer(),
        sql = 'SELECT * FROM category';
    this.connection.query(sql, defered.makeNodeResolver());
    return defered.promise;
};

PostCategories.getPostsCategories = function () {
    var defered = this.Q.defer(),
        sql = 'SELECT * FROM post_category';
    this.connection.query(sql, defered.makeNodeResolver());
    return defered.promise;
};

module.exports = PostCategories;


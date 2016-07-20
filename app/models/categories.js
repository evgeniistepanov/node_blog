var baseModel = require('./base_model.js');
var postCategories = Object.create(baseModel);

postCategories.getPostsWithCategory = function (category, paginationConfig) {
    var defered = this.Q.defer(),
        sql = 'SELECT * FROM post' +
            ' JOIN post_category ON post.post_id = post_category.post_id' +
            ' JOIN category ON category.category_id= post_category.category_id' +
            ' LEFT JOIN user USING (user_id)' +
            ' WHERE category.category_name= ' + this.connection.escape(category) +
            ' ORDER BY post.post_id DESC LIMIT ' + paginationConfig.skip + ', ' + paginationConfig.postsPerPage;
    this.connection.query(sql, defered.makeNodeResolver());
    defered.promise.catch(function (error) {
        console.log(error);
    });
    return defered.promise;
};

postCategories.countPostsWithCategory = function (category) {
    var defered = this.Q.defer(),
        sql = 'SELECT COUNT(*) AS rowCounter FROM post' +
            ' JOIN post_category ON post.post_id = post_category.post_id' +
            ' JOIN category ON category.category_id= post_category.category_id' +
            ' WHERE category.category_name=' + this.connection.escape(category);
    this.connection.query(sql, defered.makeNodeResolver());
    return defered.promise;
};

postCategories.getCategories = function () {
    var defered = this.Q.defer(),
        sql = 'SELECT * FROM category';
    this.connection.query(sql, defered.makeNodeResolver());
    return defered.promise;
};

postCategories.getPostsCategories = function () {
    var defered = this.Q.defer(),
        sql = 'SELECT * FROM post_category';
    this.connection.query(sql, defered.makeNodeResolver());
    return defered.promise;
};

module.exports = postCategories;


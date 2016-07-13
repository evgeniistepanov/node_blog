var BaseModel = require('./base_model.js');
var AdminPanel = Object.create(BaseModel);

AdminPanel.countAllData = function() {
    var defered = this.Q.defer(),
        sql = 'SELECT COUNT(*) as posts, (SELECT COUNT(*) from category) as categories, (SELECT COUNT(*) from comment) as comments, (SELECT COUNT(*) from user) as users FROM `post`';
    this.connection.query(sql, defered.makeNodeResolver());
    defered.promise.catch(function (error) {
        console.log(error);
    });
    return defered.promise;
};

module.exports = AdminPanel;


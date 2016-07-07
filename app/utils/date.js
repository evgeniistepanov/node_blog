var dateUtils = {
    convertToDayMonthYear: function(date) {
        var d = new Date(date),
            date = d.getDate(),
            month = d.getMonth(),
            year = d.getFullYear();
        return date + '-' + month + '-' + year;
    },
    getCategor: function getCategories() {
        var defered = Q.defer(),
            sql = 'SELECT * FROM category';
        connection.query(sql,defered.makeNodeResolver());
        return defered.promise;
    }
};

module.exports = dateUtils;
var dateUtils = {
    convertToDayMonthYear: function(date) {
        var d = new Date(date),
            date = d.getDate(),
            month = d.getMonth(),
            year = d.getFullYear();
        return date + '-' + month + '-' + year;
    }
};

module.exports = dateUtils;
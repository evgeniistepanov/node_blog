var mainUtils = {
    sliceCategories: function(categories){
        var half = +(categories.length/2).toFixed();
        var firstPart = categories.slice(0, half);
        var secondPart = categories.slice(half, categories.length);

        return {
            firstPart: firstPart,
            secondPart: secondPart
        }
    }
};

module.exports = mainUtils;
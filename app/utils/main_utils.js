var mainUtils = {

    pagination: {
        postsPerPage: 10,
        from: 1,
        to: 1,
        pageType: '',
        skip: 0,
        currentPage: 0,
        rowCounter: 0,
        nextPage: 0,
        prevPage: 0,

        countSkipRows: function () {
            if (this.currentPage > 1) {
                this.skip = this.postsPerPage * (this.currentPage - 1);
            } else {
                this.skip = 0;
            }
        },

        changePaginationObj: function () {
            this.to = this.rowCounter / this.postsPerPage - (this.rowCounter / this.postsPerPage)%1;
            if (this.rowCounter % this.postsPerPage > 0) {
                this.to += 1;
            }

            if (this.currentPage !== 1) {
                this.prevPage = this.currentPage - 1;
            } else {
                this.prevPage = 0;
            }

            if (this.currentPage !== this.to) {
                this.nextPage = this.currentPage + 1;
            } else {
                this.nextPage = 0;
            }
        }
    },

    posts: {
        /*  makePostsPreview: function (posts) {
         posts.forEach(function (item) {
         var index = item.content.indexOf(Config.previewTag);
         if (index !== -1) {
         item.content = item.content.slice(0, index);
         }
         });
         },

         preparePostsForRender: function (results) {
         this.makePostsPreview(results);

         var postsData = {
         posts: results,
         page: pageNumber,
         rowCounter: rowCounter,
         paginationObj: paginationConfig.paginationObj,
         categoriesSidebar: mainUtils.sliceCategories(categoriesData)
         };

         postsData.posts.forEach(function (item) {
         item.date = dateUtils.convertToDayMonthYear(item.date)
         });

         addCategoriesToPosts(postsData);

         return postsData;
         },

         addCategoriesToPosts: function (postsData) {
         var obj = {};
         postCategories.forEach(function (item) {
         var category_obj = {};
         if (Array.isArray(obj[item.post_id])) {
         category_obj.category_name = _.find(categoriesData, {category_id: item.category_id}).category_name;
         category_obj.category_id = item.category_id;
         obj[item.post_id].push(category_obj);
         } else {
         obj[item.post_id] = [];
         category_obj.category_name = _.find(categoriesData, {category_id: item.category_id}).category_name;
         category_obj.category_id = item.category_id;
         obj[item.post_id].push(category_obj);
         }
         });

         postsData.posts.forEach(function (item) {
         if (obj[item.post_id]) {
         item.categories = obj[item.post_id];
         }
         });
         }*/

    },


    sliceCategories: function (categories) {
        var half = +(categories.length / 2).toFixed();
        var firstPart = categories.slice(0, half);
        var secondPart = categories.slice(half, categories.length);

        return {
            firstPart: firstPart,
            secondPart: secondPart
        }
    }
};

module.exports = mainUtils;
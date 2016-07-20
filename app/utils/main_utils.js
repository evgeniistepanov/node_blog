var Config = require('../config/config');
var _ = require('lodash');
var dateUtils = require('../utils/date');

var mainUtils = {
    pagination: {
        postsPerPage: 10,
        from: 1,
        to: 1,
        skip: 0,
        currentPage: 0,
        rowCounter: 0,
        nextPage: 0,
        prevPage: 0,
        pageType: '',
        category: '',

        setDefaultOptions: function () {
            this.postsPerPage = 10;
            this.from = 1;
            this.to = 1;
            this.skip = 0;
            this.currentPage = 0;
            this.rowCounter = 0;
            this.nextPage = 0;
            this.prevPage = 0;
            this.pageType = '';
            this.category = '';
        },

        checkCurrentPage: function () {
            var check = true;
            if (isNaN(this.currentPage)) {
                check = false;
            } else if (this.to < this.currentPage || this.currentPage <= 0) {
                check = false;
            }
            return check;
        },

        countSkipRows: function () {
            if (this.currentPage > 1) {
                this.skip = this.postsPerPage * (this.currentPage - 1);
            } else {
                this.skip = 0;
            }
        },

        changePaginationObj: function () {
            this.to = this.rowCounter / this.postsPerPage - (this.rowCounter / this.postsPerPage) % 1;
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
        postsData: null,

        makePostsPreview: function (posts) {
            posts.forEach(function (item) {
                var index = item.content.indexOf(Config.previewTag);
                if (index !== -1) {
                    item.content = item.content.slice(0, index);
                }
            });
        },

        preparePostsForRender: function (results) {
            this.makePostsPreview(results);

            this.postsData = {
                posts: results,
                page: mainUtils.pagination.currentPage,
                rowCounter: mainUtils.pagination.rowCounter,
                paginationObj: mainUtils.pagination,
                categoriesSidebar: mainUtils.categories.sliceCategories(mainUtils.categories.categoriesData)
            };

            this.postsData.posts.forEach(function (item) {
                item.date = dateUtils.convertToDayMonthYear(item.date)
            });

            mainUtils.categories.addCategoriesToPosts(this.postsData);

            return this.postsData;
        }
    },

    singlePost: {
        postComments: [],
        postCategories: [],
        postData: null,

        prepareSinglePostForRender: function (results) {
            this.postData = {
                user: results[0].user_name,
                title: results[0].title,
                content: results[0].content,
                date: dateUtils.convertToDayMonthYear(results[0].date),
                postCategories: this.postCategories,
                postComments: this.postComments,
                categoriesSidebar: mainUtils.categories.sliceCategories(mainUtils.categories.categoriesData)
            };

            this.postData.postComments.forEach(function (item) {
                item.date = dateUtils.convertToDayMonthYear(item.date)
            });

            return this.postData;
        }
    },

    categories: {
        categoriesData: [],
        postsCategories: [],
        categoryName: '',

        sliceCategories: function (categories) {
            if (!categories) {
                return categories;
            }

            var half = +(categories.length / 2).toFixed();
            var firstPart = categories.slice(0, half);
            var secondPart = categories.slice(half, categories.length);

            return {
                firstPart: firstPart,
                secondPart: secondPart
            }
        },

        addCategoriesToPosts: function (postsData) {

            if (this.postsCategories.length === 0 || this.categoriesData.length === 0) {
                return;
            }

            var obj = {};
            this.postsCategories.forEach(function (item) {
                var category_obj = {};
                if (Array.isArray(obj[item.post_id])) {
                    category_obj.category_name = _.find(this.categoriesData, {category_id: item.category_id}).category_name;
                    category_obj.category_id = item.category_id;
                    obj[item.post_id].push(category_obj);
                } else {
                    obj[item.post_id] = [];
                    category_obj.category_name = _.find(this.categoriesData, {category_id: item.category_id}).category_name;
                    category_obj.category_id = item.category_id;
                    obj[item.post_id].push(category_obj);
                }
            }, this);

            postsData.posts.forEach(function (item) {
                if (obj[item.post_id]) {
                    item.categories = obj[item.post_id];
                }
            });
        }
    }
};

module.exports = mainUtils;
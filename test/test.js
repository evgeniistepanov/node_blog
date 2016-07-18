

var chai = require("chai");
chai.should();
chai.use(require('chai-things'));


/*var assert = require('chai').assert;
var expect = require('chai').expect;
var request = require('supertest');*/

var assert = chai.assert;
var expect = chai.expect;
var request = require('supertest');


var _ = require('lodash');

var app = require('../app');

var index = require('../app/routes/index');
var mainUtils = require('../app/utils/main_utils');


var PostsModel = require('../app/models/posts');


var posts = require('./json/posts');
var categories = require('./json/categories');
var post_categories = require('./json/post_categories');
var postsWithUsers = require('./json/posts_with_users');

debugger;

describe('Pagination', function() {
    describe('CountSkipRows', function() {
        it('should change skip property of paginationObj to 0', function() {
            mainUtils.pagination.countSkipRows();
            assert.equal(mainUtils.pagination.skip, 0);
        });

        it('should change skip property of paginationObj to postsPerPage * (pageNumber - 1)', function() {
            mainUtils.pagination.currentPage = 5;
            mainUtils.pagination.countSkipRows();
            assert.equal(mainUtils.pagination.skip, 40);
        });

        it('should change skip property of paginationObj to postsPerPage * (pageNumber - 1)', function() {
            mainUtils.pagination.currentPage = 3;
            mainUtils.pagination.countSkipRows();
            assert.equal(mainUtils.pagination.skip, 20);
        });
    });

    describe('ChangePaginationObj', function() {
        it('should change paginationObj (from 1, to 6, prev 0, next 2)', function() {
            mainUtils.pagination.currentPage = 1;
            mainUtils.pagination.rowCounter = 51;
            mainUtils.pagination.changePaginationObj();

            assert.equal(mainUtils.pagination.from, 1);
            assert.equal(mainUtils.pagination.to, 6);
            assert.equal(mainUtils.pagination.prevPage, 0);
            assert.equal(mainUtils.pagination.nextPage, 2);
        });

        it('should change paginationObj (from 1, to 6, prev 5, next 0)', function() {
            mainUtils.pagination.currentPage = 6;
            mainUtils.pagination.rowCounter = 51;
            mainUtils.pagination.changePaginationObj();

            assert.equal(mainUtils.pagination.from, 1);
            assert.equal(mainUtils.pagination.to, 6);
            assert.equal(mainUtils.pagination.prevPage, 5);
            assert.equal(mainUtils.pagination.nextPage, 0);
        });

        it('should change paginationObj (from 1, to 5, prev 2, next 4)', function() {
            mainUtils.pagination.currentPage = 3;
            mainUtils.pagination.rowCounter = 45;
            mainUtils.pagination.changePaginationObj();

            assert.equal(mainUtils.pagination.from, 1);
            assert.equal(mainUtils.pagination.to, 5);
            assert.equal(mainUtils.pagination.prevPage, 2);
            assert.equal(mainUtils.pagination.nextPage, 4);
        });
    });

    describe('CheckPageNumber', function() {
        it('should return false because currentPage === string', function() {
            mainUtils.pagination.currentPage = 'test_str';
            assert.equal(mainUtils.pagination.checkCurrentPage(), false);
        });

        it('should return false because currentPage > pagination.to', function() {
            mainUtils.pagination.to = 6;
            mainUtils.pagination.currentPage = 7;
            assert.equal(mainUtils.pagination.checkCurrentPage(), false);
        });

        it('should return false because currentPage <= 0', function() {
            mainUtils.pagination.to = 6;
            mainUtils.pagination.currentPage = -1;
            assert.equal(mainUtils.pagination.checkCurrentPage(), false);

            mainUtils.pagination.currentPage = 0;
            assert.equal(mainUtils.pagination.checkCurrentPage(), false);
        });
    });
});



describe('Posts', function() {
    describe('makePostsPreview', function() {
        it('should reduce content length', function() {
            var post = [posts[0]];
            var postLengthBefore = post[0].content.length;
            mainUtils.posts.makePostsPreview(post);

            var postLengthAfter = post[0].content.length;
            assert.isBelow(postLengthAfter, postLengthBefore);
        });

        it('should not reduce content length', function() {
            var post = [posts[1]];
            var postLengthBefore = post[0].content.length;
            mainUtils.posts.makePostsPreview(post);

            var postLengthAfter = post[0].content.length;
            assert.equal(postLengthAfter, postLengthBefore);
        });

        it('should not fasfasfas gdfgdfgdfdfdfdfdfdfdfdf', function() {
            var datePattern = /^(\d{1,2})-(\d{1,2})-(\d{4})$/;
            var dateStr = '10-12-2016';
            assert.equal(dateStr.search(datePattern), 0);
        });

    });

    describe('preparePostsForRender', function() {
        it('should return obj with next properties' +
            'posts, page, rowCounter, paginationObj, categoriesSidebar', function() {
            var resultObj = mainUtils.posts.preparePostsForRender(postsWithUsers);

            assert.equal(resultObj.posts, postsWithUsers);
            assert.isAtLeast(resultObj.page, 0);
            assert.isAtLeast(resultObj.rowCounter, 0);

            resultObj.paginationObj.should.include.keys(["postsPerPage", "from", "to",
                "skip", "currentPage", "rowCounter", "nextPage", "prevPage", "pageType", "category"]);
            resultObj.categoriesSidebar.should.include.keys(["firstPart", "secondPart"]);

            resultObj.posts.should.all.satisfy(function(arg) {
                return arg.date.search(/^(\d{1,2})-(\d{1,2})-(\d{4})$/) === 0;
            });

        });

    });
    
});


describe('Categories', function() {
    describe('sliceCategories', function() {
        it('should return obj with firstPart and secondPart properties (arrays)', function() {
            var slicedCategories = mainUtils.categories.sliceCategories(categories);

            assert.isObject(slicedCategories, 'sliced categories === obj' );
            assert.property(slicedCategories, 'firstPart');
            assert.property(slicedCategories, 'secondPart');
            assert.isArray(slicedCategories.firstPart, 'firstPart is an array');
            assert.isArray(slicedCategories.secondPart, 'secondPart is an array');
        });

        it('should return obj with firstPart - first two elements of categories' +
            ' secondPart - last one element of categories', function() {
            var treeCategories = _.cloneDeep(categories);
            treeCategories.splice(0,2);

            var slicedCategories = mainUtils.categories.sliceCategories(treeCategories);
            assert.deepEqual(slicedCategories.firstPart, treeCategories.slice(0,2));
            assert.deepEqual(slicedCategories.secondPart, treeCategories.slice(2,3));
        });

        it('should return obj with firstPart - first three elements of categories,' +
            ' secondPart - last two elements of categories', function() {
            var slicedCategories = mainUtils.categories.sliceCategories(categories);
            assert.deepEqual(slicedCategories.firstPart, categories.slice(0,3));
            assert.deepEqual(slicedCategories.secondPart, categories.slice(3,5));
        });
    });

   
    

    describe('addCategoriesToPosts', function() {
        it('should add categories array to posts with categories,' +
            ' first post with 2 categories, second posts with 3 categories, third post with 1 category', function() {
            var postsData = {};
            postsData.posts = _.cloneDeep(posts);

            mainUtils.categories.postCategories = _.cloneDeep(post_categories);
            mainUtils.categories.postCategories.splice(3, mainUtils.categories.length);
            mainUtils.categories.categoriesData = categories;
            mainUtils.categories.addCategoriesToPosts(postsData);

            assert.equal(postsData.posts[0].categories.length, 2);
            assert.equal(postsData.posts[0].categories[0].category_id, 4);
            assert.equal(postsData.posts[0].categories[0].category_name, "web-development");
            assert.equal(postsData.posts[0].categories[1].category_id, 1);
            assert.equal(postsData.posts[0].categories[1].category_name, "javascript");

            assert.equal(postsData.posts[1].categories.length, 3);
            assert.equal(postsData.posts[1].categories[0].category_id, 4);
            assert.equal(postsData.posts[1].categories[0].category_name, "web-development");
            assert.equal(postsData.posts[1].categories[1].category_id, 2);
            assert.equal(postsData.posts[1].categories[1].category_name, "php");
            assert.equal(postsData.posts[1].categories[2].category_id, 5);
            assert.equal(postsData.posts[1].categories[2].category_name, "angular");

            assert.equal(postsData.posts[2].categories.length, 1);
            assert.equal(postsData.posts[2].categories[0].category_id, 3);
            assert.equal(postsData.posts[2].categories[0].category_name, "seo");
        });

        it('should add categories array to fifth post,' +
            ' fifth post should have 2 categories (web-development & seo)', function() {
            var postsData = {};
            postsData.posts = _.cloneDeep(posts);
            mainUtils.categories.postCategories = _.cloneDeep(post_categories).splice(5, 10);
            mainUtils.categories.categoriesData = categories;
            mainUtils.categories.addCategoriesToPosts(postsData);

            assert.equal(postsData.posts[5].categories.length, 2);
            assert.equal(postsData.posts[5].categories[0].category_id, 4);
            assert.equal(postsData.posts[5].categories[0].category_name, "web-development");
            assert.equal(postsData.posts[5].categories[1].category_id, 3);
            assert.equal(postsData.posts[5].categories[1].category_name, "seo");
        });

        it('should not add categories array to all posts', function() {
            var postsData = {};
            postsData.posts = _.cloneDeep(posts);
            mainUtils.categories.postCategories = post_categories;
            mainUtils.categories.categoriesData = [];
            mainUtils.categories.addCategoriesToPosts(postsData);
            postsData.posts.should.all.not.have.property('categories');
        });
    });
});



/*


describe('Routing', function() {
    describe('GET main page', function () {
        it('should return 200 status', function (done) {
            request(app)
                .get('/')
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    done()
                });
        });

        it('should return 200 status', function (done) {
            request(app)
                .get('/page/3')
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    done()
                });
        });
    });
    describe('Test 404 page', function () {
        it('should return 404 page because page number === 999', function (done) {

            request(app)
                .get('/page/999')
                .expect('location', '/404')
                .end(function (err, res) {
                    if (err) return done(err);
                    done()
                });
        });

        it('should return 404 page because page number === "test"', function (done) {
            request(app)
                .get('/page/test')
                .expect('location', '/404')
                .end(function (err, res) {
                    if (err) return done(err);
                    done()
                });
        });
    });
});
*/

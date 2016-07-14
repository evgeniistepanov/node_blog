var assert = require('chai').assert;
var request = require('supertest');

var app = require('../app');

var index = require('../app/routes/index');
var mainUtils = require('../app/utils/main_utils');


var PostsModel = require('../app/models/posts');


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

        it('should change paginationObj (from 1, to 6, prev 0, next 2)', function() {
            mainUtils.pagination.currentPage = 1;
            mainUtils.pagination.rowCounter = 30;
            mainUtils.pagination.changePaginationObj();

            assert.equal(mainUtils.pagination.from, 1);
            assert.equal(mainUtils.pagination.to, 3);
            assert.equal(mainUtils.pagination.prevPage, 0);
            assert.equal(mainUtils.pagination.nextPage, 2);
        });

        it('should change paginationObj (from 1, to 6, prev 0, next 2)', function() {
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
    describe('CountSkipRows', function() {
        it('should change skip property of paginationObj to 0', function() {
            PostsModel.createConnection();
            PostsModel.connection.connect();
            mainUtils.pagination.skip = 0;
            mainUtils.pagination.postsPerPage = 10;
            PostsModel.getPostsWithUsers(mainUtils.pagination)
                .then(function (results) {
                    console.log(results[0]);
                });

        });
    });
});





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

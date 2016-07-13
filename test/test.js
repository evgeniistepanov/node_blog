var assert = require('chai').assert;

var index = require('../app/routes/index');
var mainUtils = require('../app/utils/main_utils');


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
});

var request = require('supertest');

var app = require('../../app');


describe('Categories pages', function () {
    describe('GET web-development category without page', function () {
        it('should return 200 status', function (done) {
            request(app)
                .get('/view_category/web-development')
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    done()
                });
        });
    });

    describe('GET web-development category with page 1', function () {
        it('should return 200 status', function (done) {
            request(app)
                .get('/view_category/web-development/page/1')
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    done()
                });
        });
    });

    describe('GET web-development category with page 2', function () {
        it('should return 200 status', function (done) {
            request(app)
                .get('/view_category/web-development/page/2')
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    done()
                });
        });
    });

    describe('GET web-development category with non-existent page 9999', function () {
        it('should return 404 status', function (done) {
            request(app)
                .get('/view_category/web-development/page/9999')
                .expect('location', '/404')
                .end(function (err, res) {
                    if (err) return done(err);
                    done()
                });
        });
    });

    describe('GET non-existent category (tetegsdkmgdksmad)', function () {
        it('should return 404 status', function (done) {
            request(app)
                .get('/view_category/tetegsdkmgdksmad')
                .expect('location', '/404')
                .end(function (err, res) {
                    if (err) return done(err);
                    done()
                });
        });
    });

});

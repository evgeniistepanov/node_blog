var request = require('supertest');

var app = require('../../app');

describe('Index pages', function () {
    describe('GET index page without page', function () {
        it('should return 200 status', function (done) {
            request(app)
                .get('/')
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    done()
                });
        });
    });
    describe('GET index page without page', function () {
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
    describe('GET index page without page', function () {
        it('should return 404 page because page number === 9999', function (done) {
            request(app)
                .get('/page/9999')
                .expect('location', '/404')
                .end(function (err, res) {
                    if (err) return done(err);
                    done()
                });
        });
    });

    describe('GET index page without page', function () {
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

    describe('GET 404 page', function () {
        it('should return 404 status', function (done) {
            request(app)
                .get('/404')
                .expect(404)
                .end(function (err, res) {
                    if (err) return done(err);
                    done()
                });
        });
    });
});
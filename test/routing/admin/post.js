var request = require('supertest');

var app = require('../../../app');

describe('GET Admin panel posts without page', function () {
    it('should return 200 status', function (done) {
        request(app)
            .get('/admin/posts')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                done()
            });
    });
});

describe('GET Admin panel posts with page 1', function () {
    it('should return 200 status', function (done) {
        request(app)
            .get('/admin/posts/page/1')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                done()
            });
    });
});

describe('GET Admin panel posts with page 6', function () {
    it('should return 200 status', function (done) {
        request(app)
            .get('/admin/posts/page/6')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                done()
            });
    });
});

describe('GET Admin panel posts with non-existent page 9999', function () {
    it('should return 200 status', function (done) {
        request(app)
            .get('/admin/posts/page/9999/')
            .expect('location', '/404')
            .end(function (err, res) {
                if (err) return done(err);
                done()
            });
    });
});

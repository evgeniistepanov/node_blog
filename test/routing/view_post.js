var request = require('supertest');

var app = require('../../app');


describe('GET View Post pages', function () {
    describe('GET post with id 1', function () {
        it('should return 200 status', function (done) {
            request(app)
                .get('/view_post/1')
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    done()
                });
        });
    });

    describe('GET post with id 51', function () {
        it('should return 200 status', function (done) {
            request(app)
                .get('/view_post/51')
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    done()
                });
        });
    });

    describe('GET post with non-existent id 4385329000', function () {
        it('should return 404 status', function (done) {
            request(app)
                .get('/view_post/4385329000')
                .expect('location', '/404')
                .end(function (err, res) {
                    if (err) return done(err);
                    done()
                });
        });
    });
});
var request = require('supertest');

var app = require('../../app');


describe('GET View User pages', function () {
    describe('GET user with login MoF', function () {
        it('should return 200 status', function (done) {
            request(app)
                .get('/view_user/MoF')
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    done()
                });
        });
    });

    describe('GET user with login Tird', function () {
        it('should return 200 status', function (done) {
            request(app)
                .get('/view_user/Tird')
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    done()
                });
        });
    });

    describe('GET user with non-existent login Tqqf233tgas1', function () {
        it('should return 404 status', function (done) {
            request(app)
                .get('/view_user/Tqqf233tgas1')
                .expect('location', '/404')
                .end(function (err, res) {
                    if (err) return done(err);
                    done()
                });
        });
    });
});
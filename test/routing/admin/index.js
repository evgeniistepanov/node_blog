var request = require('supertest');

var app = require('../../../app');

describe('GET Admin panel index page', function () {
    it('should return 200 status', function (done) {
        request(app)
            .get('/admin')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                done()
            });
    });
});
describe('GET Admin panel non-existent page blogs', function () {
    it('should return 404 status', function (done) {
        request(app)
            .get('/admin/blogs')
            .expect('location', '/404')
            .end(function (err, res) {
                if (err) return done(err);
                done()
            });
    });
});

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./app/routes/index');
var view_post = require('./app/routes/view_post');
var view_category = require('./app/routes/view_category');
var view_user = require('./app/routes/view_user');
var page_404 = require('./app/routes/page_404');
var admin = require('./app/routes/admin/index');
var admin_posts = require('./app/routes/admin/posts');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, '/node_modules')));

app.use('/node_modules/', express.static(__dirname + '/node_modules/'));
app.use('/public/', express.static(__dirname + '/public'));

app.use('/', index);
app.use('/view_post', view_post);
app.use('/view_category', view_category);
app.use('/view_user', view_user);

app.use('/admin', admin);
app.use('/admin/posts', admin_posts);

app.use('/404', page_404);
//app.use('/page/:number', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    /*    var err = new Error('Not Found');
     err.status = 404;
     next(err);*/
    res.status(404).render('page_404.html');
});

module.exports = app;
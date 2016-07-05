var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./app/routes/index');
var view_post = require('./app/routes/view_post');

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
//app.use('/page/:number', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
/*    var err = new Error('Not Found');
    err.status = 404;
    next(err);*/
    res.status(404).render('404.html');
});

var server = app.listen(3007, function() {
    var host = 'localhost';
    var port = server.address().port;
    console.log('App listening at http://%s:%s', host, port);
});

module.exports = app;
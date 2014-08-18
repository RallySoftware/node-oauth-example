var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');

var passport = require('./passport')();
var routes = require('./routes/index');
var testToken = require('./routes/test-token');

var app = express();

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(cookieSession({secret: 'ghostbusters'}));
app.use(passport.initialize());
app.use(passport.session());

app.use(routes);
app.use(testToken);

module.exports = app;

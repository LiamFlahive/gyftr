//These are all of your dependancies. Dont worry too much about these for now.
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();


//favicons are the little symbols you see in the browser tab. You can create your own and place it in /public!
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico'))); // uncomment after placing your favicon in /public

//ignore this. Too complicated right now. It was auto generated.
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
//this is saying look for all html/js/css files in the public folder.
// URL does not matter (i.e. we can host this anywhere. We currently are hosting on localhost:3000)
app.use(express.static(path.join(__dirname, 'public')));

//this is saying, when the URI is /[insert anything but 'users']
// go to ./routes/index.js for request handling.
// This will where you route between html pages.
app.use('/', routes);

app.use('/profile', routes);

//this is saying if the URI is /users/[insert anything] 
//go to ./routes/users.js for request handling. 
//This file is where you will eventually handle data requests. 
app.use('/users', users);

// catch 404 and forward to error handler (set up for you. just spits out errors if the page does not exist)
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
//nice feature but too complicated for now.
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
//nice feature but too complicated for now.
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

// //These are all of your dependancies. Dont worry too much about these for now.
// var express = require('express');
// var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
// var session = require('express-session');
// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');
// var url = require('url');

// var etsyjs = require('etsy-js');
// var client = etsyjs.client({
//   key: 'u78pp7t5m8r64kdinu48on4c',
//   secret: '971jw20t5h',
//   callbackURL: 'http://localhost:3000/authorise'
// });

// var routes = require('./routes/index');
// var users = require('./routes/users');

// var app = express();

// app.use(session());
// //favicons are the little symbols you see in the browser tab. You can create your own and place it in /public!
// //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico'))); // uncomment after placing your favicon in /public

// //ignore this. Too complicated right now. It was auto generated.
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser('secEtsy'));

// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');
// //this is saying look for all html/js/css files in the public folder.
// // URL does not matter (i.e. we can host this anywhere. We currently are hosting on localhost:3000)
// app.use(express.static(path.join(__dirname, 'public')));

// //this is saying, when the URI is /[insert anything but 'users']
// // go to ./routes/index.js for request handling.
// // This will where you route between html pages.
// app.use('/', routes);

// app.get('/', function(req, res) {
//   return client.requestToken(function(err, response) {
//     if (err) {
//       return console.log(err);
//     }
//     req.session.token = response.token;
//     req.session.sec = response.tokenSecret;
//     return res.redirect(response.loginUrl);
//   });
// });

// app.use('/profile', routes);

// //this is saying if the URI is /users/[insert anything] 
// //go to ./routes/users.js for request handling. 
// //This file is where you will eventually handle data requests. 
// app.use('/users', users);

// app.get('/authorise', function(req, res) {
//   var query, verifier;
//   query = url.parse(req.url, true).query;
//   verifier = query.oauth_verifier;
//   return client.accessToken(req.session.token, req.session.sec, verifier, function(err, response) {
//     req.session.token = response.token;
//     req.session.sec = response.tokenSecret;
//     return res.redirect('/find');
//   });
// });

// app.get('/find', function(req, res) {
//   return client.auth(req.session.token, req.session.sec).user("etsyjs").find(function(err, body, headers) {
//     if (err) {
//       console.log(err);
//     }
//     if (body) {
//       console.dir(body);
//     }
//     if (body) {
//       return res.send(body.results[0]);
//     }
//   });
// });

// var etsyUser = client.user('sparkleprincess');

// etsyUser.find(function(err, body, headers) {
//   console.log("error: " + err);
//   console.log("data: " + body);
//   console.log("headers:" + headers);
// });
// // catch 404 and forward to error handler (set up for you. just spits out errors if the page does not exist)
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// // error handlers

// // development error handler
// // will print stacktrace
// //nice feature but too complicated for now.
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }

// // production error handler
// // no stacktraces leaked to user
// //nice feature but too complicated for now.
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });


// module.exports = app;

var app, client, cookieParser, etsyjs, express, server, session, url;

express = require('express');
var path = require('path');
session = require('express-session');
var bodyParser = require('body-parser');
cookieParser = require('cookie-parser');

url = require('url');

etsyjs = require('etsy-js');

client = etsyjs.client({
  key: 'u78pp7t5m8r64kdinu48on4c',
  secret: '971jw20t5h',
  callbackURL: 'http://localhost:3000/authorise'
});

app = express();

app.use(cookieParser('secEtsy'));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
  return client.requestToken(function(err, response) {
    if (err) {
      return console.log(err);
    }
    req.session.token = response.token;
    req.session.sec = response.tokenSecret;
    return res.redirect(response.loginUrl);
  });
});

app.get('/authorise', function(req, res) {
  var query, verifier;
  query = url.parse(req.url, true).query;
  verifier = query.oauth_verifier;
  return client.accessToken(req.session.token, req.session.sec, verifier, function(err, response) {
    req.session.token = response.token;
    req.session.sec = response.tokenSecret;
    return res.redirect('/find');
  });
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/find', function(req, res) {
  return client.auth(req.session.token, req.session.sec).user("liamflahive").find(function(err, body, headers) {
    if (err) {
      console.log(err);
    }
    if (body) {
      console.dir(body);
    }
    if (body) {
       res.render('index.html', { title: 'Welcome' });
    }
  });
});

// app.get('/test', function(req, res) {
//     client.get('/listings/active', {keywords:"jewelery", sort_on:"score", limit: 1, min_price: 100, max_price: 500}, function (err, status, body, headers) {
//       console.dir(body); //json object 
//     });
//   });

app.post('/gift', function(req, res) {
  console.log(req.body.kword);
  var kword = req.body.kword;
  client.get('/listings/active', {keywords: kword, sort_on:"score", limit: 1, min_price: 100, max_price: 500}, function (err, status, body, headers) {
      console.dir(body); //json object 
      res.redirect(body.results[0].url);
    });
  });


server = app.listen(3000, function() {
  return console.log('Listening on port %d', server.address().port);
});

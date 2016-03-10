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
  callbackURL: 'gyftr.herokuapp.com/authorise'
});

app = express();

app.use(cookieParser('secEtsy'));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res){
  res.render('profile.html', {title:"Welcome"})
});

app.get('/start', function(req, res) {
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
      //res.send(body.results[0]);
      res.redirect('/home')
    }
  });
});

app.get('/home', function(req, res){
  res.render('index.html', { title: 'Welcome' });
});
// app.get('/test', function(req, res) {
//     client.get('/listings/active', {keywords:"jewelery", sort_on:"score", limit: 1, min_price: 100, max_price: 500}, function (err, status, body, headers) {
//       console.dir(body); //json object 
//     });
//   });

app.post('/gift', function(req, res) {
  var kword = req.body.kword;
  var min = req.body.minPrice;
  var max = req.body.maxPrice;
  console.log(kword,min,max);
  client.get('/listings/active', {keywords: kword, sort_on:"score", limit: 1, min_price: min, max_price: max}, function (err, status, body, headers) {
      //res.redirect(body.results[0].url);
     // console.log(body.results[0].url);
      res.send(body.results[0].url);
    });
  });


server = app.listen(process.env.PORT || 3000, function() {
  return console.log('Listening on port %d', server.address().port);
});

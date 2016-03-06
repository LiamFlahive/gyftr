var express = require('express');
var router = express.Router();

//This file is going to be doing the routing from page to page of the site.
//The home page is already made.
//When you decide you need new pages, 
//you can create a get request handler much like this one to serve up a new html page

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html', { title: 'Tutorial' }); //this line is what serves up your html page when you go to http://localhost:3000/
});

//b
router.get('/profile', function(req, res, next) {
	res.render('./profile.html', { title: 'Profile' }); 
});

module.exports = router;

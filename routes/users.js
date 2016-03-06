var express = require('express');
var router = express.Router();

//Ignore this file until we start adding a database

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/hi', function(req, res, next) {
  res.send('respond with a different resource');
});


module.exports = router;

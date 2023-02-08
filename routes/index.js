var express = require('express');
var router = express.Router();
var dummyData = require('../public/data/data');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/index/dummyData', function(req, res, next) {
  res.send(dummyData);
});

module.exports = router;

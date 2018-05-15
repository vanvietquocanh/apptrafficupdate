var express = require('express');
var router = express.Router();
var passport = require("passport");

/* GET home page. */
router.get('/', function(req, res, next) {
	passport.authenticate('facebook',{session: true})(req, res, function () {
  		res.redirect('/dashboard');
  		res.end();
	});
});

module.exports = router;

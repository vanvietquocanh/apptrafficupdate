var express = require('express');
var router = express.Router();
var passport = require("passport")
// var firebase = require('firebase');

/* GET users listing. */
router.get('/', passport.authenticate('facebook'));

module.exports = router;

var express = require('express');
var router = express.Router();
const country = require("./country");

/* GET home page. */
router.get('/', function(req, res, next) {
	var arrayCountry = {
		"message" : "ok",
		"country" : country.toString()
	};
	res.send(arrayCountry)
});

module.exports = router;

var express = require('express');
var router = express.Router();
var ProxyVerifier = require('proxy-verifier');
var request = require("request");
var geoip = require('geoip-lite');

/* GET home page. */
router.get('/:parameter', function(req, res, next) {
	if(req.params.parameter === "port"){
		var data = {
			"au" : "51.15.8.177:4201",
			"kr" : "51.15.8.177:4203",
			"de" : "51.15.8.177:4204",
			"in" : "51.15.8.177:4205",
			"id" : "51.15.8.177:4206",
			"tw" : "51.15.8.177:4207",
			"jp" : "51.15.8.177:4208",
			"vn" : "51.15.8.177:4209",
			"th" : "51.15.8.177:4210",
			"br" : "51.15.8.177:4211",
			"es" : "51.15.8.177:4212",
			"tr" : "51.15.8.177:4213",
			"ru" : "51.15.8.177:4214",
			"fr" : "51.15.8.177:4215",
			"sa" : "51.15.8.177:4216",
			"ae" : "51.15.8.177:4217",
			"kw" : "51.15.8.177:4218",
			"mx" : "51.15.8.177:4219",
			"cn" : "51.15.8.177:4220",
			"us" : "107.181.72.101:10268",
			"gb" : "78.157.202.44:10268",
			"ca" : "66.78.23.99:10268",
			"cn" : "167.88.102.79:38325"
		};
		if(data[req.query.country.toLowerCase()] !== undefined){
			var dataRespon = {};
				dataRespon[`${req.query.country.toLowerCase()}`] = data[req.query.country.toLowerCase()];
				res.send(dataRespon);
		}else{
			res.send("error");
		}
	}
});

module.exports = router;

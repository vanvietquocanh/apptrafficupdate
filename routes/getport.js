var express = require('express');
var router = express.Router();
var ProxyVerifier = require('proxy-verifier');
var request = require("request");
var geoip = require('geoip-lite');

/* GET home page. */
router.get('/:parameter', function(req, res, next) {
	if(req.params.parameter === "port"){
		var data = {
			"ar" : "51.15.8.175:1702",
			"sa" : "51.15.8.175:1703",
			"sg" : "51.15.8.175:1704",
			"id" : "51.15.8.175:1705",
			"in" : "51.15.8.175:1706",
			"hk" : "51.15.8.175:1707",
			"tw" : "51.15.8.175:1708",
			"my" : "51.15.8.175:1709",
			"ph" : "51.15.8.175:1710",
			"kr" : "51.15.8.175:1711",
			"eg" : "51.15.8.175:1712",
			"tr" : "51.15.8.175:1713",
			"es" : "51.15.8.175:1714",
			"ru" : "51.15.8.175:1716",
			"jp" : "51.15.8.175:1717",
			"vn" : "51.15.8.175:1718",
			"br" : "51.15.8.175:1719",
			"de" : "51.15.8.175:1720",
			"cn" : "51.15.8.175:1721",
			"th" : "51.15.8.175:1722",
			"fr" : "51.15.8.175:1723",
			"ae" : "51.15.8.175:1724",
			"us" : "107.181.72.12:14448",
			// "gb" : "78.157.202.44:10268",
			// "ca" : "66.78.23.99:10268",
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
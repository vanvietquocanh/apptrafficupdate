var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');
const fs = require("fs");
const pathMongodb = require("./pathDb");

/* GET home page. */
router.get('/:value', function(req, res, next) {
	try{
		if(req.params.value==="get"){
			var platformSet = "", nameNetworkSet = "", country = "";
			if(req.query.platform!==undefined){
				platformSet = req.query.platform.toUpperCase();
			}
			if(req.query.network!==undefined){
				nameNetworkSet = req.query.network.toLowerCase();
			}
			if(req.query.country!==undefined){
				country = req.query.country.toUpperCase();
			}
			fs.readFile("./OfferList.txt", (err, data)=>{
				if(!err){
					var dataResponse = data.toString("utf8").split("\r\n").filter(function(app) {
						return (app.indexOf(country)!==-1&&app.indexOf(platformSet)!==-1&&app.indexOf(nameNetworkSet)!==-1)&&app!=="";
					});
					res.send(dataResponse);
				}
			});
		}
	} catch(e) {
		res.redirect("/");
		res.end();
	}
});

module.exports = router;
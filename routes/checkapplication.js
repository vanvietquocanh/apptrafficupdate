var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');
var store = require('app-store-scraper');
const pathMongodb = require("./pathDb");
var request = require("request");

/* GET home page. */
router.post('/', function(req, res, next) {
	function checkAppGoogle(path) {
		request(path, (err, data, xhr)=>{
			if(data.body.indexOf("We're sorry, the requested URL was not found on this server.")!==-1){
				res.send("error");
			}else{
				var app = {};
				app.icon = data.body.split(`<div class="dQrBL"><img aria-hidden="true" src=`)[1].split("</div>")[0].split(`"`)[1];
				app.title = data.body.split(`<h1 class="AHFaub" itemprop="name">`)[1].split("</h1>")[0].split("<span >")[1].split("</span>")[0];
				res.send(app);
			}
		})
	}
	try {
		if(req.body.url.indexOf("market://")!==-1||req.body.url.indexOf("play.google.com")!==-1){
 			let id = "";
 			if(req.body.url.indexOf("market://")!==-1){
 				id += req.body.url.split("id=")[1].split("&")[0];
 			}else{
 				id += req.body.url.split("id=")[1].split("&")[0];
 			}
			checkAppGoogle(`https://play.google.com/store/apps/details?id=${id}&country=us&lang=en`)
		}else if (req.body.url.indexOf("itunes.apple.com")!==-1){
			let id = req.body.url.split("/id")[1].split("?")[0];
			store.app(
						{
							id: id
						}
					)
			.then(data=>{
				res.send(data)
			})
			.catch((err)=>{
				res.send("http://rockettraffic.org/assets/images/apple.png")
			})
		}else{
			var error = {
				"message" : "error",
				"url"	  : req.body.url
			}
			res.send(error)
		}
	} catch(e) {
		res.redirect("/")
	}
});

module.exports = router;

var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');
var randomstring = require("randomstring");
const pathMongodb = require("./pathDb");

router.get('/', function(req, res, next) {
	var querySearchOffer = {
		"index" : Number(req.query.offer_id)
	}
	function redirectAPI(app, db) {
		try {
			var queryNetwork = {
				"name" : new RegExp(app.nameNetworkSet, "i")
			}
			var strRandom = randomstring.generate();
			db.collection('network').findOne(queryNetwork, function(err,result){
				assert.equal(null,err);
				if(!err){
					if(result){
						var link = `${app.urlSet}+&${result.postback}=${strRandom}`;
						res.redirect(link);
					}
				}else{
					res.send("error")
				}
				assert.equal(null,err);
				db.close();
			});
		} catch(e) {
			console.log(e);
		}
	}
	if(req.query.offer_id!==undefined&&!(isNaN(req.query.offer_id))){
		mongo.connect(pathMongodb,function(err,db){
			assert.equal(null,err);
			db.collection('offer').findOne(querySearchOffer, function(err,result){
				if(!err){
					if(result){
						redirectAPI(result, db);
					}
				}else{
					res.redirect("/");
				}
			})
		});
	}else {
		res.send("error");
	}
});

module.exports = router;
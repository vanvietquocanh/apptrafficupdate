var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');
const request = require("request");
const pathMongodb = require("./pathDb");
var gplay = require('google-play-scraper');

router.get('/:value', function(req, res, next) {
	function checkGoogleApp(id) {
		try {
			mongo.connect(pathMongodb, (err, db)=>{
				gplay.app({appId: id})
				.then(data=>{
					var dataApp = {
						image   : data.icon,
						id 	    : id,
						platform: "android"
					}
					db.collection("imagesIcon").updateOne({id : dataApp.id}, {$set:dataApp},{ upsert: true },(err, result)=>{
						if(!err){
							db.collection("offer").updateMany({idApp:id}, {$set:{imgSet:dataApp.image}}, (err,result)=>{
								db.collection("Offerlead").updateMany({idApp:id}, {$set:{imgSet:dataApp.image}}, (err,result)=>{
									res.send(dataApp);
								})
							})
						}else{
							res.send(err)
						}
						db.close();
					})
				})
				.catch(err=>{
					res.send("error")
				})
			})
		} catch(e) {
			res.send("error")
		}
	}
	function checkAppleApp(id, country) {
		try {
			mongo.connect(pathMongodb,(err, db)=>{
				var path = "";
					if(country){
					 	path = `https://itunes.apple.com/${country.split(",")[0]}/lookup?id=${id}`;
					}else{
					 	path = `https://itunes.apple.com/lookup?id=${id}`;
					}
					request.get(path ,(err, respon, data)=>{
						try {
							if(data&&JSON.parse(data).resultCount!==0){
								var appData = {
									image   : JSON.parse(data).results[0].artworkUrl100,
									id 	    : id,
									platform: "ios"
								}
								db.collection("imagesIcon").updateOne({id : appData.id}, {$set:appData}, { upsert: true },(err, result)=>{
									if(!err){
										db.collection("offer").updateMany({idApp:id}, {$set:{imgSet:appData.image}}, (err,result)=>{
											db.collection("Offerlead").updateMany({idApp:id}, {$set:{imgSet:appData.image}}, (err,result)=>{
												res.send(appData);
											})
										})
									}else{
										res.send("error");
									}
									db.close();
								})
							}else{
								res.send("error");
							}
						} catch(e) {
							res.send("error");
						}
					})
			})
		} catch(e) {
			res.send(e);
		}
		
	}
	if(req.params.value === "api"){
		mongo.connect(pathMongodb,(err,db)=>{
			if(req.query){
				var query = req.query;
				if(req.query.id){
					query.id = req.query.id;
				}
				if(req.query.platform){
					query.platform = req.query.platform;
				}
				db.collection("imagesIcon").findOne(query ,(err,result)=>{
					if(!err){
						if(result){
							res.send(result);
						}else{
							if(req.query.id){
								if(req.query.platform==="android"){
									checkGoogleApp(req.query.id)
								}else if(req.query.platform==="ios"){
									if(req.query.country){
										checkAppleApp(req.query.id, req.query.country)
									}else{
										checkAppleApp(req.query.id, false)
									}
								}
							}
						}
					}
				})
			}else{
				res.send("error")
			}
		})
	}else{
		res.send("error");
	}
});

module.exports = router;

var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');
const request = require("request");
const pathMongodb = require("./pathDb");
var gplay = require('google-play-scraper');
var ObjectId = mongo.ObjectId;
/* GET home page. */
var dataResponse, index = 0;

router.post('/', function(req, res, next) {
  	try {
  		function checkAndroid(id){
  			gplay.app({appId: id})
			.then(data=>{
					var dataApp = {
						image   : data.icon,
						id 	    : id,
						platform: "android"
					}
					mongo.connect(pathMongodb,(err,db)=>{
						db.collection("imagesIcon").updateOne({id : dataApp.id}, {$set:dataApp},{ upsert: true },(err, result)=>{
							db.collection("offer").updateOne({"index":Number(dataResponse[index].index)}, {$set:{imgSet:data.icon}}, (err, result)=>{
								db.collection("Offerlead").updateOne({"index":Number(dataResponse[index].index)}, {$set:{imgSet:data.icon}}, (err, result)=>{
									checkIconApp(dataResponse, index++);
									db.close();
								})
							})
						})
					})
			})
			.catch(err=>{
				dataResponse[index].imgSet = `http://${req.headers.host}/assets/images/android-big.png`;
				dataResponse[index].idApp = id;
				checkIconApp(dataResponse, index++);
	  		})
  		}
  		function checkAppApple(id, country) {
  			var path;
			if(/([0-9])+/.test(id)){
				if(country==="GLOBAL"){
					country = "US";
				}else if(country.split(",")[0]==="UK"){
					country = "GB";
				}
				path = `https://itunes.apple.com/${country.split(",")[0]}/lookup?id=${id.split("id").join("")}`;
				request.get(path ,(err, response, data)=>{
					try {
						if(data&&JSON.parse(data).resultCount!==0&&JSON.parse(data).results[0].artworkUrl100!==undefined){
							var appData = {
								image   : JSON.parse(data).results[0].artworkUrl100,
								id 	    : id,
								platform: "ios"
							}
							mongo.connect(pathMongodb,(err,db)=>{
								db.collection("imagesIcon").updateOne({id : appData.id}, {$set:appData},{ upsert: true },(err, result)=>{
									var query = dataResponse[index]._id;
									delete dataResponse[index]._id;
									db.collection("offer").updateOne({"index":Number(dataResponse[index].index)}, {$set:{imgSet: JSON.parse(data).results[0].artworkUrl100}}, (err, result)=>{
										db.collection("Offerlead").updateOne({"index":Number(dataResponse[index].index)}, {$set:{imgSet: JSON.parse(data).results[0].artworkUrl100}}, (err, result)=>{
											checkIconApp(dataResponse, index++);
											db.close();
										})
									})
								})
							});
						}else{
							dataResponse[index].imgSet = `http://${req.headers.host}/assets/images/apple-big.png`;
							checkIconApp(dataResponse, index++);
						}
					} catch(e) {
						dataResponse[index].imgSet = `http://${req.headers.host}/assets/images/apple-big.png`;
						checkIconApp(dataResponse, index++);
					}
				})
			}else{
				dataResponse[index].imgSet = `http://${req.headers.host}/assets/images/apple-big.png`;
				checkIconApp(dataResponse, index++);
			}
  		}
  		function checkIconApp(arrayApp) {
  			try {
  				if(arrayApp[index]){
	  				if(index === arrayApp.length-1){
		  				res.send("success")
		  			}else{
			  			switch (arrayApp[index].platformSet.toLowerCase()) {
			  				case "ios":
			  					if(arrayApp[index].countrySet){
			  						checkAppApple(arrayApp[index].idApp, arrayApp[index].countrySet, index);
			  					}else{
			  						dataResponse[index].imgSet = `http://${req.headers.host}/assets/images/apple-big.png`;
									checkIconApp(dataResponse, index++);
			  					}
			  					break;
			  				case "android":
			  					checkAndroid(arrayApp[index].idApp, index);
			  					break;
			  			}
		  			}
	  			}
  			} catch(e) {
  				console.log(e);
  			}
  		}
  		if(req.user){
  			mongo.connect(pathMongodb, (err, db)=>{
  				db.collection("userlist").findOne({"idFacebook" : req.user.id}, (err, result)=>{
  					if(!err&&result){
  						if(result.admin){
  							try {
  								var query = {
  									imgSet : {
  										$not : new RegExp("(http(s?))\:\/\/", "i")
  									}
  								};
  								if(req.body.country){
  									query.countrySet = new RegExp(req.body.country, "i");
  								}
  								if(req.body.platform){
  									query.platformSet = new RegExp(req.body.platform, "i");
  								}
  								if(req.body.network){
  									query.nameNetworkSet = new RegExp(req.body.network, "i");
  								}
				  				db.collection("offer").find(query).toArray((err, result)=>{
					  				if(!err){
					  					if(result.length>0){
					  						dataResponse = result;
						  					checkIconApp(dataResponse);
					  					}
					  				}else {
					  					res.send("error");
					  				}
					  			})
				  			} catch(e) {
				  				res.send("error");
				  			}
  						}else{
							res.send("error");
  						}
  					}else{
						res.send("error");
  					}
  				})
  			})
  		}else{
  			res.send("fuck u :))");
  		}
	} catch(e) {
		res.send("error");
	}
});

module.exports = router;
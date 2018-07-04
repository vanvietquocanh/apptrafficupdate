var express = require('express');
var router = express.Router();
var request = require("request")
const mongo = require('mongodb');
const pathMongodb = require("./pathDb");

var regexID = /id=+([A-Za-z])+\.+([A-Za-z.])+|id+[0-9]+/
var apple = /itunes/
var market = /market|play.google.com/
var isAppsLive = /market|play.google.com|itunes/
/* GET users listing. */
router.post('/', function(req, res, next) {
	function testOffer(){
		var data = {
			"Url" : req.body.url,
			"Os"  : req.body.platform,
			"Country": req.body.country,
			"Ipaddress": "113.160.224.195",
			"Pass":"aksjdhqwlwrhoqihewna",
			"User":"vanvietquocanh",
			"Domain": `http://${req.headers.host}`
		}
		request.post( "http://113.160.224.195:88/api/Offer"
		, {form : data }, (err, body, data)=>{
			var dataRes = JSON.parse(data)
			var platform;
			if(dataRes.message){
				var id;
				if(isAppsLive.test(dataRes.message)&&regexID.test(dataRes.message)){
					if(apple.test(dataRes.message)){
						platform = "ios";
						id = dataRes.message.match(regexID)[0].split("d")[1];
					}else{
						id = dataRes.message.match(regexID)[0].split("d=")[1];
						platform = "android";
					}
					request.get(`http://rockettraffic.org/infoapp/api?platform=${platform}&id=${id}`, (err, body, responseGet)=>{
						if(responseGet!=="error"){
							dataRes.icon = JSON.parse(responseGet).image;
						}else{
							dataRes.icon = responseGet
						}
						res.send(dataRes)
					})
				}else{
					res.send(dataRes)
				}
			}
		})
	}
	function checkUser(){
		mongo.connect(pathMongodb, (err, db)=>{
			db.collection("offerTest").findOne({"ip" : req.headers["x-real-ip"]}, (err,result)=>{
				if(!err){
					var seconds = new Date();
					var dateNow = `${seconds.getDate()} - ${seconds.getMonth()+1} - ${seconds.getFullYear()}`
					if(result){
						if(result.date === dateNow){
							if(result.count < 5){
								db.collection("offerTest").updateOne({"ip" : req.headers["x-real-ip"]}, {$set:{count:result.count++}}, (err,result)=>{
									if(!err){
										db.close();
										testOffer();
									}else{
										db.close();
										res.send(err)
									}
								})
							}else{
								db.close();
								res.send("Today you used too many times. Please contact us for more usage")
							}
						}else{
							db.collection("offerTest").updateOne({"ip" : req.headers["x-real-ip"]}, {$set:{count : 0, date : dateNow}}, (err,result)=>{
								if(!err){
									db.close();
									testOffer();
								}else{
									db.close();
									res.send(err)
								}
							})
						}				
					}else{
						var data = {
							ip : req.headers["x-real-ip"],
							date : dateNow,
							count : 0
						}
						db.collection("offerTest").updateOne({"ip" : req.headers["x-real-ip"]}, data, {upsert : true}, (err,result)=>{
							if(!err){
								db.close();
								testOffer();
							}
						})		
					}
				}else{
					db.close();
					res.send(err)
				}
			})
		});
	}
	req.socket.setTimeout(3600e3);
	if(req.body){
		if(req.user===undefined){
			if(req.headers["x-real-ip"]){
				checkUser()
			}else{
				res.send("Error Check IP address!")
			}
		}else{
			mongo.connect(pathMongodb, (err, db)=>{
				db.collection("userlist").findOne({"idFacebook": req.user.id }, (err, result)=>{
					if(!err){
						if(result.member||result.master||result.admin){
							testOffer();
						}else{
							if(req.headers["x-real-ip"]){
								checkUser()
							}else{
								res.send("Error Check IP address!")
							}
						}
					}
				})
			})
		}
	}
});
module.exports = router;
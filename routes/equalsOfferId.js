var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');
const request = require("request")

const pathMongodb = require("./pathDb");

/* GET home page. */
router.get('/:value', function(req, res, next) {
	if(req.params.value==="offerid"){
		try {
			var equalsOffer = new EqualsOffer();
			function EqualsOffer(){
				this.listOfferNew;
				this.listOfferOld;
				this.countRequest = 0;
				this.countCustomInNetwork = 0;
				this.itemLead;
				this.arrayDadaPushToDatabase = [];
			}
			EqualsOffer.prototype.connectMongo = function() {
				
			};
			EqualsOffer.prototype.callRequestGet = (network, db, query) =>{
				try {
					request.get({
					    url: network.link
					}, function (err, respon) {
					   equalsOffer.changeData(network, db, query, respon.body) 	
					});
				} catch(e) {
					equalsOffer.callRequestGet(network, db, query);
				}
			}
			EqualsOffer.prototype.changeData = (network, db, query, respon) =>{
				equalsOffer.countRequest++;
				var data = JSON.parse(respon);
				var dataChecker = data;
				for(let i = 0; i < network.custom.data.split(",").length; i++){
					dataChecker = dataChecker[`${network.custom.data.split(",")[i].trim()}`];
				}
				for(let z = 0; z < dataChecker.length; z++){
					dataChecker[z].nameNetworkSet = network.name;
					dataChecker[z].index = z;
					for(var j = 1; j < Object.keys(network.custom).length; j++){
						dataChecker[z][`${Object.keys(network.custom)[j].trim()}`] = dataChecker[z][`${network.custom[Object.keys(network.custom)[j]].trim()}`];
						delete dataChecker[z][`${network.custom[Object.keys(network.custom)[j]].trim()}`];
					}
					equalsOffer.arrayDadaPushToDatabase.push(dataChecker[z])
					equalsOffer.itemLead = z;
				}//this is loop change keys of value;
				if(equalsOffer.countRequest===equalsOffer.countCustomInNetwork){
					try{
						var dataSave = {
				    		$set:{
				    			"offerList": equalsOffer.arrayDadaPushToDatabase 
				    		}
				    	}
						db.collection('userlist').updateOne(query, dataSave, {upsert: true}, (err,result)=>{
							if(!err){
								console.log("ok")
							}
						})
					}catch(e){
						console.log("Error connect Database. Please retry!!!")
					}
					db.close();
				}
			}
			EqualsOffer.prototype.callRequestPost = (network, db, query) =>{
				try {
					request.post({
					    url: network.link
					}, function (err, respon) {
						equalsOffer.changeData(network, db, query, respon.body)
					});
				} catch(e) {
					equalsOffer.callRequestPost(network, db, query);
				}
			}
			EqualsOffer.prototype.requetEmpty = (network, query) =>{
				var reset = {
					$set : {
						"offerList" : []
					}
				}
				mongo.connect(pathMongodb,function(err,db){
					assert.equal(null,err);
					db.collection("userlist").updateOne(query, reset, (err, result)=>{
						if(!err){
							network.forEach((api, index)=>{
								if(api.custom){
									equalsOffer.countCustomInNetwork++;
									switch (api.method) {
										case "GET":
												equalsOffer.callRequestGet(api, db, query)
											break;
										case "POST":
												equalsOffer.callRequestPost(api, db, query)
											break;
									}
								}
							})
						}
					})
				})
			}
			EqualsOffer.prototype.findLinkAPI = (querySearchEmpty) =>{
				mongo.connect(pathMongodb, (err, db)=>{
					let query = {
						"isNetwork" : true
					}
					db.collection("userlist").findOne(query, (err, result)=>{
						equalsOffer.requetEmpty(result.NetworkList, querySearchEmpty)
					})
				})
			}
			var q = {
				"isNewOffter" : true 
			}
			equalsOffer.findLinkAPI(q);
			setInterval(()=>{
				var querySearchEmpty = {
					"isNewOffter" : true
				};
				equalsOffer.findLinkAPI(querySearchEmpty);
			},24*60*60*1000)
			setInterval(()=>{
				var querySearchEmpty = {
					"isOldOffter" : true
				};
				equalsOffer.findLinkAPI(querySearchEmpty);
			},10800000);
		} catch(e) {
			console.log(e);
		}
	}
});

module.exports = router;

var express = require('express');
var router = express.Router();
var request = require("request");
const mongo = require('mongodb');
const assert = require('assert');
const fs = require("fs");

const pathMongodb = require("./pathDb");

router.post('/', function(req, res, next) {
	var requestApi = new RequestAPI();
	function RequestAPI() {
		this.arrayDadaPushToDatabase = [];
		this.arIndexDel = [];
		this.countCustomInNetwork = 0;
		this.dataSave;
		this.textWrite = "";
		this.dataTotal = [];
		this.lengthArray = 0;
		this.totalArray = [];
		this.max = 0;
	}
	RequestAPI.prototype.loopOrder = function(respon, network) {
		var value;
		network.custom.data.split(",").forEach( function(element, index) {
			if(JSON.parse(respon.body)[`${element}`].length>0){
				value = true;
			}else{
				value = false;
			}
		});
		return value;
	};
	RequestAPI.prototype.callRequestGet = (network, db) =>{
		try {
			request.get({
			    url: network.link
			}, function (err, respon) {
				if(requestApi.loopOrder(respon, network)){
			   		requestApi.changeData(network, db, respon.body)
				}else{
					requestApi.callRequestGet(network, db);
				}
			});
		} catch(e) {
			requestApi.callRequestGet(network, db);
		}
	}
	RequestAPI.prototype.changeKeyOject = function(respon, network) {
		requestApi.arrayDadaPushToDatabase = [];
		requestApi.countRequest++;
		var data = JSON.parse(respon);
		var dataChecker = data;
		requestApi.lengthArray += data.length;
		for(let i = 0; i < network.custom.data.split(",").length; i++){
			dataChecker = dataChecker[`${network.custom.data.split(",")[i].trim()}`];
		}
		for(let z = 0; z < dataChecker.length; z++){
			dataChecker[z].nameNetworkSet = network.name;
			for(var j = 1; j < Object.keys(network.custom).length; j++){
				dataChecker[z][`${Object.keys(network.custom)[j].trim()}`] = dataChecker[z][`${network.custom[Object.keys(network.custom)[j]].trim()}`];
				delete dataChecker[z][`${network.custom[Object.keys(network.custom)[j]].trim()}`];
			}
			requestApi.max++;
			dataChecker[z].index = requestApi.max;
			requestApi.arrayDadaPushToDatabase.push(dataChecker[z])
		}//this is loop change keys of value;
	};
	RequestAPI.prototype.writeFileText = function(db) {
		db.collection("offer").find().toArray((err, result)=>{
			if(result!==undefined){
				result.forEach( function(element, index) {
					var countryFix;
					if(element.countrySet.length>3){
						countryFix = element.countrySet.split("|").join(',');
					}else{
						countryFix = element.countrySet;
					}
					requestApi.textWrite += `http://${req.headers.host}/checkparameter/?offer_id=${element.index}&aff_id=${req.user.id}|${countryFix}|${element.platformSet.toUpperCase()}\r\n`;
				});
			}
			fs.writeFile("OfferList.txt", requestApi.textWrite, (err)=>{
				if(err){
					throw err;
				}else {
					res.send("Successfully saved MongoDB data!");
				}
			});
			db.close();
		})
	};
	RequestAPI.prototype.changeData = (network, db, respon) =>{
		requestApi.countCustomInNetwork++;
			db.collection("offer").find().sort({index:-1}).limit(1).toArray((err, result)=>{
				if(!err){
					if(result.length===0){
						requestApi.max = 0;
						requestApi.changeKeyOject(respon, network, requestApi.max);
						db.collection('offer').insertMany(requestApi.arrayDadaPushToDatabase ,(err,result)=>{
							if(!err){
								if(network.length===requestApi.countCustomInNetwork){
									requestApi.writeFileText(db);
								}
							}else{
								console.log(err)
							}
						})
					}else{
						if(requestApi.countCustomInNetwork===1){
							requestApi.max = Number(result[0].index);
						}
						requestApi.changeKeyOject(respon, network);
						db.collection("offer").find().toArray((err, value)=>{
							if(!err){
								value.forEach( function(element, index) {
									requestApi.arrayDadaPushToDatabase.forEach((items, index)=>{ 
										if(items.offeridSet === element.offeridSet&&items.nameNetworkSet === element.nameNetworkSet&& items.nameSet === element.nameSet){
											requestApi.arIndexDel.push(index);
										}
									});
								});
								for(var i = requestApi.arIndexDel.length; i >= 0; i--){
									requestApi.arrayDadaPushToDatabase.splice(requestApi.arIndexDel[i], 1)
								}
								if(requestApi.arrayDadaPushToDatabase.length>0){
									var count = result[0].index++;
									for (var i = 0; i < requestApi.arrayDadaPushToDatabase.length; i++) {
										requestApi.arrayDadaPushToDatabase[i].index = Number(result[0].index)+i;
									}
									db.collection("offer").insertMany(requestApi.arrayDadaPushToDatabase,(err,result)=>{
										if(!err){
											requestApi.writeFileText(db);
										}
									})
								}
							}
						})
					}
				}
		})
	}
	RequestAPI.prototype.callRequestPost = (network, db) =>{
		try {
			request.post({
			    url: network.link
			}, function (err, respon) {
				countRequestAuto++;
				if(requestApi.loopOrder(respon, network)){
			   		requestApi.changeData(network, db, respon.body)
				}else{
					requestApi.callRequestPost(network, db);
				}
			});
		} catch(e) {
			requestApi.callRequestPost(network, db);
		}
	}
	RequestAPI.prototype.requetEmpty = (network, db) =>{
		network.forEach((api, index)=>{
			if(api.custom){
				switch (api.method) {
					case "GET":
							requestApi.callRequestGet(api, db)
						break;
					case "POST":
							requestApi.callRequestPost(api, db)
						break;
				}
			}
		})
	}
	try{
		RequestAPI.prototype.findLinkAPI = (db) =>{
			let query = {
				"isNetwork" : true
			}
			db.collection("network").findOne(query, (err, result)=>{
				requestApi.requetEmpty(result.NetworkList, db)
			})
		}
		var query = {
			"idFacebook" : req.user.id
		}
		mongo.connect(pathMongodb,function(err,db){
			assert.equal(null,err);
				db.collection('userlist').findOne(query,function(err,result){
					if(result.admin){
						requestApi.findLinkAPI(db)
					}else{
						res.send("Mày đéo phải admin");
					}
				assert.equal(null,err);
			});
		});
	}catch(e){
		res.redirect("/")
		res.end();
	}
});

module.exports = router;
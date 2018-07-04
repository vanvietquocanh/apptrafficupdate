var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');

const pathMongodb = require("./pathDb");

/* GET home page. */
router.get('/:value', function(req, res, next) {
	if(req.params.value==="cvr"){
		try {
			mongo.connect(pathMongodb, (err, db)=>{
				db.collection("conversion").aggregate([{$match:{"seconds": { $gt: new Date().getTime()-24*60*60*1000 }}},{$group:{_id: {_id:"$idOffer", idOfferNet: "$idOfferNet", networkName:"$networkName", country: "$country", platformSet : "$platfrom", nameApp:"$appName"}, count :{$sum:1}}}], (err,conversion)=>{
					if(!err){
						// var queryArr = [];
						// for (var i = 0; i < result.length; i++) {
						// 	queryArr.push({$and : [{"idOfferNet" : result[i]._id.idOfferNet, "networkName" : result[i]._id.networkName, "country" : result[i]._id.country, "seconds": { $gt: new Date().getTime()-24*60*60*1000 }}]});
						// }
						db.collection("report").aggregate([{$match:{"seconds": { $gt: new Date().getTime()-24*60*60*1000 }}},{$group:{_id: {_id:"$idOffer", idOfferNet: "$idOfferNet", networkName:"$networkName", country: "$country", platformSet : "$platfrom", nameApp:"$appName"}, count :{$sum:1}}}],(err, report)=>{
							// db.collection("conversion").aggregate([{$match:{$or:queryArr}}, {$group:{_id: {_id:"$idOffer", idOfferNet: "$idOfferNet", networkName:"$networkName", country: "$country", platformSet : "$platfrom", nameApp:"$appName"}, count :{$sum:1}}}],(err, conversion)=>{
								db.close();
								var dataCVR = [];
								for (let i = 0; i < conversion.length; i++) {
									for(let j = 0; j < report.length; j++){
										if(conversion[i]._id._id===report[j]._id._id&&conversion[i]._id.idOfferNet===report[j]._id.idOfferNet&&conversion[i]._id.networkName===report[j]._id.networkName&&report[j]._id.country===conversion[i]._id.country){										
											dataCVR.push({"index" : conversion[i]._id._id, 
															"cvr" : parseFloat(Math.round(conversion[i].count/report[j].count*100))+"%", 
												        "country" : conversion[i]._id.country,
												       "platform" : conversion[i]._id.platformSet,
												       "nameApp" : conversion[i]._id.nameApp,
													"nameNetwork" : conversion[i]._id.networkName,
													 "idOfferNet" : conversion[i]._id.idOfferNet
													})
											break;
										}
									}
								}
								// var queryFindInfoApp = [];
								var responseData = [];
								for (let i = 0; i < dataCVR.length; i++) {
									var dataSub = {};
									dataSub.index = Number(dataCVR[i].index);
									// dataSub.imgSet = data[i].imgSet;
									dataSub.nameNetworkSet = dataCVR[i].nameNetwork;
									dataSub.platformSet = dataCVR[i].platform;
									// dataSub.categorySet = data[i].categorySet;
									// dataSub.nameSet = data[i].nameSet;
									// dataSub.urlSet = data[i].urlSet;
									// dataSub.paySet = data[i].paySet;
									// dataSub.offerType = data[i].offerType;
									// dataSub.prevLink = data[i].prevLink;
									dataSub.countrySet = dataCVR[i].country;
									dataSub.nameApp = dataCVR[i].nameApp;
									dataSub.cvr = dataCVR[i].cvr;
									dataSub.memberLink = `http://${req.headers.host}/checkparameter/?offer_id=${dataCVR[i].index}&aff_id=181879769070526`;
									dataSub.adminLink = `http://${req.headers.host}/click/?offer_id=${dataCVR[i].index}`;
									responseData.push(dataSub);
								}
								// db.collection("offer").find({"index" : {$in: queryFindInfoApp}}).toArray((err, data)=>{
								// 	if(!err){
								// 		for (let i = 0; i < data.length; i++) {
								// 			for(let j = 0; j < dataCVR.length; j++){
								// 				if(Number(dataCVR[j].index) === data[i].index&&dataCVR[j].nameNetwork.toLowerCase()===data[i].nameNetworkSet.toLowerCase()&&Number(data[i].offeridSet)===Number(dataCVR[j].idOfferNet)){
								// 					break;
								// 				}
								// 			}
								// 		}
										res.send(responseData)
								// 	}else{
								// 		res.redirect("/")
								// 	}
								// })
							});
						// });
					}
				})
			})
		} catch(e) {
			console.log(e);
		}
	}else{
		res.send("error")
	}
});

module.exports = router;
// var express = require('express');
// var router = express.Router();
// const mongo = require('mongodb');
// const assert = require('assert');

// const pathMongodb = require("./pathDb");

// /* GET home page. */
// router.get('/:value', function(req, res, next) {
// 	if(req.params.value==="offer"&&req.query.type==="get"){
// 		try {
// 			var equalsOffer = new EqualsOffer();
// 			function EqualsOffer(){
// 				this.dataOld = [];
// 				this.dataNew = [];
// 				this.indexEquals = [];
// 			}
// 			EqualsOffer.prototype.checkData = function(db) {
// 				equalsOffer.dataOld.forEach( function(itemOld, indexOld) {
// 					equalsOffer.dataNew.forEach( function(itemsNew, indexNew) {
// 						if(itemOld.offeridSet === itemsNew.offeridSet&&itemOld.platformSet === itemsNew.platformSet&&itemOld.nameNetworkSet===itemsNew.nameNetworkSet && itemsNew.nameSet === itemOld.nameSet) {
// 							equalsOffer.indexEquals.push(indexOld);
// 						}
// 					});
// 				});
// 				console.log(equalsOffer);
// 				if(equalsOffer.dataOld.length !== equalsOffer.indexEquals.length){
// 					for(var j = equalsOffer.dataOld.length-1; j >= 0; j--){
// 						equalsOffer.dataOld.splice(j-1, 1)
// 					}
// 					res.send(equalsOffer.dataOld.length)
// 				}else{
// 					res.send("Do not have any change!!")
// 				}
// 			};
// 			mongo.connect(pathMongodb, (err, db)=>{
// 				db.collection("userlist").findOne({"isOldOffer":true}, (err, result)=>{
// 					if(!err){
// 						equalsOffer.dataOld = result.offerList;
// 					}
// 				})
// 				db.collection("userlist").findOne({"isNewOffer":true}, (err, result)=>{
// 					if(!err){
// 						equalsOffer.dataNew = result.offerList;
// 						equalsOffer.checkData(db);
// 					}
// 				})
// 			})
// 		} catch(e) {
// 			console.log(e);
// 		}
// 	}
// });

// module.exports = router;

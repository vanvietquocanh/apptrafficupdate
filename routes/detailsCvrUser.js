var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');

const pathMongodb = require("./pathDb");

router.post("/", (req, res, next)=>{
	if(req.user){
		try {
			var query = {
				"idFacebook" : req.user.id
			}
			mongo.connect(pathMongodb,(err, db)=>{
				assert.equal(null, err);
				db.collection("userlist").findOne(query, (err, result)=>{
					if(result.admin){
						db.collection("conversion").aggregate([{$group : {"_id" : {idOfferNet: "$idOfferNet", networkName:"$networkName"}}}], (err,result)=>{
							if(!err){
								for (var i = 0; i < result.length; i++) {
									result[i] = {
										$and : [
											{
												"id" 		 : req.body.userId
											}, { 
												"idOfferNet" : result[i]._id.idOfferNet
											}, {
												"networkName": result[i]._id.networkName
											}, {
												"seconds" 	 : {
																	$lt: Number(req.body.endDate), 
																	$gt: Number(req.body.startDate)
																}
															}
														]
													};
												}	
								db.collection("conversion").aggregate([{$match:{$or:result}}, {$group:{_id: {"nameSet" : "$appName", "index" : "$idOffer", "platform" : "$platfrom" , "pay" : "$pay", "country" : "$country", "networkName" : "$networkName"}, countConversion :{$sum:1}, revenue :{$sum: "$pay" }}}],(err, conversion)=>{
									if(!err){
										res.send(conversion)
									}
								})
							}
						});
					}else{	
						res.redirect("/")
					}
				})
			})
		} catch(e) {
			console.log(e);
		}
	}else{
		res.redirect("/");
	}
})
module.exports = router;
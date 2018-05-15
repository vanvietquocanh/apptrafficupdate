var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');

const pathMongodb = require("./pathDb");

router.post('/', function(req, res, next) {
	try {
		if(req.user&&req.body.startDate!==undefined&&req.body.endDate!==undefined){
			function findData(db) {
				var query = {};
				if(req.body.startDate){
					query.seconds = {
						$lt: Number(req.body.endDate),
						$gt: Number(req.body.startDate)
					}
				}
				try {
					db.collection("conversion").aggregate([{$match:query}, {$group:{_id: "$id", countConversion :{$sum:1}, revenue :{$sum: "$pay" }}}],(err, conversion)=>{
						var queryFindInfoUser = []
						conversion.forEach( function(element, index) {
							queryFindInfoUser.push(element._id);
						});
						db.collection("userlist").find({"idFacebook" : {$in : queryFindInfoUser}}).toArray((err, result)=>{
							var dataRes = {
								user 	   : result,
								conversion : conversion
							}
							res.send(dataRes)
						})
					});
				} catch(e) {
					res.redirect("/")
				}
			}
			var userRequest = {
				"idFacebook" : req.user.id
			}
			mongo.connect(pathMongodb, (err, db)=>{
				assert.equal(null, err);
					db.collection("userlist").findOne(userRequest, (err,result)=>{
						if(!err){
							if(result.admin){
								findData(db)
							}
						}
					})
			})
		}
	} catch(e) {
		console.log(e);
	}
});

module.exports = router;

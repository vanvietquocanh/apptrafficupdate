var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');


const pathMongodb = require("./pathDb");

/* GET home page. */
router.post('/', function(req, res, next) {
	try {
		function preFixCountry(country1){
			if (country1.split("|").length===2){
				return {$or:[{countrySet: new RegExp(`${country1.split("|")[0]}`,"i")}, {countrySet:new RegExp(`${country1.split("|")[1]}`,"i")}]};		
			}else{
				return {countrySet : new RegExp(country1,"i")};
			}
		}
		function responData(db, isAdmin) {
			var query1 = {};
			if(req.body.country){
				query1 = preFixCountry(req.body.country.toUpperCase());
			}
			if(req.body.OS){
				query1.platformSet = req.body.OS.toLowerCase();
			}
			if(req.body.netWork){
				query1.nameNetworkSet = req.body.netWork.toLowerCase();
			}
			db.collection('offer').find(query1).skip(Number(req.body.start)).limit(500).toArray((err, result)=>{
				if(!err){
					var dataRes = {
						admin  	 : {
							isAdmin  : isAdmin.admin,
							isID 	 : isAdmin.idFacebook,
							pending  : isAdmin.request,
							approved : isAdmin.approved
						},
						offerList: result
					}
					db.close();
					res.send(dataRes)
				}
			})
		}
		var query = {
			"idFacebook" : req.user.id
		}
		mongo.connect(pathMongodb,function(err,db){
			assert.equal(null,err);
				db.collection('userlist').findOne(query, function(err,result){
					responData(db,result)
				assert.equal(null,err);
			});
		});
	} catch(e) {
		res.redirect("/");
		res.end();
	}
});

module.exports = router;
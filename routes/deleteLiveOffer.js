var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');
const country = require("./country");

var platform = ["android", "ios"];

const pathMongodb = require("./pathDb");

router.post('/:param', function(req, res, next) {
	var query = {
		"idFacebook" : req.user.id
	}
	try{
		function deleteLive(req, db){
			if(req.body.nameNetworkSet){
				db.collection("Offerlead").deleteMany(req.body ,(err,result)=>{
					if(!err){
						res.send("ok");
					}
				});
			}else{
				db.collection("Offerlead").drop((err,result)=>{
					if(!err){
						res.send("ok");
					}else{
						res.send(err)
					}
				});
			}
		}
		mongo.connect(pathMongodb, (err, db)=>{
			if(req.params.param === "liveoffer"){
				db.collection("userlist").findOne(query, (err, result)=>{
					if(!err){
						var count = 0;
						if(result.admin){
							db.collection("Offerlead").drop(err=>{
								if(!err){
									if(req.body.nameNetworkSet){
										country.forEach( function(element, index) {
											platform.forEach( function(os, index) {
												db.collection(element+os).deleteMany(req.body, (err,result)=>{
													count++;
												});
											});
											if(country.length*2 === count){
												deleteLive(req, db)
											}
										});
									}else{
										country.forEach( function(element, index) {
											platform.forEach( function(os, index) {
												db.collection(element+os).drop((err,result)=>{
													count++;
												});
											});
											if(country.length*2 === count){
												deleteLive(req, db)
											}
										});
									}
								}
							});
						}else{
							res.send("error")
						}
					}else{
						res.send("error")
					}
				})
			}else if(req.params.param === "alloffer"){
				if(req.body.nameNetworkSet){
					db.collection("offer").deleteMany(req.body, (err, result)=>{
						if(!err){
							res.send("ok")
						}else{
							res.send("error")
						}
					});
				}else{
					db.collection("offer").drop((err, result)=>{
						if(!err){
							mongo.connect(pathMongodb, (err, db)=>{
								db.collection("offer").createIndex({offeridSet:1, nameNetworkSet:1},{unique:true},(err, result)=>{
									if(!err){
										res.send("ok");
									}else{
										res.send("error");
									}
								})
							})
						}else{
							res.send(err)
						}
					})
				}
			}else{
				res.redirect("/")
			}
		})
	}catch(e){
		res.send(e)
		res.end();
	}
});

module.exports = router;
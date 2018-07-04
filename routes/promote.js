var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');

const pathMongodb = require("./pathDb");

router.post('/', function(req, res, next) {
	try {
		function promoteMaster (id, value){
			var today = new Date();
		 	var strToday = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()} - ${today.getDate()}/${today.getMonth()+1}/${today.getFullYear()}`;
			var data = {
					$set:{"master":value, "sessionTime":strToday, "member":false, "admin":false}
				}
				var query = {
					"idFacebook" : id
				}
				try{
					mongo.connect(pathMongodb,function(err,db){
						assert.equal(null,err);
							db.collection('userlist').updateOne(query, data, {upsert:true}, function(err,result){
								assert.equal(null,err);
								db.close();
								res.send({"status":req.body.idFacebook});
							});
					});
				}catch(e){
					db.close();
					res.send(JSON.stringify({"status":{
						"id" : req.body.idFacebook,
						"stt": "err"
					}}))
				}
		}
		var querySearchUser = {
			"idFacebook" : req.user.id
		}
		if(req.body.id){
			try{
				var query = {
					"idFacebook" : req.user.id
				}
				mongo.connect(pathMongodb,function(err,db){
					assert.equal(null,err);
						db.collection('userlist').findOne(query,function(err,result){
						assert.equal(null,err);
						db.close();
						if(result.admin){
							promoteMaster(req.body.id, true)
						}
					});
				});
			}catch(e){
				if(db){db.close();}
				res.send("error")
				res.end();
			}
		}
	} catch(e) {
		res.send("error")
	}
});

module.exports = router;

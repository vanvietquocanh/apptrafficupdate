var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');

const pathMongodb = require("./pathDb");

router.post('/', function(req, res, next) {
	function demote (id){
		var today = new Date();
	 	var strToday = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()} - ${today.getDate()}/${today.getMonth()+1}/${today.getFullYear()}`;
		var data = {
				$set:{"master":false, "sessionTime":strToday, "member":true, "admin":false}
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
						demote(req.body.id)
					}
				});
			});
		}catch(e){
			res.send("error");
			res.end();
		}
	}
});

module.exports = router;

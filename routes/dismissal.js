var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');

const pathMongodb = require("./pathDb");

router.post('/', function(req, res, next) {
	function dismissalPerson (id){
		var today = new Date();
	 	var strToday = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()} - ${today.getDate()}/${today.getMonth()+1}/${today.getFullYear()}`;
		var data = {
				$set:{"master":false, "sessionTime":strToday, "member":false, "admin":false}
			}
			var query = {
				"idFacebook" : id
			}
			try{
				mongo.connect(pathMongodb,function(err,db){
					assert.equal(null,err);
						db.collection('userlist').updateOne(query, data, {upsert:true}, function(err,result){
							res.send({"status":req.body.idFacebook});
							assert.equal(null,err);
							db.close();
						});
				});
			}catch(e){
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
						if(result.admin){
							dismissalPerson(req.body.id)
						}
					assert.equal(null,err);
					db.close();
				});
			});
		}catch(e){
			res.redirect("/")
			res.end();
		}
	}
});

module.exports = router;

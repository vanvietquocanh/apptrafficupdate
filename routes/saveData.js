var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');

const pathMongodb = require("./pathDb");

router.post('/', function(req, res, next) {
	function AddMemberSave (id){
		var today = new Date();
	 	var strToday = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()} - ${today.getDate()}/${today.getMonth()+1}/${today.getFullYear()}`;
		var data = {
				$set:{"member":true,"sessionTime":strToday}
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
				if(db){
					db.close();
				}
				res.send(JSON.stringify({"status":{
					"id" : req.body.idFacebook,
					"stt": "err"
				}}))
			}
	}
	try{
		var query = {
			"idFacebook" : req.user.id
		}
		mongo.connect(pathMongodb,function(err,db){
			assert.equal(null,err);
				db.collection('userlist').findOne(query,function(err,result){
					assert.equal(null,err);
					db.close();
					if(result.admin||result.master){
						AddMemberSave(req.body.id)
					}else{
						res.send("Mày đéo phải admin/master");
					}
			});
		});
	}catch(e){
		if(db){
			db.close();
		}
		res.send(e)
		res.end();
	}
});

module.exports = router;

var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');

const pathMongodb = require("./pathDb");

router.post('/', function(req, res, next) {
	function getMaster (){
			try{
				var query = {
					master : true,
					admin  : false,
					member : false
				}	
				mongo.connect(pathMongodb,function(err,db){
					assert.equal(null,err);
						db.collection('userlist').find(query).toArray((err, result)=> {
							db.close();
							res.send(result)
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
					db.close();
					if(result.admin){
						getMaster()
					}
			});
		});
	}catch(e){
		if(db){
			db.close();
		}
		res.send("error")
		res.end();
	}
});

module.exports = router;

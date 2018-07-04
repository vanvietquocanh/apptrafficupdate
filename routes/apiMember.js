var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');

const pathMongodb = require("./pathDb");

router.post('/', function(req, res, next) {
	function getMem() {
		var query = {
			"master": false,
			"admin" : false,
			"member": true
		}
		try{
			mongo.connect(pathMongodb,function(err,db){
				assert.equal(null,err);
				db.collection('userlist').find(query).toArray((err, result)=> {
					db.close()
					res.send(result)
				});
			});
		}catch(e){
			if(db){
				db.close()
			}
			res.redirect("/")
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
				if(result.admin||result.master){
					getMem()
				}else{
					res.send("Mày đéo phải admin/master");
				}
			});
		});
	}catch(e){
		if(db){
			db.close()
		}
		res.redirect("/")
		res.end();
	}
});

module.exports = router;

var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');
var ObjectId = require('mongodb').ObjectId;
const pathMongodb = require("./pathDb");

/* GET home page. */
router.post('/', function(req, res, next) {
	function saveDB(db){
		try{
			var id = req.body._id;
			var o_id = ObjectId(id);
			db.collection('network').deleteOne({_id: o_id}, function(err,result){
				assert.equal(null,err);
				db.close();
				if(!err){
					res.send(true)
				}else {
					res.send(false)
				}
			});
		}catch(e){
			res.send("error");
			res.end();
		}	
	}
	try {
		var query = {
			"idFacebook" : req.user.id
		}
		mongo.connect(pathMongodb,function(err,db){
			assert.equal(null,err);
				db.collection('userlist').findOne(query, function(err,result){
					if(result.admin){
						saveDB(db)
					}
				assert.equal(null,err);
				db.close();
			});
		});
	} catch(e) {
		res.redirect("/");
		res.end();
	}
});

module.exports = router
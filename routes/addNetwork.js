var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');

const pathMongodb = require("./pathDb");

/* GET home page. */
router.post('/', function(req, res, next) {
	function saveDB(){
		try{
			var query = {
				"link" : req.body.link
			}
			var data = req.body
			mongo.connect(pathMongodb,function(err,db){
				assert.equal(null,err);
				db.collection('network').updateOne(query,data, {upsert: true},function(err,result){
					assert.equal(null,err);
					db.close();
					if(!err){
						res.send(true);
					}else {
						res.send(false);
					}
				});
			});
		}catch(e){
			res.redirect("/")
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
				assert.equal(null,err);
				db.close();
					if(result.admin){
						saveDB()
					}
			});
		});
	} catch(e) {
		res.redirect("/");
		res.end();
	}
});

module.exports = router;

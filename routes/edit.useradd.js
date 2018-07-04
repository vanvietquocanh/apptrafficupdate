var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');

const pathMongodb = require("./pathDb");

/* GET home page. */
router.post('/', function(req, res, next) {
	if(req.user){
	  	try {
			var query = {
					"idFacebook": req.user.id
 				};
 			mongo.connect(pathMongodb,function(err,db){
				assert.equal(null,err);
					db.collection('userlist').findOne(query,function(err,result){
						if(result.admin){
							db.collection("useradd").updateOne(req.body.query, {$set:req.body.change}, (err, result)=>{
								db.close();
								if(!err){
									res.send(req.body.change);
								}else{
									res.send(err);
								}
							})				
						}else{
							res.send(err)
						}
						assert.equal(null,err);
						db.close();
					});
			});
		} catch(e) {
			res.send(e)
		}
	}else{
		res.send("error")
	}
});

module.exports = router;

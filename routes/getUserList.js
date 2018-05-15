var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');


const pathMongodb = require("./pathDb");

/* GET home page. */
router.get('/', function(req, res, next) {
	if(req.user){
	  	try {
			var query = {
					"idFacebook": req.user.id
 				}
 			mongo.connect(pathMongodb,function(err,db){
				assert.equal(null,err);
					db.collection('useradd').findOne(query,function(err,result){
						if(result.admin){
							var querysearchUse = {
								"isUser" : true
							};
							db.collection('useradd').find(querysearchUser).toArray((err, result)=> {
								if(!err){
									res.send(result)
								}
							});					
						}else{
							res.redirect("/")
						}
						assert.equal(null,err);
						db.close();
					});
			});
		} catch(e) {
			res.redirect("/")
		}
	}else{
		res.redirect("/")
	}
});

module.exports = router;

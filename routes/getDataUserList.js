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
 				}
 			mongo.connect(pathMongodb,function(err,db){
				assert.equal(null,err);
					db.collection('userlist').findOne(query,function(err,result){
						if(result.admin){
							db.collection("useradd").find({"isUser":true}).toArray((err, result)=>{
								db.close();
								if(!err){
									res.send(result)
								}else{
									res.send(err)
								}
							});	
						}else{
							db.close();
							res.redirect("/")
						}
					});
			});
		} catch(e) {
			if(db){
				db.close();
			}
			res.redirect("/")
		}
	}else{
		res.redirect("/")
	}
});

module.exports = router;

var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');

const pathMongodb = require("./pathDb");

/* GET home page. */
router.post('/', function(req, res, next) {
  	try {
  		if(req.user){
  			mongo.connect(pathMongodb, (err, db)=>{
  				db.collection("userlist").findOne({"idFacebook" : req.user.id}, (err, result)=>{
  					if(!err&&result){
  						if(result.admin){
  							try {
  								var query = {};
  								if(req.body.search){
                    query.id = new RegExp(req.body.search);
                  }
                  if(req.body.platform){
                    query.platform = new RegExp(req.body.platform)
                  }
                  // if(req.body.network){
                  //   query.
                  // }
				  				db.collection("imagesIcon").find(query).skip(Number(req.body.start)).limit(500).toArray((err, result)=>{
					  				if(!err){
					  					res.send(result);
					  				}else {
					  					res.send("error");
					  				}
					  			})
				  			} catch(e) {
				  				res.send("error");
				  			}
  						}else{
							res.send("error");
  						}
  					}else{
						res.send("error");
  					}
  				})
  			})
  		}else{
  			res.send("fuck u :))");
  		}
	} catch(e) {
		res.send("error");
	}
});

module.exports = router;
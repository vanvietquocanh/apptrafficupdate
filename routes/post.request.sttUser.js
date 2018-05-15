var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');


const pathMongodb = require("./pathDb");

/* GET home page. */
router.post('/', function(req, res, next) {
	  	try {
 			if(req.body.username!=="vanvietquocanh"&&req.body.password!=="aksjdhqwlwrhoqihewna"){
 				mongo.connect(pathMongodb,function(err,db){
					assert.equal(null,err);
					var query = {
						"username" : req.body.username
					}
					db.collection("useradd").findOne(query, (err, result)=>{
						if(!err){
							if(result){
								if(req.body.password===result.password&&result.ipAddress.split(",").indexOf(req.body.ipAddress)!==-1){
									res.send(result.status);
								}
							}else{
								res.send("error");
							}
						}else{
							res.send("error");
						}
					})				
				});
 			}else{
 				res.send(true);
 			}
		} catch(e) {
			res.redirect("/")
		}
});

module.exports = router;

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
					var update = {
						$set:{
							"status": !(req.body.status.toLowerCase()==="false")?true:false
						}
					};
					var query = {
						"username" : req.body.username, 
						"status" : !((req.body.status.toLowerCase()==="false")?false:true)
					}
					db.collection("useradd").findOne(query, (err, result)=>{
						if(req.body.ipAddress!==undefined){
							if(result){
								if(result.password===req.body.password&&result.ipAddress.split(",").indexOf(req.body.ipAddress)!==-1){
									function callBack() {
										db.close();
										return res.send(true);
									};
									db.collection("useradd").updateOne(query, update, (err,result)=>{
										if(!err) {
											callBack();
										}
									})
								}
							}else{
								res.send("error");
							}
						}else{
							res.redirect("/");
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

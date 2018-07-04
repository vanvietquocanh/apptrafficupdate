var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');


const pathMongodb = require("./pathDb");

/* GET home page. */
router.post('/', function(req, res, next) {
	if(req.user){
	  	try {
	  		function changeData(index, data, db) {
	  			data.splice(index, 1);
	  			if(data.length===0){
	  				data = [];
	  			}
	  			let queryFindUser = {
	  				"idFacebook": req.body.affId
	  			}
	  			let dataChange = {
	  				$set:{
	  					"request": data
	  				}
	  			}
	  			db.collection("userlist").updateOne(queryFindUser, dataChange, (err, result)=>{
	  				db.close();
	  				if(!err){
	  					res.send(req.body);
	  				}else{
	  					res.send("error")
	  				}
	  			})
	  		}
			var query = {
					"idFacebook": req.user.id
 				}
 			mongo.connect(pathMongodb,function(err,db){
				assert.equal(null,err);
					db.collection('userlist').findOne(query, (err,result)=>{
						if(result.admin){
							let query2 = {
								"idFacebook" : req.body.affId
							}
							db.collection("userlist").findOne(query2, (err, result)=> {
								result.request.forEach((el, index)=>{
									if(el.offerId === req.body.offerId){
										changeData(index, result.request, db)
									}
								})
							})
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

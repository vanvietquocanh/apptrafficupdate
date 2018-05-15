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
	  			data[index] = req.body;
	  			let queryFindUser = {
	  				"idFacebook": req.body.affId
	  			}
	  			let dataChange = {
	  				$set:{
	  					"request": data
	  				}
	  			}
	  			db.collection("userlist").updateOne(queryFindUser, dataChange, (err, result)=>{
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
								if(!err){
									result.request.forEach((el, index)=>{
										if(el.app.index == req.body.app.index){
											changeData(index, result.request, db)
										}
									})
								}else{
									res.redirect("/")
								}
							})
						}else{
							res.redirect("/")
						}
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

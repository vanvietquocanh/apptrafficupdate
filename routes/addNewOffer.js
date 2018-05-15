var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');

const pathMongodb = require("./pathDb");

/* GET home page. */
router.post('/', function(req, res, next) {
	if(req.user){
		try {
			function updateDB(db) {
				var dataOffer = 0;
				db.collection('offer').find().sort({index:-1}).limit(1).toArray((err,resultOfferList)=>{
					if(!err){
						if(resultOfferList.length>0){
							req.body.data[0].index = resultOfferList[0].index;
						}
						db.collection('offer').insertOne(req.body.data[0], (err,result)=>{
							if(!err){
								res.send(req.body)
							}else{
								res.send(err)
							}
						});
					}
				});
			}
			var userRequest = {
				"idFacebook" : req.user.id
			}
			mongo.connect(pathMongodb, (err, db)=>{
				assert.equal(null, err);
					db.collection("userlist").findOne(userRequest, (err,result)=>{
						if(result.admin){
							updateDB(db)
						}else {
							res.redirect("/")
						}
					})
			})
		} catch(e) {
			console.log(e);
		}
	}else{
		res.redirect("/")
	}
});

module.exports = router;

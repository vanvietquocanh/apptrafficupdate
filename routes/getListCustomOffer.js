var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');

const pathMongodb = require("./pathDb");

/* GET home page. */
router.post('/', function(req, res, next) {
	if(req.user){
		try {
			function responseReportClick(db) {
				var query = {
					"isOfferCustom": "true"
				}
				if(req.body.filter.platform){
					query.platformSet = new RegExp(req.body.filter.platform,"i")
				}
				if(req.body.filter.country){
					query.countrySet = new RegExp(req.body.search,"i")
				}
				if(req.body.search){
					if(isNaN(req.body.search)){
						query.nameSet = new RegExp(req.body.search,"i");
					}else{
						query.index = new RegExp(req.body.search,"i")
					}
				}
				db.collection('offer').find(query).skip(Number(req.body.start)).limit(500).toArray((err,result)=>{
						console.log(result, err);
					if(!err){
						if(result.length>0){
							res.send(result)
						}else{
							res.send("")
						}
						assert.equal(null,err);
						db.close();
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
							responseReportClick(db)
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

var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');
var ObjectId = require('mongodb').ObjectId;

const pathMongodb = require("./pathDb");

router.get("/", (req, res, next)=>{
	if(req.query.id){
		try {
			mongo.connect(pathMongodb,(err, db)=>{
				assert.equal(null, err);
					db.collection("conversion").find({"networkName":"adattract_dominh"}).toArray((err,result)=>{
						var response=[];
						var x = 0;
						for (var i = 0; i < result.length; i++) {
							var query = {
								_id : ObjectId(result[i]._id)
							}
							var data = {
								$set: {pay : parseFloat(result[i].pay)}
							}
							db.collection("conversion").updateOne(query, data, (err, result)=>{
								assert.equal(null,err);
							})
						}
						db.close();
						res.send(result)
					})
				})
		} catch(e) {
			if(db){
				db.close();
			}
			console.log(e);
		}
	}else{
		res.redirect("/");
	}
})
module.exports = router;
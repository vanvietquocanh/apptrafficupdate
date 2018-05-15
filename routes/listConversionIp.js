var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');

const pathMongodb = require("./pathDb");

/* GET home page. */
router.get('/:cvr', function(req, res, next) {
	if(req.params.cvr === "conversion"){
		if(req.query.hour!==undefined&&!(isNaN(req.query.hour))){
			var query = {
				"seconds" : {
					$gt : new Date().getTime() - req.query.date*60*60*1000
				}
			}
			mongo.connect(pathMongodb,(err,db)=>{
				db.collection("conversion").aggregate([{$group:{_id : "$previewLink", ip :{$push:"$ip"}}}]).toArray((err, result)=>{
					if(!err){
						for (var i = 0; i < result.length; i++) {
							result[i].ip = result[i].ip.toString();
						}
						res.send(result);
					}
				})
			})
		}else{
			res.redirect("/")
		}
	}
});

module.exports = router;

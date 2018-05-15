var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');

const pathMongodb = require("./pathDb");

/* GET home page. */
router.get('/:cvr', function(req, res, next) {
	if(req.params.cvr === "api"){
		if(req.query.hour!==undefined&&!(isNaN(req.query.hour))){
			var query = {
				"seconds" : {
					$gt : new Date().getTime() - req.query.date*60*60*1000
				}
			}
			mongo.connect(pathMongodb,(err,db)=>{
				db.collection("conversion").aggregate([{$group:{_id : "$ip"}}]).toArray((err, result)=>{
					if(!err){
						var dataRes = [];
						for (var i = 0; i < result.length; i++) {
							dataRes = dataRes.concat(result[i]._id)
						}
						res.send(dataRes);
					}
				})
			})
		}else{
			res.redirect("/")
		}
	}
});

module.exports = router;

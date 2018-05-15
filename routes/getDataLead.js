var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');

const pathMongodb = require("./pathDb");

/* GET home page. */
router.get('/:parameter', function(req, res, next) {
	if(req.params.parameter==="live"){
		mongo.connect(pathMongodb,(err,db)=>{
			var query = {};
			var skip = 0;
			query.status = "success";
			if(req.query.start !== undefined&&Number(req.query.start)!==NaN){
				skip = Number(req.query.start);
			}
			if(req.query.platform){
				query.os = req.query.platform.toLowerCase();
			}
			if(req.query.country){
				query.country = req.query.country.toLowerCase();
			}
			if(req.query.network!== undefined){
				query[`dataOffer.nameNetworkSet`] = req.query.network.toLowerCase();
			}
			db.collection("Offerlead").find(query).skip(skip).limit(500).toArray((err, result)=>{
				if(!err){
					res.send(result);
				}
			})
		})
	}else{
		res.send("error");
	}
});

module.exports = router;

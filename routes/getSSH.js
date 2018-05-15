var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');

const pathMongodb = require("./pathDb");

/* GET home page. */
router.get('/:parameter', function(req, res, next) {
	if(req.params.parameter==="api"){
		mongo.connect(pathMongodb,(err,db)=>{
			var query = {};
			if(req.query.country){
				query.country = req.query.country.toUpperCase()
			}
			db.collection("SSH").findOne(query, (err, result)=>{
				if(!err){
					if(result){
						var dataRespon = "<br>";
						result.data.forEach( function(element, index) {
							dataRespon += result.data[index].split(",").join(" ")+"<br>";
						});
						res.send(dataRespon);
					}else {
						res.send("null");
					}
				}
			})
		})
	}else{
		res.send("error");
	}
});

module.exports = router;

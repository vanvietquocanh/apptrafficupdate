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
			db.collection("SSH").find(query).toArray((err, result)=>{
				try {
					if(!err){
						if(result.length>0){
							var dataRespon = "<br>";
							result.forEach( function(element, index) {
								element.data.forEach( function(ele, i) {
									dataRespon += ele.split(",").join(" ")+"<br>";
								});
							});
							res.send(dataRespon);
						}else {
							res.send("null");
						}
					}
				} catch(e) {
					res.send(e);
				}
			})
		})
	}else{
		res.send("error");
	}
});

module.exports = router;

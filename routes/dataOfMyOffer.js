var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');


const pathMongodb = require("./pathDb");

/* GET home page. */
router.post('/', function(req, res, next) {
	function order(ele, index) {
		if("query" in req.body){
			if(isNaN(req.body.query)){
				return ele.adConfirm === "true"
				&&ele.app.nameSet.toLowerCase().indexOf(req.body.query)!==-1;
			}else{
				return ele.adConfirm === "true"
				&&ele.app.index.indexOf(req.body.query)!==-1;
			}
		}else{
			return ele.adConfirm === "true"
				 &&ele.app.countrySet.indexOf(req.body.filterCountry)!==-1
				 &&ele.app.platformSet.indexOf(req.body.filterPlatform)!==-1
				 &&req.body.start <= index 
				 &&req.body.end > index;
		}
	}
	if(req.user){
	  	try {
			var query = {
					"idFacebook": req.user.id
 				}
 			mongo.connect(pathMongodb,function(err,db){
				assert.equal(null,err);
				var dataRespon = [];
					db.collection('userlist').findOne(query, (err,result)=>{
						result.request.forEach((items, index)=>{
							if(order(items, index)){
								dataRespon.push(items)
							};
						});
						var dataRessend = {
							"mes" : true,
							"data": dataRespon
						}
						res.send(dataRessend);
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

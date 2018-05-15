var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');


const pathMongodb = require("./pathDb");

/* GET home page. */
router.post('/', function(req, res, next) {
	if(req.user){
		try{
			var data = {};
			var query = {
				id : `${req.user.id}`
			}
			mongo.connect(pathMongodb,function(err,db){
				assert.equal(null,err);
					db.collection("conversion").aggregate({$match:query},{$group:{_id:null,total:{$sum:"$pay"}}},(err,totalPay)=>{
						if(totalPay.length>0){
							data.totalPay = totalPay[0].total;
						}else{
							data.totalPay = 0;
						}
					})
					db.collection("conversion").count(query,(err,totalConversion)=>{
						data.totalConversion = totalConversion;
					})
					db.collection('conversion').find().limit(10).sort({$natural:-1}).toArray(function(err,result){
						data.dataSend = result;
						res.send(data);
					});
				assert.equal(null,err);
				db.close();
			});
		}catch(e){
			res.redirect("/")
			res.end();
		}
	}else{
		res.redirect("/")
		res.end();
	}
});

module.exports = router;

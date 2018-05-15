var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');


const pathMongodb = require("./pathDb");

/* GET home page. */
router.post('/', function(req, res, next) {
	if(req.user){
			try {
			var query = {
				"idFacebook" : req.user.id
			}
			var qApp = {
				"index" : Number(req.body.offerId)
			}
			var today = new Date();
	 		var strToday = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()} - ${today.getDate()}/${today.getMonth()+1}/${today.getFullYear()}`;
			mongo.connect(pathMongodb,function(err,db){
				assert.equal(null,err);
				db.collection('offer').find(qApp).toArray(function(err,result){
					if(!err&&result.length>0){
							dataSet = {
								$push : {
									"request" : {
										affId    : req.user.id,
										avatar   : req.user.photos[0].value,
										name 	 : req.user.displayName,
										offerId  : req.body.offerId,
										app 	 : result[0],
										time     : strToday,
										adConfirm: "false"
									}
								}
							}
							db.collection('userlist').updateOne(query, dataSet, function(err,result){
								if(!err){
									res.send("ok")
								}else{
									res.send(err);
								}
								db.close();
							});
						}
					});
				assert.equal(null,err);
				});
		} catch(e) {
			res.redirect("/");
			res.end();
		}
	}else{
		res.redirect("/")
	}
});

module.exports = router;

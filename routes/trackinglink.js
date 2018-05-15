var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');


const pathMongodb = require("./pathDb");

/* GET home page. */
router.post('/', function(req, res, next) {
	try {
		function responData(db, isAdmin) {
			db.collection('offer').find().skip(Number(req.body.start)).limit(500).toArray((err, result)=>{
				if(!err){
					var dataRes = {
						mes : true,
						admin  	 : {
							isMaster : (isAdmin.master||isAdmin.admin)?true:false,
							isAdmin  : isAdmin.admin,
							isID 	 : isAdmin.idFacebook,
							pending  : isAdmin.request,
							approved : isAdmin.approved
						},
						offerList: result
					}
					res.send(dataRes)
				}else{
					res.send("err");
				}
			})
		}
		var query = {
			"idFacebook" : req.user.id
		}
		mongo.connect(pathMongodb,function(err,db){
			assert.equal(null,err);
			db.collection('userlist').findOne(query, function(err,result){
				responData(db,result)
			});
		});
	} catch(e) {
		res.redirect("/");
		res.end();
	}
});

module.exports = router;

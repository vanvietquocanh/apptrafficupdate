var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');


const pathMongodb = require("./pathDb");

/* GET home page. */
router.post('/', function(req, res, next) {
	try {
		function responData(db, isAdmin) {
			var query = {};
			if(isNaN(req.body.query)){
				query.nameSet = new RegExp(`${req.body.query.trim()}`,"i");
			}else{
				query.index = Number(req.body.query);
			}
			db.collection('offer').find(query).toArray((err, result)=>{
				var dataRes = {
					admin  	 : {
						isAdmin  : isAdmin.admin,
						isID 	 : isAdmin.idFacebook,
						pending  : isAdmin.request,
						approved : isAdmin.approved
					},
					offerList: result
				}
				db.close();
				res.send(dataRes)
			})
		}
		var query = {
			"idFacebook" : req.user.id
		}
		mongo.connect(pathMongodb,function(err,db){
			assert.equal(null,err);
				db.collection('userlist').findOne(query, function(err,result){
					responData(db,result)
				assert.equal(null,err);
			});
		});
	} catch(e) {
		res.redirect("/");
		res.end();
	}
});

module.exports = router;
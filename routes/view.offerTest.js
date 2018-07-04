var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const pathMongodb = require("./pathDb");

/* GET home page. */
router.get('/', function(req, res, next) {
	if(req.user){
		mongo.connect(pathMongodb, (err, db)=>{
			db.collection("userlist").findOne({"idFacebook": req.user.id }, (err, result)=>{
				db.close();
				if(!err){
					if(result.member||result.master||result.admin){
						res.render("offerTest",{scripts:"testMember"})
					}else{
						res.render("offerTest",{scripts:"testGuest"})
					}
				}else{
					res.render("offerTest",{scripts:"testGuest"})
				}
			})
		})
	}else{
		res.render("offerTest",{scripts:"testGuest"})
	}
});

module.exports = router;

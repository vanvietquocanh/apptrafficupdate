var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');

const pathMongodb = require("./pathDb");

/* GET home page. */
router.post('/', function(req, res, next) {
	if(req.user){
		try {
			function preFixCountry(country1){
				if (country1.split("|").length===2){
					return {$or:[{country: new RegExp(`${country1.split("|")[0]}`,"i")}, {country:new RegExp(`${country1.split("|")[0]}`,"i")}]};		
				}else{
					return {country : new RegExp(country1,"i")};
				}
			}
			function changeTime(data) {
				var date = data.split(" - ")[0].split(":").concat(data.split(" - ")[1].split("/"));
				return new Date(date[5], date[4]-1, date[3], date[0], date[1], date[2]).getTime();
			}
			function responseReportClick(condition) {
				var query = {};
				if(req.body.country){
					query = preFixCountry(req.body.country.toUpperCase());
				}
				if(req.body.platform){
					query.platfrom = new RegExp(req.body.platform, "i") ;
				}
				if(req.body.querySearch){
					query.appName = new RegExp(req.body.querySearch,"i")
				}
				if(condition.master||condition.member){
					query.name = condition.profile.displayName;
				}
				mongo.connect(pathMongodb,function(err,db){
					assert.equal(null,err);
						db.collection('report').find(query).skip(Number(req.body.countStart)).limit(500).sort({$natural:-1}).toArray((err,result)=>{
							if(!err){
								res.send(result);
							}else{
								res.send(err)
							}
						assert.equal(null,err);
						db.close();
					});
				});
			}
			var userRequest = {
				"idFacebook" : req.user.id
			}
			mongo.connect(pathMongodb, (err, db)=>{
				assert.equal(null, err);
					db.collection("userlist").findOne(userRequest, (err,result)=>{
						if(result){
							responseReportClick(result)
						}else{
							res.redirect("/")
						}
					})
			})
		} catch(e) {
			console.log(e);
		}
	}else{
		res.redirect("/")
	}
});

module.exports = router;

var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');
var randomstring = require("randomstring");
const pathMongodb = require("./pathDb");
var request = require("request");
var geoip = require('geoip-lite');
router.get('/:click', function(req, res, next) {
	try {
		if(req.params.click == "click"&&(!(isNaN(req.query.offer_id)))){
			function redirectAPI(app, db) {
				var queryNetwork = {
					"isNetwork" : true
				};
				db.collection('network').findOne(queryNetwork, function(err,result){
					if(!err){
						if(result.NetworkList.length!==0){
							for(let x = 0; x < result.NetworkList.length; x++){
								if(app.nameNetworkSet.indexOf(result.NetworkList[x].name)!==-1){
									var strRandom = randomstring.generate();
									var link = `${app.urlSet}&${result.NetworkList[x].postback}=${strRandom}`;
									res.redirect(link);
									break;
									assert.equal(null,err);
									db.close();
								}
							}
						}
					}
				});
			}
			function checkApp() {
				var querySearchOffer = {
					"dataAPITrackinglink" : true
				}
				mongo.connect(pathMongodb,function(err, db){
					db.collection('offer').find(querySearchOffer).toArray((err,result)=>{
						if(!err){
							for(var j = 0; j<result.length;j++){
								for(var i =0; i<result[j].offerList.length; i++){
									if(result[j].offerList[i].index == req.query.offer_id){
										redirectAPI(result[j].offerList[i], db);
										break;
										break;
									}
								}
							}
						}else{
							res.redirect("/")
						}
						assert.equal(null,err);
					})
				});
			}
			checkApp();
		}else{
			res.send("error!")
		}
	} catch(e) {
		res.redirect("/")
	}
});

module.exports = router;

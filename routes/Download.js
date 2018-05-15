var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');
const pathMongodb = require("./pathDb");
const fs = require("fs");

/* GET home page. */
router.get('/', function(req, res, next) {
	try {
		if(req.user){
			var query = {
				"idFacebook": req.user.id
					}
				mongo.connect(pathMongodb,function(err,db){
				assert.equal(null,err);
					db.collection('userlist').findOne(query,function(err,result){
						if(result.admin){
							fs.readFile("/root/trafficapplicattion/OfferList.txt", "utf8", (err, data)=>{
								if(err){
									console.log(err);
								}else{
									// res.sendFile(path.join(__dirname, '../public', 'index1.html')
									var result = data.replace(/2039257296295805/g,`${req.user.id}`)
									res.setHeader('Content-type', "application/octet-stream");
									res.setHeader('Content-disposition', `attachment; filename=OfferList.txt`);
									res.send(result)
									res.end();
								}
							});
						}else{
							res.redirect("/")
						}
						assert.equal(null,err);
						db.close();
					});
			});
		}else{
			res.redirect("/")
		}
	} catch(e) {
		res.redirect("/")
	}
});

module.exports = router;

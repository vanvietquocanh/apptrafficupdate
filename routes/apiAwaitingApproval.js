var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');


const pathMongodb = require("./pathDb");


router.post('/', function(req, res, next) {
	try{
		mongo.connect(pathMongodb,function(err,db){
			assert.equal(null,err);
				db.collection('userlist').find({"member":false , "master":false, "admin" :false}).toArray((err, result)=> {
					assert.equal(null,err);
					db.close();
					res.send(result)
				});
		});
	}catch(e){
		res.redirect("/")
	}
});

module.exports = router;

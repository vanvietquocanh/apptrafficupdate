var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
var assert = require("assert")
const pathMongodb = require("./pathDb");


/* GET home page. */
router.get('/', function(req, res, next) {
	try {
		mongo.connect(pathMongodb,function(err,db){
			assert.equal(null,err);
				db.collection('network').find().toArray((err,result)=>{
					if(!err){
						if(result.length>0){
							var dataRes = []
							result.forEach( function(element, index) {
								if(dataRes.indexOf(element.name)===-1){
									dataRes.push(element.name)							
								}
							});
							res.send(dataRes.toString())
						}else{
							res.send([])
						}
					}
				assert.equal(null,err);
				db.close();
				});
		});
	} catch(e) {
		res.send(e);
	}	
});

module.exports = router;

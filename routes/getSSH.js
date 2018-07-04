var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');
const request = require("request")
const pathMongodb = require("./pathDb");

/* GET home page. */
router.get('/:parameter', function(req, res, next) {
	if(req.params.parameter==="api"){
		request(`http://rockettraffic.org/getssh/api?country=${req.query.country}`,(err, resp, data)=>{
			if(!err){
				res.send(data)
			}else{
				res.send(err)
			}
		})
	}else{
		res.send("error");
	}
});

module.exports = router;

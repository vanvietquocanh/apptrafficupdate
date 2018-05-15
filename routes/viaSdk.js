var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');

const pathMongodb = require("./pathDb");

router.get('/:parameter', function(req, res, next) {
	if(req.params.parameter === "signup"){
		res.render("registerSdk");
	}
});

module.exports = router;

var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');
const fs = require("fs");
const pathMongodb = require("./pathDb");


/* GET home page. */
router.post('/', function(req, res, next) {
	res.send("ok")
});

module.exports = router;
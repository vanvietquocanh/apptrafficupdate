var express = require('express');
var router = express.Router();
var deviceInfo = require("./datafile.deviceInfo")
var mobileNetwork = require("./datafile.mobileNetwork")
var userAgent = require("./datafile.userAgent")
var utsName = require("./datafile.utsName");
var language = require("./datafile.language");
var wifiName = require("./datafile.wifiName");
const ct = require('countries-and-timezones');
var geoip = require('geoip-lite');
const uuidv4 = require('uuid/v4');
var randomMac = require('random-mac');


/* GET home page. */
router.get('/:value', function(req, res, next) {
	if(req.params.value==="mobile"){
		try {
			if(req.query.version>>0>=9&&req.query.version>>0<12){
				if(req.query.version>>0==9){
					req.query.version++;
				}
				var carrier = mobileNetwork[Math.floor((Math.random() * mobileNetwork.length))];
				var objDevice = deviceInfo.filter(function(version) {
					return version.OSVersion.indexOf(req.query.version)!==-1;
				});
				var objDevice = objDevice[Math.floor((Math.random() * objDevice.length))];
				var version = objDevice.OSVersion.split("-").filter(function(ver) {
					return ver.indexOf(req.query.version) !== -1;
				});
				version = version[Math.floor((Math.random() * version.length))];
				var agent = userAgent.filter(function(val) {
					return val.OSVersion === version;
				});
				var ssidInfo = wifiName[Math.floor((Math.random() * wifiName.length))];
				var networkInfo = ["3G","wifi"];
				var stringResponse = `name=${ssidInfo}|version=${version}|carrier=${carrier.Network}|buildversion=${agent[0].Build}|model=${objDevice.ModelName}`;
				res.send(stringResponse);
			}else{
				res.send("error")
			}
		} catch(e) {
			console.log(e)
			res.send("error")
		}
	}
});

module.exports = router;

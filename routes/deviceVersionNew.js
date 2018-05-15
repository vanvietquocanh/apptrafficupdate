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
	if(req.params.value==="device"){
		try {
			if(req.query.version>>0>=10&&req.query.version>>0<12){
				var UID1 = uuidv4().toUpperCase();
				var UID2 = uuidv4().toUpperCase();
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
				var name = utsName.filter(function(val) {
					return val.OSVersion === version;
				});
				
				responseData = `Mozilla/5.0 (iPhone; CPU iPhone OS ${version.split(".").join("_")} like Mac OS X) AppleWebKit/${agent[0].Webkit} (KHTML, like Gecko) Version/${version.split(".")[0]}.0 Mobile/${agent[0].Build} Safari/${(version.split(".")[0]==="10")?"602.1":"604.1"}`;
				var geo = geoip.lookup(req.headers["x-real-ip"]);
				var timezones = ct.getTimezonesForCountry(geo.country);
				var country = mobileNetwork.filter((val)=>{
					return val.ISO.toUpperCase().indexOf(geo.country) !==-1;
				})
				var lang = language.filter(function(val) {
					return val.indexOf(geo.country)!==-1;
				});
				var uts = utsName.filter(function(val) {
					return val.OSVesion === version;
				});
				
				wifi = wifiName[Math.floor((Math.random() * wifiName.length))]
				var name="";
				wifi.split("").forEach( function(element, index) {
					if([Math.floor((Math.random() * 10))]<2){
						name += element.toUpperCase();
					}else {
						name += element;
					}
				});
				if([Math.floor((Math.random() * 10))]<3){
					name+=`'s iPhone`;
				}
				function toHex(str) {
					var hex = '';
					for(var i=0;i<str.length;i++) {
						hex += ''+str.charCodeAt(i).toString(16);
					}
					return hex;
				}
				var bright = parseFloat(Math.random())
				var ssidInfo = wifiName[Math.floor((Math.random() * wifiName.length))];
				var networkInfo = ["3G","wifi"];
				var randomStorage = objDevice.Storage.split("-")[Math.floor((Math.random() * objDevice.Storage.split("-").length))]
				var battery = (Math.floor((Math.random() * 8)+3))/10;
				var geoReturn = country[Math.floor((Math.random() * country.length))]
				var totalDisk = parseFloat(randomStorage*0.87);
				var usedDisk = parseFloat(randomStorage*Math.floor((Math.random() * 41)+30)/100);
				var response = {
					HWMachine : objDevice.ModelName,
					"HW.Model"  : objDevice.HWModel.split("-").length>1?objDevice.HWModel.split("-")[Math.floor((Math.random() * objDevice.HWModel.split("-").length))]:objDevice.HWModel,
					HWCount   : objDevice.CpuCount,
					CpuFreq   : objDevice.CpuFreq,
					BatteryLevel : (battery===1)?battery+".000000":battery+"00000",
					HWPhysmem : 1037041664*objDevice.MemorySize,
					"utsname_Machinenumber" : objDevice.ModelName,
				    "utsname_Releasenumber" : uts[0].utsname_Releasenumber,
					"utsname_Systemversion" : uts[0].utsname_Systemversion,
					DeviceName : name,
					City : geo.city,
					OSVersion : version,
					MemorySize : objDevice.MemorySize+" GB",
					UserAgent : responseData,
					timezones : timezones,
					Country   : geoReturn,
					ModelName : objDevice.ModelName,
					IdForVendor : UID1,
					AdvId 		: UID2,
					ResolutionHeight : objDevice.ResolutionHeight,
					ResolutionWidth : objDevice.ResolutionWidth,
					brightbessLevel : Math.round(bright * 10000000)/10000000,
					TotalDiskSpace : totalDisk,
					UsedDiskSpace : usedDisk,
					FreeDiskSpace : totalDisk-usedDisk,
					ScreenHeight : objDevice.ScreenHeight,
					ScreenWidth  : objDevice.ScreenWidth,
					NetworkInfo : networkInfo[(Math.floor((Math.random() * 6)+1)%3===0)?0:1],
					Latitude   : geo.ll[0],
					Longitude  : geo.ll[1],
					SSIDInfo : ssidInfo,
					SSIDData : toHex(ssidInfo),
					BSIDInfo : randomMac(),
					language  : (lang.length===0)?"en-US":lang[0],
					OperatingSystemVersionString : `Version ${version} (Build ${agent[0].Build})`,
					MajorVersion : version.split(".")[0],
					MinorVersion : version.split(".")[1],
					PatchVersion : (version.split(".").length<3)?"0":version.split(".")[2],
					Kern_OsVersion : agent[0].Build,
				}
				// let buffer = Buffer.from(JSON.stringify(), 'utf16le')
				res.send(response)
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

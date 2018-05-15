var express = require('express');
var router = express.Router();
var ProxyVerifier = require('proxy-verifier');
var request = require("request");
var geoip = require('geoip-lite');

/* GET home page. */
router.get('/:parameter', function(req, res, next) {
	if(req.params.parameter === "get"){
		if(req.query.country.length===2){
			var ipGeoEqualsQuery = [];
			var count = 0;
			var countAll = 0;
			request.get({
			    url: `http://filefab.com/api.php?l=VNYGT_1-B7Wq2JJzYiSFRTN5aHoa4LekB41ywrawjUI`
			}, function (err, resData) {
				var arrayProxy = resData.body.split("<pre>")[1].split("</pre>")[0].split("\n");
				for (var i = 0; i < arrayProxy.length; i++) {
					if(arrayProxy[i]!==""){
						var geo = geoip.lookup(arrayProxy[i].split(":")[0]);
						if(geo.country.trim().toUpperCase()===req.query.country.trim().toUpperCase()&&ipGeoEqualsQuery.length<10){
							ipGeoEqualsQuery.push(arrayProxy[i]);
						}
					}
				}
				ipGeoEqualsQuery.forEach( function checkProxy(element, index) {
				  	var proxy = {
				  		ipAddress: element.split(":")[0],
						port: element.split(":")[1],
						protocol: "socks5"
				  	}
				  	ProxyVerifier.testAll(proxy, function(error, result) {
				  		countAll++;
						if (error) {
						} else {
							if(result.protocols.socks5.ok){
								count++;
								if(count==1){
									res.send(element);
									res.end();
								}
							};
						}
						if(count<1&&ipGeoEqualsQuery.length===countAll){
							res.send(false);
							res.end();
						}
					});
				});
			});
		}
	}
});

module.exports = router;

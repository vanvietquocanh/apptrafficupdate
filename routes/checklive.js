var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');
const country = require('./country');
const fetch = require("node-fetch");

const pathMongodb = require("./pathDb");

/* GET home page. */

var smartLink = function (condition) {
	try {
		var count = 0;
		var regexp = /itunes.apple.com|market|play.google.com/i;
		var reAli = /alibaba/i;
		var dataCheck = {};
		var countRequest = 0;
		var countResponse = 0;
		var query = {
			$or : [],
			nameSet : {
				$not: /AliExpress/i
			}
		}
		var platform = ["android","ios"]
		country.forEach( function(element, index) {
			query["$or"].push({countrySet: new RegExp(element,"i")});
		});
		function updateDB(data) {
			var query = {
				index : Number(data.index)
			}
			mongo.connect(pathMongodb,(err, db)=>{
				if(!err){
					db.collection("offerLead").updateOne(query, data,{ upsert: true },(err, result)=>{
					});
				}
			})
		}
		function converPost(ele) {
			var data = {
				"Url"	     : `http://rockettraffic.org/checkparameter/?offer_id=${ele.index}&aff_id=181879769070526`,
				"Os"	     : ele.platformSet,
				"Country"    : ele.countrySet,
				"User"	     : "vanvietquocanh",
				"Pass"	     : "aksjdhqwlwrhoqihewna",
				"Ipaddress"  : "159.89.206.69"
			};
			countRequest++;
			fetch('http://159.89.206.69:5000/api/Offer', { 
			    method : 'POST',
			    body   : JSON.stringify(data),
			    headers: { 
			    	'Content-Type': 'application/json'
			    },
			})
			.then(res => res.json())
			.then(json => {
				json.index = Number(ele.index);
				json.link = `http://rockettraffic.org/checkparameter/?offer_id=${ele.index}&aff_id={idFacebook}`;
				json.nameApp = ele.nameSet;
				json.package = ele.package;
				json.country = ele.countrySet;
				json.platform = ele.platformSet;
				callback(json);
			})
			.catch(err=>{
				
			});
		}
		function callback(data) {
			countResponse++;
			if(regexp.test(data.message)){
				data.statusLead = true;
				json.countRequest = 0;
				updateDB(data);
			}else{
				data.statusLead = false;
				updateDB(data);
			}
			if(countRequest === countResponse){
				loop(dataCheck);
			}
		}
		function loop(array){
			for (var i = 0; i < country.length; i++) {
				for (var j = 0; j < platform.length; j++) {
					if(array[`${country[i]}-${platform[j]}`]!==undefined){
						converPost(array[`${country[i]}-${platform[j]}`][count%array[`${country[i]}-${platform[j]}`].length])
					}
				}
			};
			count++;
		}
		mongo.connect(pathMongodb,function(err,db){
			assert.equal(null,err);
			db.collection('offer').find(query).toArray((err, result)=> {
				for (let i = 0; i < result.length; i++) {
					for (var j = 0; j < country.length; j++) {
						if(result[i].countrySet.indexOf(country[j].toUpperCase())!==-1){
							if(dataCheck[`${country[j]}-${result[i].platformSet}`]===undefined){
								dataCheck[`${country[j]}-${result[i].platformSet}`] = [];
							};
							dataCheck[`${country[j]}-${result[i].platformSet}`].push({
								"countrySet"  : country[j],
								"platformSet" : result[i].platformSet,
								"index"  	  : result[i].index,
								"package"	  : result[i].package,
								"nameSet"	  : result[i].nameSet
							})
						}
					}
				}
				loop(dataCheck);
			});
		});
	} catch(e) {
		res.redirect("/");
		res.end();
	}
}
module.exports = smartLink;
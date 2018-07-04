const mongo = require('mongodb');
const request = require("request");
// var j = request.jar();
// var FormData = require('form-data');
// var form = new FormData();
// var fetch = require("node-fetch");
// var http = require('http');
const pathMongodb = require("./routes/pathDb");
const requestApi = new RequestAPI();
// var querystring = require('querystring');


function RequestAPI() {
	this.data = [];
	this.regex = /(<([^>]+)>)/ig;
}
RequestAPI.prototype.requestDownload = function(user, pass) {
	request.get("http://113.160.224.195/api/Values", {timeout: 15*1000*60},(err,res,body)=>{
		// var data = body.split("<table border=1>")[1].split("</table>")[0].split("Download</td>\n</tr>\n\n")[1];
		// data.split("<td>\n").forEach( function(element, index) {
		// 	if(element.length>0){
		// 		var dataSave = {
		// 			country : element.split("<a href=\'")[0].split(" ")[0],
		// 			link    : element.split("<a href=\'")[1].split("\'>download")[0]
		// 		}
		// 		requestApi.data.push(dataSave);
		// 	}
		// });
		// requestApi.data.forEach( function(element, index) {
		// 	var url = `http://sshservice2424.com/v2/${element.link}`;
		// 	var cookie = request.cookie(j.getCookieString(`http://sshservice2424.com/v2/login.php?user=${user}&pass=${pass}&submit=+LOGIN+`).split(";")[0])
		// 	j.setCookie(cookie, url);
		// 	request({uri:url, method:"GET", jar: j}, (err,res, body)=>{
		// 		console.log(body)
				if(!(requestApi.regex.test(body))&&body!==undefined){
					var dataRes = JSON.parse(body);
					if(dataRes){
						var dataSave = [];
						dataRes.forEach( function(element, index) {
							let data = element.toString().split("\r\n");
							if(data[data.length-1]===""){
								data.splice(data.length-1,1)
							}
							if(data[0].indexOf(".")!==-1){
								var dataSet = {
									country : data[0].split("(")[1].split(")")[0],
									data 	: data
								}
								dataSave.push(dataSet)
							}
							// mongo.connect(pathMongodb, (err, db)=>{
							// 	db.collection("SSH").deleteOne()
							// 	db.collection("SSH").updateOne({country : dataSave.country, data}, {$set:dataSave});
							// 	db.close();
							// })
						});
						dataSave.forEach( function(element, index) {
							mongo.connect(pathMongodb, (err, db)=>{
								db.collection("SSH").deleteMany({country : element.country},(err)=>{
									db.close();
								})
							})
						});
						dataSave.forEach( function(element, index) {
							mongo.connect(pathMongodb, (err, db)=>{
								db.collection("SSH").insertOne(element);
								db.close();
							})
						});
					}
				};
		// 	});
		// });
	})
}
module.exports = requestApi;
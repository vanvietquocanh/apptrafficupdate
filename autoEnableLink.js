const mongo = require('mongodb');
const pathMongodb = require("./routes/pathDb");

var enableConversion = ()=>{
	mongo.connect(pathMongodb, (err,db)=>{
		db.collection("conversion").updateMany({enable:false},{$set:{enable:true}}, (err, result)=>{
			db.close();
		})
	})
}
module.exports = enableConversion;
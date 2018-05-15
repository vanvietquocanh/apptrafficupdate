var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');

const pathMongodb = require("./pathDb");

router.get('/', function(req, res, next) {
	var query = {
		"idFacebook" : req.user.id
	}
	var netName = {};
	function renderPage(download, myOffer, addOffer, selNetworks, member, icon) {
  		var admin =`<li>
		       			<a href="/admin" class="waves-effect"><i class="zmdi zmdi-view-dashboard"></i> <span> Dashboard </span> </a>
		    		</li>`;
		res.render("totalCVR",{
			"hostname": req.header.hostname,
			"name"    : req.user.displayName,
			"avatar"  : req.user.photos[0].value,
			"admin"   : admin,
			"download": download,
			"selNetworks" : selNetworks,
			"myOffer" : myOffer,
			"addOffer": addOffer,
			"member"  : member,
			"icon"	  : icon
 		})
  	}
	mongo.connect(pathMongodb, (err,db)=>{
		db.collection("userlist").findOne(query, (err,result)=>{
			if(result.admin){
				var download, addOffer, myOffer, selNetworks, icon;
				download =  `<li class="has_sub">
                                <a href="/totalcvr" class="waves-effect"><i class="fa fa-credit-card-alt"></i> <span> Payment Report </span></a>
                            </li>
                            <li class="has_sub">
                                <a href="/userrequest" class="waves-effect"><i class="fa fa-envelope-o"></i> <span> User request </span></a>
                            </li>
                            <li class="has_sub">
                                <a href="/adduser" class="waves-effect"><i class="fa fa-users"></i> <span> Add User  </span></a>
                            </li>
							<li class="has_sub">
								<a href="/download" class="waves-effect"><i class="fa fa-download"></i> <span> Download </span></a>
		                    </li>`;
		        myOffer = 	`<li class="has_sub">
                                <a href="/liveoffer" class="waves-effect"><i class="ti ti-layout-list-post"></i> <span> Live Offers </span></span></a>
                            </li>`;
            	addOffer=  `<li class="has_sub">
		                        <a href="/addnewoffer" class="waves-effect"><i class="fa fa-plus"></i> <span> Add Offers </span></a>
		                    </li>`;
		        selNetworks = `<select class="select-drop-blue sel-mem" name="sel-Networks" id="sel-Networks">
                                    <option value="all">Network List</option>`;
                icon = `<li class="has_sub">
		                                <a href="/iconhandle" class="waves-effect"><i class="fa fa-picture-o"></i> <span> Icon Handle</span></a>
		                            </li>`;
                db.collection("network").find().toArray((err, net)=>{
                	net.forEach( function(element, index) {
						if(netName[`${element.name}`]===undefined){
							netName[`${element.name}`] = element.name;
						}
					});
					Object.keys(netName).forEach( function(element, index) {
						selNetworks += `<option value="${element}">${element}</option>`;
					});
					selNetworks += `</select>`;
					var member = {
						$or :[{member : true}, {master : true}]
					}
					db.collection("userlist").find(member).toArray((err, member)=>{
						renderPage(download, myOffer, addOffer, selNetworks, member, icon);
					})
				})
			}else{
				res.redirect("/")
			}
		})
	})
});

module.exports = router;
var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');


const pathMongodb = require("./pathDb");

/* GET home page. */
router.get('/', function(req, res, next) {
	if(req.user){
	  	try {
			var query = {
					"idFacebook": req.user.id
 				}
 			mongo.connect(pathMongodb,function(err,db){
				assert.equal(null,err);
					db.collection('userlist').findOne(query,function(err,result){
						assert.equal(null,err);
						db.close();
						var download, addOffer, myOffer, icon = "";
						if(result.admin){
							icon = `<li class="has_sub">
		                                <a href="/iconhandle" class="waves-effect"><i class="fa fa-picture-o"></i> <span> Icon Handle</span></a>
		                            </li>`;
							addOffer 	 = `<li class="has_sub">
						                        <a href="/addnewoffer" class="waves-effect"><i class="fa fa-plus"></i> <span> Add Offers </span></a>
						                    </li>`
							download     = `<li class="has_sub">
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
						    myOffer      = `<li class="has_sub">
				                                <a href="/liveoffer" class="waves-effect"><i class="ti ti-layout-list-post"></i> <span> Live Offers </span></span></a>
				                            </li>`;
						    renderPage(download, myOffer, addOffer, icon)
						}else{
							res.redirect("/")
						}
					});
			});
		} catch(e) {
			res.redirect("/")
		}
	  	function renderPage(download, myOffer, addOffer, icon) {
	  		var admin =`<li>
			       			<a href="/admin" class="waves-effect"><i class="zmdi zmdi-view-dashboard"></i> <span> Dashboard </span> </a>
			    		</li>`;
			res.render("addUser",{
				"hostname": req.header.hostname,
				"name"    : req.user.displayName,
				"avatar"  : req.user.photos[0].value,
				"admin"   : admin,
				"download": download,
				"myOffer" : myOffer,
				"addOffer": addOffer,
				"icon"	  : icon
			})
	  	}
	}else{
		res.redirect("/")
	}
});

module.exports = router;

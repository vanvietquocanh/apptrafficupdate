var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');


const pathMongodb = require("./pathDb");

router.get("/",(req, res, next)=>{
	if(req.user){
		try {
			var query = {
					"idFacebook": req.user.id
 				}
 			mongo.connect(pathMongodb,function(err,db){
				assert.equal(null,err);
					db.collection('userlist').findOne(query,function(err,result){
						var download,memSel, myOffer, icon = "";
						if(result.admin){
							icon = `<li class="has_sub">
		                                <a href="/iconhandle" class="waves-effect"><i class="fa fa-picture-o"></i> <span> Icon Handle</span></a>
		                            </li>`;
							myOffer = 	`<li class="has_sub">
			                                <a href="/liveoffer" class="waves-effect"><i class="ti ti-layout-list-post"></i> <span> Live Offers </span></span></a>
			                            </li>`;
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
						                        <a href="/download" class="waves-effect"><i class="fa fa-download" hidden="true"></i> <span> Download </span></a>
						                    </li>`;
						    memSel 	 	= `<select class="select-drop-blue sel-mem" name="members" id="members"><option value='all'>Members</option></select>`;
						    addOffer  = `<li class="has_sub">
					                        <a href="/addnewoffer" class="waves-effect"><i class="fa fa-plus"></i> <span> Add Offers </span></a>
					                    </li>`;
						}else if(result.member){
							download = ""
							myOffer  = `<li class="has_sub">
			                                <a href="/myoffers" class="waves-effect"><i class="ti ti-layout-list-post"></i> <span> My Offers </span></span></a>
			                            </li>`;
			                memSel    =``;
			                addOffer  = ``; 
						}else if(result.master){
							download = ""
							myOffer  = `<li class="has_sub">
			                                <a href="/liveoffer" class="waves-effect"><i class="ti ti-layout-list-post"></i> <span> Live Offers </span></span></a>
			                            </li>`;
			                memSel    =``;
			                addOffer  = ``; 
						};
						renderPage(download, memSel, myOffer, addOffer, icon)
						assert.equal(null,err);
						db.close();
					});
			});
		} catch(e) {
			res.redirect("/")
		}
	  	function renderPage(download, memSel, myOffer, addOffer, icon) {
	  		var admin =`<li>
		       			<a href="/admin" class="waves-effect"><i class="zmdi zmdi-view-dashboard"></i> <span> Dashboard </span> </a>
		    		</li>`;
			res.render("conversion",{
				"hostname": req.header.hostname,
				"name"    : req.user.displayName,
				"avatar"  : req.user.photos[0].value,
				"admin"   : admin,
				"download": download,
				"memSel"  : memSel,
				"myOffer" : myOffer,
				"addOffer": addOffer,
				"icon"    : icon
			})
	  	}
	}else{
		res.redirect("/")
	}
})

module.exports = router;
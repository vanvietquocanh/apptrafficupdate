"use strict";
var eleRender = $("#renderUserList");
var ipName = $("#name");
var ipPass = $("#pass");
var ipAddress = $("#ipAddress");
var addUser = $("#addUser");
var userlist = new UserList();
function UserList() {
	this.userList;
	this.pagination = [];
	this.eachPage = [];
	this.maxIndex = 0;
	this.regularUserName = /^[A-Za-z][A-Za-z0-9]*$/;
	this.ipNameEdit;
	this.ipPassEdit;
	this.indexEdit;
	this.ipAddress;
}
UserList.prototype.getAPI = function(path, data){
	$.post(path, data, function(data, textStatus, xhr) {
		console.log(data)
		userlist.setData(data)
	});
};
UserList.prototype.setData = function(data){
	this.userList = data;
	this.userList.forEach( function(user, index) {
		userlist.createHTML(user,index);
	});
};
UserList.prototype.createHTML = function(user, index){
	var html = `<ul class="user-box-add after-fix-user-box user-box-${index}">
               		<li class="user-box-list list-${index}"><a class="user-box-list-items items-${index}">${user.username}</a></li>
               		<li class="user-box-list list-${index}"><a class="user-box-list-items items-${index}">${user.password}</a></li>
               		<li class="user-box-list list-${index}"><a class="user-box-list-items items-${index}">${user.ipAddress}</a></li>
               		<li class="user-box-list icon-items icon-items-${index}">
               			<ul class="fx-pad edit-ele"><a class="fa btn-user btn-edit btn-edit-${index}"></a></ul>
               			<ul class="fx-pad"><a class="fa btn-user btn-del btn-del-${index}"></a></ul>
               		</li>
               </ul>`;
    userlist.pagination.push(html);
    userlist.countPage();
    eleRender.empty();
    userlist.appendArray();
};
UserList.prototype.countPage = function(){
	while(userlist.pagination.length>0){
		userlist.eachPage.push(userlist.pagination.splice(0, 30));
	}
	userlist.appendArray();
};
UserList.prototype.appendArray = function(){
	userlist.eachPage.forEach(function(el, i){
		eleRender.append(el)
	});
	ipName.val("");
	ipPass.val("");
	ipAddress.val("");
	ipName.focus();
	userlist.delEvent();
	userlist.addEvent();
};
UserList.prototype.updateDB = function(user, index) {
	$.post('/adminupdateuser', user, function(data, textStatus, xhr) {
		if(data.code === 11000){
			alert("Has used for this name!!")
		}else{
			userlist.userList.push(user)
			userlist.pagination = [];
			userlist.eachPage = [];
			eleRender.empty();
			userlist.setData(userlist.userList)
		}
	});
};
UserList.prototype.addUsertoDom = () =>{
	if(userlist.regularUserName.test(ipName.val())&&ipName.val().length>6&&ipPass.val().length>6&&userlist.regularUserName.test(ipPass.val())){
		var user = {
			"username" : ipName.val(),
			"password" : ipPass.val(),
			"ipAddress": ipAddress.val()
		}
		userlist.updateDB(user, userlist.maxIndex);
	}else{
		alert("User name or password invalid");
	}
}
UserList.prototype.delEvent = function() {
	$(".btn-del").unbind('click');
	$(".btn-edit").unbind('click');
};
UserList.prototype.updateChange = function(name, pass, ip) {
	var data = {
		"query" : {
			"username" : name,
			"password" : pass,
			"ipAddress": ip
		},
		"change" : {
			"username" : ipName.val(),
			"password" : ipPass.val(),
			"ipAddress": ipAddress.val()
		}
	};
	$.post('/edituseradd', data, function(res, textStatus, xhr) {
		console.log(res, textStatus, xhr)
		if(res){
			userlist.userList[userlist.indexEdit] = data.change;
			eleRender.empty();
			userlist.pagination = [];
			userlist.eachPage = [];
			addUser.removeClass("icon-set").addClass("icon-user");
			userlist.setData(userlist.userList)
		}
	});
};
UserList.prototype.addEvent = function(){
	$(".btn-del").click(function(event) {
		var indexClick = $(event.target).attr("class").split("del-")[1];
		$.post('/deluser', userlist.userList[indexClick], function(data, textStatus, xhr) {
			if(data){
				if(data.username === userlist.userList[indexClick].username){
					userlist.userList.splice(indexClick, 1);
					userlist.pagination = [];
					userlist.eachPage = [];
					eleRender.empty();
					userlist.setData(userlist.userList)
				}
			}
		});
	});
	$(".btn-edit").click(function(event) {
		var indexClick = $(event.target).attr("class").split("edit-")[1];
		ipPass.val($(`.items-${indexClick}`)[1].innerHTML);
		ipName.val($(`.items-${indexClick}`)[0].innerHTML);
		ipAddress.val($(`.items-${indexClick}`)[2].innerHTML);
		addUser.removeClass("icon-user").addClass("icon-set");
		userlist.indexEdit = indexClick;
		userlist.ipNameEdit = ipName.val();
		userlist.ipPassEdit = ipPass.val();
		userlist.ipAddress = ipAddress.val();
	});
};
ipPass.keydown(function(event) {
	if(event.keyCode === 13){
		userlist.addUsertoDom();
	}
});
addUser.click(function(event) {
	if(addUser.attr("class").indexOf("icon-user")!==-1){
		userlist.addUsertoDom();
	}else{
		userlist.updateChange(userlist.ipNameEdit, userlist.ipPassEdit, userlist.ipAddress);
	}
});
userlist.getAPI("/getDataUserList", null)
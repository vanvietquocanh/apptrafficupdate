"use strict";
var eleRender = $("#renderUserList");
var ipName = $("#name");
var ipPass = $("#pass");
var addUser = $("#addUser");
var delBtn = $(".btn-del");
var editBtn = $(".btn-edit");
var userlist = new UserList();
function UserList() {
	this.userList;
	this.pagination = [];
	this.eachPage = [];
}
UserList.prototype.getAPI = function(path, data){
	$.post(path, data, function(data, textStatus, xhr) {

	});
};
UserList.prototype.setData = function(data){
	this.userList = data;
};
UserList.prototype.render = function(){
	this.userList.forEach( function(user, index) {
		var html = `<ul class="user-box after-fix-user-box user-box-${index}">
	               		<li class="user-box-list list-${index}"><a class="user-box-list-items items-${index}">văn viết quốc anh</a></li>
	               		<li class="user-box-list list-${index}"><a class="user-box-list-items items-${index}">póadposadkpoaskd</a></li>
	               		<li class="user-box-list icon-items icon-items-${index}">
	               			<ul class="fx-pad edit-ele"><a class="fa btn-user btn-edit btn-edit-${index}"></a></ul>
	               			<ul class="fx-pad"><a class="fa btn-user btn-del btn-del-${index}"></a></ul>
	               		</li>
	               </ul>`;
	    userlist.pagination.push(html);
	});
};
UserList.prototype.countPage = function(){
	while(userlist.pagination.length>0){
		userlist.eachPage.push(userlist.pagination.splice(0, 30));
	}
};
UserList.prototype.addEvent = function(){

};
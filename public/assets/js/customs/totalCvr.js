var totalcvr = new TotalCVR();
var indexMember = 1;
var table = $("#render")
var search = $("#search")
var renderData = $("#renderData");
var dateFilterStart = $("#dateFilterStart");
var dateFilterEnd = $("#dateFilterEnd");
var filter = $("#filter");
var member = $("#member").children('option');
dateFilterStart.attr("placeholder","Start Date");
dateFilterEnd.attr("placeholder","End Date");
function TotalCVR() {
	this.start = 0;
	this.requestGetData;
	this.afterHandling = [];
	this.arrayListOfUser = [];
	this.arrayList = [];
	this.dataFilterMem = [];
	this.begin = 0;
	this.regexpDate = /(0\d{1}|1[0-2])\/([0-2]\d{1}|3[0-1])\/(19|20)\d{2}/;
}
TotalCVR.prototype.setData = function(user, conversion) {
	this.user = user;
	this.conversion = conversion;
	totalcvr.handlingData();
};
TotalCVR.prototype.setDataDetails = function(data, userId) {
	this[`${userId}`] = data;
	totalcvr.createDetailsHTML(userId);
};
TotalCVR.prototype.postData = function(path, startDate, endDate) {
	var dataPost = {
		"startDate"  : startDate,
		"endDate"  	 : endDate
	}
	totalcvr.requestGetData = $.post(path, dataPost, function(data, textStatus, xhr) {
		if(data){
			totalcvr.setData(data.user, data.conversion)
		}
	});
};
TotalCVR.prototype.createDetailsHTML = function(userId) {
	var totalRevenue = 0;
	var totalConversion = 0;
	var payTotal = 0;
	$("#renderConversion").empty();
	totalcvr.arrayListOfUser = [];
	this[`${userId}`].forEach( function(element, index) {
		payTotal += Number(element._id.pay);
		totalRevenue += Number(element.revenue);
		totalConversion += Number(element.countConversion);
		let elementHtml = `<tr role="row" class="odd fixcenter sel-items" style="color: #222">
							<td class="sorting_1" tabindex="0" style="color: #222">${element._id.index}</td>`;
		if(element._id.platform==="android"){
			elementHtml += `<td class="sorting_1" tabindex="0" style="color: #222;"><img src="./assets/images/android.png"/></td>`;
		}else if(element._id.platform === "ios"){
			elementHtml += `<td class="sorting_1" tabindex="0" style="color: #222;"><img src="./assets/images/apple.png"/></td>`;
		}else{
			elementHtml += `<td class="sorting_1" tabindex="0" style="color: #222;"><img src=""/></td>`;
		}
			elementHtml += `<td class="sorting_1" tabindex="0" style="color: #222">${element._id.nameSet}</td>
							<td style="color: #222;">${element._id.pay}</td>
							<td style="color: #222;">${element.countConversion}</td>
							<td class="showItems-name" style="color: #222">${parseFloat(Math.round(element.revenue*1000)/1000)}</td>
							<td style="color: #222;">${element._id.networkName}</td>
						</tr>`;
		totalcvr.arrayListOfUser.push(elementHtml);
		if(index===totalcvr[`${userId}`].length-1){
			var elementHtmlSum = `<tr role="row" class="odd fixcenter sel-items" style="color: #111;">
									<td class="sorting_1" tabindex="0" style="color: #111;"><b>Total</b></td>
									<td class="sorting_1" tabindex="0" style="color: #111;"></td>
									<td class="showItems-name" style="color: #111;"></td>
									<td class="sorting_1" tabindex="0" style="color: #111;"><b>${parseFloat(Math.round(payTotal*1000)/1000)}</b></td>
									<td class="sorting_1" tabindex="0" style="color: #111;"><b>${totalConversion}</b></td>
									<td style="color: #111;"><b>${parseFloat(Math.round(totalRevenue*1000)/1000)}</b></td>
									<td class="showItems-name" style="color: #111;"></td>
								</tr>`;
			totalcvr.arrayListOfUser.push(elementHtmlSum);
		}
	});
	$("#renderConversion").append(totalcvr.arrayListOfUser.toString().split(",").join(""));
}
TotalCVR.prototype.postDataDetails = function(path, userId, startDate, endDate) {
	let dataPost = {
		"userId"    : userId,
		"startDate" : startDate,
		"endDate" 	: endDate
	}
	$.post(path, dataPost, function(data, textStatus, xhr) {
		totalcvr.setDataDetails(data, userId)
	});
};
TotalCVR.prototype.handlingData = function() {
	this.user.forEach(function(user, index) {
		totalcvr.conversion.forEach(function(conversion, index) {
			if(user.idFacebook === conversion._id){
				conversion.avatar = user.profile.photos[0].value;
				conversion.username = user.profile.displayName;
				totalcvr.afterHandling.push(conversion);
			}
		});
	});
	totalcvr.arrayList = [];
	totalcvr.createHTML($("#member").val(), this.afterHandling);
};
TotalCVR.prototype.validateTime = function() {
	return (dateFilterStart.val()===""&&dateFilterEnd.val()==="")
		|| (totalcvr.regexpDate.test(dateFilterStart.val())
		&& totalcvr.regexpDate.test(dateFilterEnd.val())
		&& new Date(dateFilterEnd.val()).getTime() > new Date().getTime())
};
TotalCVR.prototype.listenerEvent = function() {
	$(".showCVRUser").click((event)=>{
		var start, end;
		if(totalcvr.validateTime()){
			dateFilterStart.css("border", "1px solid #98a6ad")
			dateFilterEnd.css("border", "1px solid #98a6ad")
			if(dateFilterStart.val()===""){
				start = 0;
			}else{
				start = dateFilterStart.val();
			}
			if(dateFilterEnd.val()===""){
				end = new Date().getTime();
			}else{
				end = dateFilterEnd.val();
			}
			$(".custNet").fadeIn('slow');
			totalcvr.postDataDetails("/detailscvruser", event.target.classList[3], start, end)
		}else{
			alert("Please re-enter date");
			dateFilterStart.css("border", "1px solid red")
			dateFilterEnd.css("border", "1px solid red")
		}
	});
};
TotalCVR.prototype.removeEvent = function() {
	$(".showCVRUser").unbind('click');
};
TotalCVR.prototype.createHTML = function(userId ,data) {
	table.empty();
	var totalRevenue = 0;
	var totalConversion = 0;
	var dataRender = data.filter((user)=>{
		return user.username.trim().toLowerCase().indexOf(userId)!==-1;
	})
	dataRender.forEach( function(element, index) {
		if(totalcvr.begin===0){
			$("#member").append(`<option value="${element.username}">${element.username}</option>`);
		}
		totalRevenue += Number(element.revenue);
		totalConversion += Number(element.countConversion);
		var elementHtml = `<tr role="row" class="odd fixcenter sel-items" style="color: #111">
							<td class="sorting_1" tabindex="0" style="color: #111">${element._id}</td>
							<td class="sorting_1" tabindex="0" style="color: #111"><img src="${element.avatar}" style="border-radius: 3em;"/></td>
							<td class="sorting_1" tabindex="0" style="color: #111">${element.username}</td>
							<td class="showItems-name">${parseFloat(Math.round(element.revenue*1000)/1000)}</td>
							<td style="color: #111;">${element.countConversion}</td>
							<td style="color: #111;"><i class="fa fa-folder-open-o showCVRUser ${element._id}"/></td>
						</tr>`;
		totalcvr.arrayList.push(elementHtml)
		if(index===totalcvr.afterHandling.length-1){
			var elementHtmlSum = `<tr role="row" class="odd fixcenter sel-items" style="color: #111">
									<td class="sorting_1" tabindex="0" style="color: #111"><b>Total</b></td>
									<td class="sorting_1" tabindex="0" style="color: #111"></td>
									<td class="showItems-name"></td>
									<td style="color: #111;">${parseFloat(Math.round(totalRevenue*1000)/1000)}</td>
									<td class="sorting_1" tabindex="0">${totalConversion}</td>
									<td class="sorting_1" tabindex="0"></td>
								</tr>`;
			totalcvr.arrayList.push(elementHtmlSum)
		}
	});
	table.append(totalcvr.arrayList.toString().split(",").join(""));
	totalcvr.removeEvent();
	totalcvr.listenerEvent();
	this.begin++;
};
$("#member").change(function(event) {
	if($("#member").val()===""){
		totalcvr.begin = 0;
	}
	totalcvr.arrayList = [];
	totalcvr.createHTML($("#member").val(), totalcvr.afterHandling);
});
$("#closeDetail").click(function(event) {
	$(".custNet").fadeOut('slow');
});
$("body").keydown(function(event) {
	if(event.key==="Escape"||event.keyCode===27){
		$("#closeDetail").click();
	}
});
search.keyup(function(event) {
	if(search.val()===""){
		totalcvr.begin = 0;
	}
	totalcvr.arrayList = [];
	totalcvr.createHTML(search.val().trim().toLowerCase(), totalcvr.afterHandling)
});
dateFilterStart.datepicker();
dateFilterEnd.datepicker();
filter.click((e)=>{
	if(totalcvr.validateTime()){
		dateFilterStart.css("border", "1px solid #98a6ad")
		dateFilterEnd.css("border", "1px solid #98a6ad")
		totalcvr.arrayList = [];
		totalcvr.afterHandling = [];
		totalcvr.begin = 0;
		totalcvr.postData("/statistical", new Date(dateFilterStart.val()).getTime(), new Date(dateFilterEnd.val()).getTime())
	}else{
		alert("Please re-enter date");
		dateFilterStart.css("border", "1px solid red")
		dateFilterEnd.css("border", "1px solid red")
	}
})
totalcvr.postData('/statistical', totalcvr.start, new Date().getTime());
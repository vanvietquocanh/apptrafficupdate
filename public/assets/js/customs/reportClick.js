"use strict";
var table = $('tbody');
var sortItems = new SortItems;
var paginationUL = $('#pag');
var platform = $("#os");
var members = $("#members");
var filterBtn = $('#filter');
var sortOS = $("#os");
var sortCountry = $("#country");
var rowsTable = $("fixcenter");
var search = $('#search');
var btnSearch = $('#btn-search');
var dateStart = $("#dateFilterStart");
var dateEnd   = $("#dateFilterEnd");
function SortItems() {
	this.dataReportClick;
	this.nameUsers = [];
	this.path = "";
	this.countStart = 0;
	this.countEnd = 500;
	this.arrayList = [];
	this.page = 0;
	this.newArrayList = [];
}
SortItems.prototype.getAPI = function(path, data){
	sortItems.setPath(path);
	$.post(path, data,function(res) {
		if(sortItems.nameUsers.length===0){
			sortItems.checkMemberReq(res)
		}
		btnSearch.children().removeClass("fa-spin fa-refresh").addClass('fa-search');
		filterBtn.children().removeClass("fa-spin fa-refresh").addClass('fa-search');
		sortItems.setDataReport(res)
		if(res.length===500&&!sortItems.searchMethod){
			sortItems.countStart += 500;
			sortItems.countEnd += 500;
			sortItems.getAPI(sortItems.path, data);
		}
	});
};
SortItems.prototype.checkMemberReq = function(data){
	if(sortItems.countStart===0){
		var name = [];
		data.forEach((app, index)=>{
			if(name.indexOf(app.name)===-1){
				name.push(app.name)
			}
		})
		var htmlOptionTag = "<option value='all'>Members</option>";
		name.forEach((app)=>{
			htmlOptionTag += `<option value="${app}">${app}</option>`;
		})
		members.append(htmlOptionTag)
	}
}
SortItems.prototype.setPath = function(path){
	this.path = path;
};
SortItems.prototype.setDataReport = function(data){
	this.dataReportClick = data;
	sortItems.renderReport()
};
SortItems.prototype.renderReport = function() {
	table.empty();
	var lengthofListReportClick = this.dataReportClick.length;
	for(let x = 0; x < this.dataReportClick.length; x++){
		var elementHtml = `<tr role="row" class="odd fixcenter sel-items" style="color: #111">
							<td class="sorting_1" tabindex="0" style="color: #111">${sortItems.dataReportClick[x].id}</td>
							<td class="sorting_1" tabindex="0" style="color: #111">${sortItems.dataReportClick[x].appName}</td>
							<td class="sorting_1" tabindex="0" style="color: #111">${sortItems.dataReportClick[x].name}</td>
							<td class="showItems-name">${sortItems.dataReportClick[x].idOffer}</td>
							<td style="color: #111;">${sortItems.dataReportClick[x].time}</td>
							<td style="color: #111;">${sortItems.dataReportClick[x].ip}</td>
							<td>${sortItems.dataReportClick[x].agent}</td>
							<td style="max-width:10px;">${sortItems.dataReportClick[x].country}</td>
							<td>${sortItems.dataReportClick[x].key}</td>
						</tr>`;
			sortItems.arrayList.push(elementHtml)
	}
	sortItems.countPage();
}
SortItems.prototype.countPage = function(){
	var x = 0;
	var paginationString = `<ul class="pagination auto-pagination pull-right m-t-lg">
                                <li class="prev-page disabled">
                                	<a class="pagination-items">‹</a>
						        </li>`;
	while (sortItems.arrayList.length>0){
		sortItems.newArrayList.push(sortItems.arrayList.splice(0, 20));
		if(x<5){
			paginationString +=    `<li class="page-button">
	                                    <a class="pagination-items pag-${x} pagination-number">${x+1}</a>
	                                </li>`;
		}
        x++;
	};
		paginationString  += 	`<li class="next-page">
                                    <a class="pagination-items">...</a>
                                </li>
                                <li class="next-page">
                                    <a class="pagination-items pag-${sortItems.newArrayList.length-1} pagination-number">${sortItems.newArrayList.length}</a>
                                </li>
                                <li class="next-page">
                                    <a class="pagination-items">›</a>
                                </li>
                            </ul>`;
	sortItems.renderPage(sortItems.page, paginationString);
};
SortItems.prototype.newPagination = function(page){
	var paginationString = `<ul class="pagination auto-pagination pull-right m-t-lg">
                                <li class="prev-page disabled">
                                	<a class="pagination-items">‹</a>
						        </li>
								<li class="next-page">
                                    <a class="pagination-items pag-0 pagination-number">1</a>
                                </li>
                                <li class="next-page">
                                    <a class="pagination-items">...</a>
                                </li>
                                <li class="next-page">
                                    <a class="pagination-items pag-${Number(page)-2} pagination-number">${Number(page)-1}</a>
                                </li>
                                <li class="next-page">
                                    <a class="pagination-items pag-${Number(page)-1} pagination-number">${page}</a>
                                </li>
                                <li class="next-page">
                                    <a class="pagination-items pag-${page} pagination-number">${1+Number(page)}</a>
                                </li>
                                <li class="next-page">
                                    <a class="pagination-items pag-${1+Number(page)} pagination-number">${2+Number(page)}</a>
                                </li>
                                <li class="next-page">
                                    <a class="pagination-items pag-${2+Number(page)} pagination-number">${3+Number(page)}</a>
                                </li>
                                <li class="next-page">
                                    <a class="pagination-items">...</a>
                                </li>
                                </li>
								<li class="next-page">
                                    <a class="pagination-items pag-${sortItems.newArrayList.length-1} pagination-number">${sortItems.newArrayList.length}</a>
                                </li>
                                <li class="next-page">
                                    <a class="pagination-items">›</a>
                                </li>
                            </ul>`;
	sortItems.renderPage(page, paginationString);
};
SortItems.prototype.renderPage = function(page, pagination){
	$.each(sortItems.newArrayList[page], function(index, el) {
		table.append(el);
	});
	if(pagination){
		paginationUL.empty();
		paginationUL.append(pagination);
	};
	$(`.pag-${page}`).parent().addClass('active');
	$(".pagination-number").click((e)=>{
		sortItems.page = $(e.target).attr("class").split("pag-")[1].split(" ")[0];
		table.empty();
		if(sortItems.page>2&&sortItems.page<sortItems.newArrayList.length-3){
			sortItems.newPagination(sortItems.page)
			$(`.next-page`).removeClass('active');
			$(`.pag-${sortItems.page}`).parent().addClass('active');
		}else{
			sortItems.renderPage(sortItems.page, pagination)
		}
	})
};
dateStart.datepicker();
dateEnd.datepicker();
SortItems.prototype.addMemberList = function(){
	sortItems.dataReportClick.forEach((app, index)=>{
		if(sortItems.nameUsers.indexOf(app.name)===-1){
			sortItems.nameUsers.push(app.name)
		}
	})
	var htmlOptionTag = "";
	nameUsers.name.forEach((app)=>{
		htmlOptionTag += `<option value="${app}">${app}</option>`;
	})
	members.append(htmlOptionTag)
};
function changeTime(data) {	
	var date, dateConvert = [];
		date = data.split("/");
		dateConvert = (new Date(date[2], date[1]-1, date[0]).getTime());
	return dateConvert;
}
filterBtn.click(function(event) {
	sortItems.searchMethod = true;
	sortItems.countStart = 0;
	sortItems.countEnd   = 500;
	filterBtn.children().removeClass("fa-search").addClass('fa-spin fa-refresh');
	var OS = "", country = "", name = "", startDate = "", endDate = "";
	if(platform.val()!=="all"){
		OS = platform.val();
	}
	if(members.val()!=="all"){
		name = members.val();
	}
	if(sortCountry.val()!=="all"){
		country = sortCountry.val().toUpperCase();
	}
	if(dateStart.val()!==""||dateEnd.val()!==""){
		if(changeTime(dateStart.val())<changeTime(dateEnd.val())){
			dateStart.css("border", "1px solid #98a6ad")
			dateEnd.css("border", "1px solid #98a6ad")
			startDate 	= changeTime(dateStart.val());
			endDate 	= changeTime(dateEnd.val());
		}else {	
			dateStart.css("border", "1px solid #ff4757");
			dateEnd.css("border", "1px solid #ff4757");
			startDate = "";
			endDate   = "";
		}
	}
	sortItems.countStart = 0;
	sortItems.countEnd   = 500;
	let dataFilter = {
		"platform" 		: OS,
		"country"		: country,
		"member" 		: name,
		"querySearch" 	: "",
		"startDate"     : startDate,
        "endDate"       : endDate,
        "countStart"    : sortItems.countStart,
        "countEnd"      : sortItems.countEnd
	}
	sortItems.arrayList = [];
	sortItems.newArrayList = [];
	sortItems.getAPI(sortItems.path, dataFilter)
});
btnSearch.click(function(event) {
	if(search.val()!==""){
		sortItems.arrayList = [];
		sortItems.newArrayList = [];
		sortItems.searchMethod = true;
		sortItems.countStart = 0;
		sortItems.countEnd   = 500;
		var data = {
			"platform" 		: "",
			"country"		: "",
			"member" 		: "",
			"query"			: search.val().trim().toLowerCase(),
			"startDate"     : startDate,
		    "endDate"       : endDate,
		    "countStart"    : sortItems.countStart,
            "countEnd"      : sortItems.countEnd
		}
		btnSearch.children().removeClass("fa-search").addClass('fa-spin fa-refresh');
		sortItems.getAPI(data, sortItems.path)
	}
});

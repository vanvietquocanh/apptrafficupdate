'use strict';
var table = $('#renderDataOffer');
var sortItems = new SortItems;
var paginationUL = $('#pag');
var filterBtn = $("#filter");
var platform = $("#os");
var result = $("#result");
var download = $('#download-btn');
var sortCountry = $("#country");
var tagDownload = $("#download-btn");
var rowsTable = $("fixcenter");
var members = $("#members");
var selNetworks = $("#sel-Networks");
var search = $('#search');
var btnSearch = $("#btn-search");
var requestItems;
var htmlSortCountry = "<option value=''>Select Country</option>";
$("head").append(`<script src="http://${window.location.hostname}/socket.io/socket.io.js" type="text/javascript" charset="utf-8" async="" defer=""></script>`)
$(()=>{
	var socket = io(`http://${window.location.hostname}/`);
	socket.on('offerlive', function (data) {
		console.log(data)
	});
	socket.on("offerlive123", data=>{
		console.log(data)
	})
})
countryData.forEach( function(element, index) {
	htmlSortCountry += `<option value="${element.countryCode}">${element.countryName}</option>`
});
sortCountry.append(htmlSortCountry)
function SortItems() {
	this.pending;
	this.list;
	this.arrayList = [];
	this.admin;
	this.page = 0;
	this.searchMethod = false;
	this.countStart = 0;
	this.newArrayList = [];
	this.master = true;
	this.conditionRender = false;
	this.checkboxGroup = [];
	this.page = [];
}
SortItems.prototype.getAPI = function(skip) {
	var path = `/getoffer/live?start=${skip}`;
	requestItems = $.get(path, function(res) {
		if(res.length===500){
			sortItems.countStart+=500;
			sortItems.getAPI(sortItems.countStart);
			res.forEach( function(element, index) {
				sortItems.setData(element)
			});
		}else{
			if(res.length>0){
				res.forEach( function(element, index) {
					sortItems.setData(element)
				});
			}
		}
		sortItems.createHtml(sortItems.arrayList);
	});
};
SortItems.prototype.setData = function(data){
	this.arrayList.push(data);
};
SortItems.prototype.createHtml = function(dataRender){
	sortItems.conditionRender = false;
	$.post('/getprofileuser', function(data, textStatus, xhr) {
		$.each(dataRender, function(index, val) {
			var pathRedirect = `http://${window.location.hostname}/checkparameter/?offer_id=${val.dataOffer.index}&aff_id=${data}`
			var elementHtml =  `<div class="offerItems">
					            <ul class="offerItems-nonePd block-img">
					                <img class="image-logo" src="${val.dataOffer.imgSet}" alt="">
					                <div class="respon-checkbox">
					                    <div class="checkbox checkbox-primary">
					                        <input class="checkbox-group" id="checkbox-${val.dataOffer.index}" type="checkbox" name="offer" value="${val.dataOffer.index}">
					                        <label for="checkbox-${val.dataOffer.index}">
					                        </label>
					                    </div>
					                </div>
					            </ul>
					            <ul class="offerItems-nonePd block-name-platform">
					            <ul class="container-name-platform fix-margin">`;
			switch (val.dataOffer.platformSet) {
				case "android":
					elementHtml += `<li class="style-list-of-items style-plat"><img class="img-opacity" src="./assets/images/android.png" alt=""></li>`;
					break;
				case "ios":
					elementHtml += `<li class="style-list-of-items style-plat"><img class="img-opacity" src="./assets/images/apple.png" alt=""></li>`;
					break;
			}
					elementHtml += `<li class="style-list-of-items style-name-app"><a class="text-nameApp">${val.dataOffer.nameSet}</a></li>
					                </ul>
					                <li class="style-list-of-items flex-items fixline-text">
					                    <div class="content-info flex-left id-prevlink content-flex">
					                        <ul class="fix-margin custom-margin-respone">
					                        	<a class="text-block">#${val.dataOffer.index}</a>
					                        </ul>
					                        <ul class="fix-margin custom-margin-respone"><a class="paytext">$${new Number(val.dataOffer.paySet)}</a></ul>
					                    </div>
					                    <div class="content-info flex-left id-prevlink content-flex">
					                        <ul class="fix-margin "><a class="color-green prelink" target="_blank" href="${val.dataOffer.prevLink}"><i class="fa fa-external-link-square"></i>Preview</a></ul>
					                        <ul class="fix-margin "><a class="upper-case text-block" href="">${val.dataOffer.offerType}</a></ul>
					                    </div>
					                    <div class="content-info flex-left last-info line-1366 click-show-${index} goals-bnt content-flex">
					                        <ul class="fix-margin custom-margin-respone">`;
					elementHtml +=		`<li class="flex-left">KPIs<a class="box-green">!</a><p class="styleCapSetApp">Cap : ${val.dataOffer.capSet}</p></li>
										<ul class="fix-margin-content-goals">
													<a style='display: none; line-height: 1.2em;'>${val.dataOffer.descriptionSet}</a>
												</ul>
					                        </ul>
					                    </div>
					                    <div class="content-info maxwidth-size line-1366 content-flex country-size-block">
					                        <ul class="offerItems-nonePd fix-margin flex-left country-size">
					                            <li class="style-list-of-items">
					                                <a class="upper-case text-block">${val.dataOffer.countrySet}</a>
					                            </li>
					                            <li class="style-list-of-items">`;
			if(val.dataOffer.categorySet===""){
					elementHtml +=		`<a class="">${val.dataOffer.categorySet}</a>`;
			}else{
					elementHtml +=		`<a class="boxcategory">${val.dataOffer.categorySet}</a>`;
			}
					elementHtml +=		`</li>
					                        </ul>
					                    </div>
					                    <div class="content-info center-btn content-flex resize-btn">
					                        <ul class="offerItems-nonePd container-btn" style='display: flex; width:100%;'>`;
			if(!(sortItems.master)){
					elementHtml += 		`<button class="btn-content-request requestapp-${index}">
					                                <i class="fa fa-shopping-cart m-r-xs icon-btn"></i>
					                                <p class="text-btn">Request offer</p>
					                            </button>`
			}else{
					elementHtml +=  	`<button class="cp-${index} btn-cp-mt-ls"><i class="fa fa-copy custom-master-side"/></button><p style="width:100px;">${pathRedirect}</p>`
			}                            
					elementHtml += 	 	   `</ul>
					                    </div>
					                </li>
					            </ul>
					        </div>`;
			sortItems.page.push(elementHtml);
		});
		sortItems.countPage();
	});
};
SortItems.prototype.countPage = function(){
	sortItems.newArrayList = [];
	var x = 0;
	var paginationString = `<ul class="pagination auto-pagination pull-right m-t-lg">
                            <li class="prev-page disabled">
                            	<a class="pagination-items">‹</a>
					        </li>`;
	while (sortItems.page.length>0){
		sortItems.newArrayList.push(sortItems.page.splice(0, 20));
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
	sortItems.deleventShowbtn();
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
	var pageIndex = page;
	if(sortItems.newArrayList<page){
		pageIndex = 0;
	}
	table.append(sortItems.newArrayList[Number(pageIndex)]);
	if(pagination){
		table.append(pagination)
	};
	$(`.pag-${pageIndex}`).parent().addClass('active');
	$(".pagination-number").click((e)=>{
		sortItems.pageIndex = $(e.target).attr("class").split("pag-")[1].split(" ")[0];
		table.empty();
		if(sortItems.pageIndex>=2&&sortItems.pageIndex<sortItems.newArrayList.length-3){
			sortItems.newPagination(sortItems.pageIndex)
			$(`.next-page`).removeClass('active');
			$(`.pag-${sortItems.pageIndex}`).parent().addClass('active');
		}else{
			sortItems.renderPage(sortItems.pageIndex, pagination)
		}
	})
	sortItems.delEventDown();
	sortItems.eventDown();
	sortItems.eventShowbtn();
	// sortItems.pending.forEach((items, index)=>{
	// 	switch (items.adConfirm) {
	// 		case "true":
	// 			$(`.requestapp-${items.offerId}`).children("i").removeClass('fa-shopping-cart').addClass('fa-unlock');
	// 			$(`.requestapp-${items.offerId}`).css("background","#4b7bec");
	// 			$(`.requestapp-${items.offerId}`).children("p").html("Approval");
	// 			$(`.requestapp-${items.offerId}`).unbind("click");
	// 			break;
	// 		case "false":
	// 			$(`.requestapp-${items.offerId}`).children("i").removeClass('fa-shopping-cart').addClass('fa-spinner fa-pulse');
	// 			$(`.requestapp-${items.offerId}`).css("background","#10c469");
	// 			$(`.requestapp-${items.offerId}`).children("p").html("Pending");
	// 			$(`.requestapp-${items.offerId}`).unbind("click");
	// 		default:
	// 			break;
	// 	}
	// });
};
SortItems.prototype.eventShowbtn = function(){
	$(".btn-cp-mt-ls").click(function(event) {
		let linkText = $(event.currentTarget).parent().children("p").text();
		var $tagCp = $("<input/>");
		$("body").append($tagCp);
		$tagCp.val(linkText).select();
		document.execCommand("copy");
		$tagCp.remove();
	});
}
SortItems.prototype.deleventShowbtn = function(){
	$(".btn-content-request").unbind('click');
	$(".btn-cp-mt-ls").unbind('click');
}
SortItems.prototype.reqAPIApp = function(data, event){
	try {
		$.post('/userpost', data, function(data, textStatus, xhr) {
			if(data=="ok"){
			}
		});
	} catch(e) {
		sortItems.reqAPIApp(data, event)
	}
}
SortItems.prototype.eventDown = function(){
	tagDownload.click(function(event) {
		sortItems.delEventDown();
		tagDownload.children().children().removeClass("fa-download").addClass('fa-spinner fa-pulse')
		sortItems.download("OfferList.txt")
	});
};
SortItems.prototype.delEventDown = function(){
	tagDownload.unbind('click');
};
SortItems.prototype.download = function(filename){
	var text = "";
	let affID = this.admin;
    $.each(this.list,function(index, el) {
        text+= `http://${window.location.href.split("//")[1].split("/")[0]}/checkparameter/?offer_id=${el.index}&aff_id=${affID.isID}|${el.countrySet.split("|").join(",")}|${el.platformSet.toUpperCase()}\r\n`;
    });
    var blob = new Blob([text],{type:"octet/stream"});
    var url  = window.URL.createObjectURL(blob);
    $("#download").attr("href",url);
    $("#download").attr("download", filename);
    tagDownload.children().children().removeClass("fa-spinner fa-pulse").addClass('fa-download')
    sortItems.eventDown();
};
sortItems.getAPI(0);
filterBtn.click(function(event) {
	if(platform.val()!=="all"||sortCountry.val()!=="all"||selNetworks.val()!=="all"){
		sortItems.searchMethod = true;
		requestItems.abort();
		sortItems.countStart = 0;
		filterBtn.children().removeClass("fa-search").addClass('fa-spin fa-refresh');
		var OS = "";
		var country = "";
		if(platform.val()!=="all"){
			OS = platform.val();
		}
		if(sortCountry.val()!=="all"){
			country = sortCountry.val();
		}
		function filterRq() {
			var net = `&network=${selNetworks.val()}`;
			if(selNetworks.val()==="all"){
				net = "";
			}
			var path = `/getoffer/live?country=${country}&platform=${OS}&start=${sortItems.countStart}`+net;
			$.get(path, function(res, textStatus, xhr) {
				table.empty();
				sortItems.arrayList = [];
				filterBtn.children().removeClass("fa-spin fa-refresh").addClass('fa-search');
				$.each(res, function(index, val) {
					sortItems.setData(val)
				});
				sortItems.conditionRender = true;
				sortItems.createHtml(sortItems.arrayList);
				if(res.length===500){
					sortItems.countStart += 500;
					filterRq()
				}
			});
		}
		filterRq()
	}
});
search.keydown(function(event) {
	if(search.val()!==""){
		var data = sortItems.arrayList.filter(function(app) {
			return app.dataOffer.nameSet.toLowerCase().indexOf(search.val().toLowerCase())!==-1;
		});
		table.empty();
		sortItems.conditionRender = true;
		sortItems.createHtml(data);
	}else{
		sortItems.createHtml(sortItems.arrayList)
	}
});
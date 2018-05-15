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
var valueInput = "";
function SortItems() {
	this.pending;
	this.list;
	this.arrayList = [];
	this.admin;
	this.page = 0;
	this.searchMethod = false;
	this.countStart = 0;
	this.countEnd = 500;
	this.newArrayList = [];
	this.master;
	this.checkboxGroup = [];
	this.check = [];
}
SortItems.prototype.getAPI = function(){
	var data = {
		start : this.countStart,
		end   : this.countEnd
	}
	requestItems = $.post("/trackinglink", data, function(res) {
		if(res.mes){
			sortItems.setMaster(res.admin.isMaster)
			sortItems.setData(res.offerList, res.admin, res.admin.pending, res.admin.approved)
			if(res.offerList.length===500&&!sortItems.searchMethod){
				sortItems.countStart += 500;
				sortItems.countEnd += 500;
				sortItems.getAPI();
			}
		}else {
			sortItems.setData(res.offerList, res.admin, res.admin.pending, res.admin.approved)
		}
	});
};
SortItems.prototype.setMaster = function(master){
	this.master = master;
};
SortItems.prototype.setData = function(data, user, pending, approved){
	this.pending = pending;
	this.approved = approved;
	if(sortItems.countStart===0){
		this.pending = pending;
		this.approved = approved;
		this.list = data;
		this.admin = user;
		table.empty();
		sortItems.newArrayList = [];
		sortItems.createHtml();		
	}else{
		$.each(data, function(index, val) {
			sortItems.list.push(val)
		});
		table.empty();
		sortItems.createHtml();
	}
};
SortItems.prototype.createHtml = function(){
	var affID = this.admin;
	$.each(this.list, function(index, val) {
		var pathRedirect = `http://${window.location.href.split("//")[1].split("/")[0]}/checkparameter/?offer_id=${val.index}&aff_id=${affID.isID}`;
		var elementHtml =  `<div class="offerItems">
				            <ul class="offerItems-nonePd block-img">
				                <img class="image-logo" src="${val.imgSet}" alt="">
				                <div class="respon-checkbox">
				                    <div class="checkbox checkbox-primary">
				                        <input class="checkbox-group" id="checkbox-${val.index}" type="checkbox" name="offer" value="${val.index}">
				                        <label for="checkbox-${val.index}">
				                        </label>
				                    </div>
				                </div>
				            </ul>
				            <ul class="offerItems-nonePd block-name-platform">
				            <ul class="container-name-platform fix-margin">`;
		switch (val.platformSet) {
			case "android":
				elementHtml += `<li class="style-list-of-items style-plat"><img class="img-opacity" src="./assets/images/android.png" alt=""></li>`;
				break;
			case "ios":
				elementHtml += `<li class="style-list-of-items style-plat"><img class="img-opacity" src="./assets/images/apple.png" alt=""></li>`;
				break;
		}
				elementHtml += `<li class="style-list-of-items style-name-app"><a class="text-nameApp">${val.nameSet}</a></li>
				                </ul>
				                <li class="style-list-of-items flex-items fixline-text">
				                    <div class="content-info flex-left id-prevlink content-flex">
				                        <ul class="fix-margin custom-margin-respone">
				                        	<a class="text-block">#${val.index}</a>
				                        </ul>
				                        <ul class="fix-margin custom-margin-respone"><a class="paytext">$${new Number(val.paySet)}</a></ul>
				                    </div>
				                    <div class="content-info flex-left id-prevlink content-flex">
				                        <ul class="fix-margin "><a class="color-green prelink" target="_blank" href="${val.prevLink}"><i class="fa fa-external-link-square"></i>Preview</a></ul>
				                        <ul class="fix-margin "><a class="upper-case text-block" href="">${val.offerType}</a></ul>
				                    </div>
				                    <div class="content-info flex-left last-info line-1366 click-show-${index} goals-bnt content-flex">
				                        <ul class="fix-margin custom-margin-respone">`;
				elementHtml +=		`<li class="flex-left">KPIs<a class="box-green">!</a><p class="styleCapSetApp">Cap : ${val.capSet}</p></li>
									<ul class="fix-margin-content-goals">
												<a style='display: none; line-height: 1.2em;'>${val.descriptionSet}</a>
											</ul>
				                        </ul>
				                    </div>
				                    <div class="content-info maxwidth-size line-1366 content-flex country-size-block">
				                        <ul class="offerItems-nonePd fix-margin flex-left country-size">
				                            <li class="style-list-of-items">
				                                <a class="upper-case text-block">${val.countrySet}</a>
				                            </li>
				                            <li class="style-list-of-items">`;
		if(val.categorySet===""){
				elementHtml +=		`<a class="">${val.categorySet}</a>`;
		}else{
				elementHtml +=		`<a class="boxcategory">${val.categorySet}</a>`;
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
		sortItems.arrayList.push(elementHtml)
	});
	sortItems.countPage();
};
SortItems.prototype.countPage = function(){
	sortItems.newArrayList = [];
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
	$("#totalPage").html("/"+sortItems.newArrayList.length);
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
                                </li>`;
                                if(Number(page)>2){
		paginationString += `<li class="next-page">
                                <a class="pagination-items pag-${Number(page)-2} pagination-number">${Number(page)-1}</a>
                            </li>`;
                                }
        paginationString += `<li class="next-page">
                                    <a class="pagination-items pag-${Number(page)-1} pagination-number">${page}</a>
                                </li>
                                <li class="next-page">
                                    <a class="pagination-items pag-${page} pagination-number">${1+Number(page)}</a>
                                </li>
                                <li class="next-page">
                                    <a class="pagination-items pag-${1+Number(page)} pagination-number">${2+Number(page)}</a>
                                </li>`;
                                if(Number(page)<sortItems.newArrayList.length-2){
        paginationString += `<li class="next-page">
                                    <a class="pagination-items pag-${2+Number(page)} pagination-number">${3+Number(page)}</a>
                                </li>`;
                               	}
        paginationString += `<li class="next-page">
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
	sortItems.renderPage(sortItems.page, paginationString);
};
SortItems.prototype.renderPage = function(page, pagination){
	var pageIndex = page;
	if(sortItems.newArrayList<page){
		pageIndex = 0;
	}
	$.each(sortItems.newArrayList[pageIndex], function(index, el) {
		table.append(el);
	});
	if(pagination){
		table.append(pagination)
	};
	$(`.pag-${pageIndex}`).parent().addClass('active');
	$(".pagination-number").click((e)=>{
		sortItems.page = $(e.target).attr("class").split("pag-")[1].split(" ")[0];
		table.empty();
		if(sortItems.page>=2&&sortItems.page<sortItems.newArrayList.length-3){
			sortItems.newPagination(sortItems.page)
			$(`.next-page`).removeClass('active');
			$(`.pag-${sortItems.page}`).parent().addClass('active');
		}else{
			sortItems.renderPage(sortItems.page, pagination)
		}
	})
	sortItems.delEventDown();
	sortItems.eventDown();
	sortItems.eventShowbtn();
	sortItems.pending.forEach((items, index)=>{
		switch (items.adConfirm) {
			case "true":
				$(`.requestapp-${items.offerId}`).children("i").removeClass('fa-shopping-cart').addClass('fa-unlock');
				$(`.requestapp-${items.offerId}`).css("background","#4b7bec");
				$(`.requestapp-${items.offerId}`).children("p").html("Approval");
				$(`.requestapp-${items.offerId}`).unbind("click");
				break;
			case "false":
				$(`.requestapp-${items.offerId}`).children("i").removeClass('fa-shopping-cart').addClass('fa-spinner fa-pulse');
				$(`.requestapp-${items.offerId}`).css("background","#10c469");
				$(`.requestapp-${items.offerId}`).children("p").html("Pending");
				$(`.requestapp-${items.offerId}`).unbind("click");
			default:
				break;
		}
	});
};
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
SortItems.prototype.eventShowbtn = function(){
	$(".btn-cp-mt-ls").click(function(event) {
		let linkText = $(event.currentTarget).parent().children("p").text();
		var $tagCp = $("<input/>");
		$("body").append($tagCp);
		$tagCp.val(linkText).select();
		document.execCommand("copy");
		$tagCp.remove();
	});
	$(".btn-content-request").click(function(event) {
		$(`.${event.currentTarget.classList[1]}`).unbind('click');
		$(`.${event.currentTarget.classList[1]}`).children("i").removeClass('fa-shopping-cart').addClass('fa-spinner fa-pulse');
		$(`.${event.currentTarget.classList[1]}`).css("background","#10c469");
		$(`.${event.currentTarget.classList[1]}`).children("p").html("Pending");
		var data = {
			offerId : event.currentTarget.classList[1].split("requestapp-")[1]
		}
		sortItems.reqAPIApp(data, event)
	});
	$(".box-green").click(function(event) {
		var itemsClick = $(`.${$(event.target).parent().parent().parent().attr("class").split("content-info flex-left last-info line-1366 ")[1].split(" ")[0]}`);
		if(itemsClick.attr("class").indexOf("active")!==-1){
			itemsClick.children().children('ul').children().fadeOut("slow");
			itemsClick.removeClass('active')
		}else{
			itemsClick.addClass('active')
			itemsClick.children().children('ul').children().fadeIn("slow");
		}
	});
};
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
sortItems.getAPI();
filterBtn.click(function(event) {
	if(platform.val()!=="all"||sortCountry.val()!=="all"||selNetworks.val()!=="all"){
		sortItems.searchMethod = true;
		requestItems.abort();
		sortItems.countStart = 0;
		sortItems.countEnd = 500;
		filterBtn.children().removeClass("fa-search").addClass('fa-spin fa-refresh');
		var OS = "";
		var country = "";
		var network = "";
		if(platform.val()!=="all"){
			OS = platform.val();
		}
		if(sortCountry.val()!=="all"){
			country = sortCountry.val();
		}
		if(selNetworks.val()!=="all"){
			network = selNetworks.val();
		}
		function filterRq() {
			let data = {
				OS 		: OS,
				country : country,
				netWork : network,
				start: sortItems.countStart,
				end  : sortItems.countEnd
			}
			$.post('/filter', data , function(res, textStatus, xhr) {
				table.empty();
				filterBtn.children().removeClass("fa-spin fa-refresh").addClass('fa-search');
				sortItems.setData(res.offerList, res.admin, res.admin.pending, sortItems.approved)
				if(res.offerList.length===500){
					sortItems.countStart += 500;
					sortItems.countEnd += 500;
					filterRq()
				}
			});
		}
		filterRq()
	}
});
$("#val-sel-page").keydown(function(event) {
	if(event.key==="Enter"||event.keyCode===13){
		$("#sel-page").click();
	}
});
$("#sel-page").click((e)=>{
	if(/^\d+$/.test($("#val-sel-page").val())&&$("#val-sel-page").val()<=sortItems.newArrayList.length&&$("#val-sel-page").val()>0){
		table.empty();
		console.log($("#val-sel-page").val())
		if($("#val-sel-page").val()>=2&&$("#val-sel-page").val()-1<sortItems.newArrayList.length-3){
			sortItems.page = $("#val-sel-page").val()-1;
			sortItems.newPagination(sortItems.page)
			$(`.next-page`).removeClass('active');
			$(`.pag-${sortItems.page}`).parent().addClass('active');
		}else{
			if($("#val-sel-page").val()<sortItems.newArrayList.length/2){
				sortItems.page = $("#val-sel-page").val()-1;
				sortItems.newPagination(3)
				$(`.next-page`).removeClass('active');
				$(`.pag-${sortItems.page}`).parent().addClass('active');
			}else{
				sortItems.page = $("#val-sel-page").val()-1;
				sortItems.newPagination(sortItems.newArrayList.length-3)
				$(`.next-page`).removeClass('active');
				$(`.pag-${sortItems.page}`).parent().addClass('active');
			}
		}
		$("#val-sel-page").css({"border":"1px solid #111", "color":"#111"});
	}else{
		$("#val-sel-page").css({"border":"1px solid red", "color":"red"});
	}
})
search.keypress(function(event) {
	if(event.key==="Enter"||event.keyCode===13){
		btnSearch.click();
	}
});
btnSearch.click(function(event) {
	if(search.val()!=""){
		sortItems.searchMethod = true;
		requestItems.abort();
		sortItems.countStart = 0;
		sortItems.countEnd = 500;
		var data = {
			query: search.val(),
			start: sortItems.countStart,
			end  : sortItems.countEnd
		}
		btnSearch.children().removeClass("fa-search").addClass('fa-spin fa-refresh');
		$.post('/search', data, function(res, textStatus, xhr) {
			table.empty();
			btnSearch.children().removeClass("fa-spin fa-refresh").addClass('fa-search');
			sortItems.setData(res.offerList, res.admin, res.admin.pending, res.admin.approved)
		});
	}
});
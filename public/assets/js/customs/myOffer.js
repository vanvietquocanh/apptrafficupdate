'use strict';
var table = $('#renderMyOffer');
var sortItems = new SortItems;
var paginationUL = $('#pag');
var btnSearch = $("#btn-search");
var search = $('#search');
var filterBtn = $('#filter');
var sortCountry = $('#country');
var platform = $('#os');
var requestItems;
var data = {
		"filterCountry": "",
		"filterPlatform": "",
		"start" : 0,
		"end"   : 500
	}
function SortItems() {
	this.admin;
	this.request;
	this.searchMethod = false;
	this.countStart = 0;
	this.countEnd = 500;
	this.arrayList = [];
	this.page = 0;
	this.newArrayList = [];
}
SortItems.prototype.getAPI = function(data){
	requestItems = $.post("/datamyoffer", data, function(res) {
	btnSearch.children().removeClass("fa-spin fa-refresh").addClass('fa-search');
	filterBtn.children().removeClass("fa-spin fa-refresh").addClass('fa-search');
		if(res.mes){
			sortItems.setData(res.data)
			if(res.data.length===500){
				sortItems.countStart += 500;
				sortItems.countEnd += 500;
				sortItems.getAPI(data);
			}
		}
	});
};
SortItems.prototype.setData = function(data){
	if(sortItems.countStart===0){
		this.request = data;
		this.admin = data.affID;
		table.empty();
		sortItems.render();
	}else{
		$.each(data, function(index, val) {
			sortItems.request.push(val)
		});
		table.empty();
		sortItems.newArrayList = [];		
		sortItems.render();
		sortItems.newPagination(sortItems.page)
	}
};
SortItems.prototype.render = function(){
	var affID = this.admin;
	$.each(this.request, function(index, val) {
	var elementHtml = "";
		var pathRedirect = `http://${window.location.href.split("//")[1].split("/")[0]}/checkparameter/?offer_id=${val.offerId}&aff_id=${val.affId}`;
		elementHtml+=  `<div class="offerItems">
				            <ul class="offerItems-nonePd block-img">
				                <img class="image-logo logo-app" src="${val.app.imgSet}" alt="">
				                <div class="respon-checkbox">
				                    <div class="checkbox checkbox-primary">
				                        <input id="checkbox2" type="checkbox" name="" value="">
				                        <label for="checkbox2">
				                        </label>
				                    </div>
				                </div>
				            </ul>
				            <ul class="offerItems-nonePd block-name-platform">
				                <ul class="container-name-platform fix-margin">`;
		switch (val.app.platformSet) {
			case "android":
				elementHtml += `<li class="style-list-of-items style-plat"><img class="img-opacity" src="./assets/images/android.png" alt=""></li>`;
				break;
			case "ios":
				elementHtml += `<li class="style-list-of-items style-plat"><img class="img-opacity" src="./assets/images/apple.png" alt=""></li>`;
				break;
		}
				elementHtml += `<li class="style-list-of-items style-name-app"><a class="text-nameApp" href="">${val.app.nameSet}</a></li>
				                </ul>
				                <li class="style-list-of-items flex-items fixline-text">
				                    <div class="content-info flex-left id-prevlink content-flex">
				                        <ul class="fix-margin custom-margin-respone">
				                        	<a class="text-block" href="">#${val.app.index}</a>
				                        </ul>
				                        <ul class="fix-margin custom-margin-respone"><a class="paytext" href="">$${new Number(val.app.paySet)}</a></ul>
				                    </div>
				                    <div class="content-info flex-left id-prevlink content-flex">
				                        <ul class="fix-margin "><a class="color-green prelink" href="${val.app.prevLink}"><i class="fa fa-external-link-square"></i>Preview</a></ul>
				                        <ul class="fix-margin "><a class="upper-case text-block" href="">${val.app.offerType}</a></ul>
				                    </div>
				                    <div class="content-info flex-left last-info line-1366 click-show-${index} goals-bnt content-flex kpis-mgbot">
				                        <ul class="fix-margin custom-margin-respone">
											<li class="flex-left reqOfUser" href="">
												<a class="mg-top">KPIs</a>
												<a class="box-green mg-top">!</a>
											</li>
											<ul class="fix-margin-content-goals">
												<a style='display: none; line-height: 1.2em;'>${val.app.descriptionSet}</a>
											</ul>
				                        </ul>
				                    </div>
				                    <div class="content-info maxwidth-size line-1366 content-flex country-size-block">
				                        <ul class="offerItems-nonePd fix-margin flex-left country-size">
				                            <li class="style-list-of-items">
				                                <a class="upper-case text-block" href="#">${val.app.countrySet}</a>
				                            </li>
				                            <li class="style-list-of-items">`;
		if(val.app.categorySet===""){
				elementHtml +=		`<a class="" href="#">${val.app.categorySet}</a>`;
		}else{
				elementHtml +=		`<a class="boxcategory" href="#">${val.app.categorySet}</a>`;
		}
				elementHtml +=		`</li>
				                        </ul>
				                    </div>
				                    <div class="content-info center-btn content-flex resize-btn flex-copy-btn">
				                    	<p class="linkRequest">${pathRedirect}</p>
				                    	<button class="flex-end-items btn-cp fa btn-cp-${index}"></button>
				                    </div>
				                </li>
				            </ul>
				        </div>`;
		sortItems.arrayList.push(elementHtml)
	});
	sortItems.countPage();
};
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
SortItems.prototype.copyLink = function(){
	$(".btn-cp").click(function(event) {
		var eleClick = event.currentTarget.classList[3];
		var $temp = $("<input>");
		$("body").append($temp);
		$temp.val($(`.${eleClick}`).parent().children('p').text()).select();
		document.execCommand("copy");
		$temp.remove();
	});
}
SortItems.prototype.renderPage = function(page, pagination){
	$.each(sortItems.newArrayList[page], function(index, el) {
		table.append(el);
	});
	sortItems.copyLink()
	if(pagination){
		table.append(pagination)
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
sortItems.getAPI(data);
filterBtn.click(function(event) {
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
		country = sortCountry.val().toUpperCase();
	}
	let dataFilter = {
		"filterCountry" : country,
		"filterPlatform": OS,
		"start" : this.countStart,
		"end"   : this.countEnd
	}
	sortItems.getAPI(dataFilter)
});
btnSearch.click(function(event) {
	sortItems.searchMethod = true;
	requestItems.abort();
	sortItems.countStart = 0;
	var data = {
		query: search.val().trim().toLowerCase()
	}
	btnSearch.children().removeClass("fa-search").addClass('fa-spin fa-refresh');
	sortItems.getAPI(data)
});
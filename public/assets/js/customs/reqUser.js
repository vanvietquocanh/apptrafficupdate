'use strict';
var table = $('#renderDataOffer');
var sortItems = new SortItems;
var paginationUL = $('#pag');
var members = $('#members');
var platform = $('#os');
var sortCountry = $('#country');
var btnSearch = $("#btn-search");
var search = $('#search');
var filterBtn = $('#filter');
var requestItems;
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
	requestItems = $.post("/listrequest", data, function(res) {
		btnSearch.children().removeClass("fa-spin fa-refresh").addClass('fa-search');
		filterBtn.children().removeClass("fa-spin fa-refresh").addClass('fa-search');
		if(res.mes){
			sortItems.setData(res.data)
			if(res.data.length===500&&!sortItems.searchMethod){
				sortItems.countStart += 500;
				sortItems.countEnd += 500;
				sortItems.getAPI(data);
			}
		}else {
			console.log(res)
		}
		if(sortItems.countStart===0){
			sortItems.checkMemberReq();
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
			sortItems.list.push(val)
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
				                       	<ul class="fixPay-ele">
											<ul class="fix-margin custom-margin-respone"><a class="paytext paytext-${index}" href="">$${new Number(val.app.paySet)}</a></ul>
					                        <ul class="fix-margin custom-margin-respone">
												<button id="fixPay" class="fa btn-fixPay fix-${index}"></button>
					                        </ul>
				                       	</ul>
				                    </div>
				                    <div class="content-info flex-left id-prevlink content-flex">
				                        <ul class="fix-margin "><a class="color-green prelink" target="_blank" href="${val.app.prevLink}"><i class="fa fa-external-link-square"></i>Preview</a></ul>
				                        <ul class="fix-margin "><a class="upper-case text-block" href="">${val.app.offerType}</a></ul>
				                    </div>
				                    <div class="content-info flex-left last-info line-1366 click-show-${index} goals-bnt content-flex kpis-mgbot">
				                        <ul class="fix-margin custom-margin-respone">
											<li class="flex-left reqOfUser" href="">
												<a class="mg-top">KPIs</a>
												<a class="box-green mg-top">!</a>
												<ul class="flex-left reqOfUser">
													<img class="image-avtUser" src="${val.avatar}" alt="">
													<a class="mg-top" style="padding-left: 1em;">${val.name}</a>
													<a class="mg-top" style="padding-left: 1em;"> ${val.time} </a>
													<a class="mg-top" style="padding-left: 1em;">${val.affId}</a>
												</ul>
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
				                    <div class="content-info center-btn content-flex resize-btn">
				                        <ul class="offerItems-nonePd container-btn">`;
		if(val.adConfirm==="true"){
				elementHtml += 				`<button class="btn-content-request requestapp-${index} deny-request">
				                                <i class="fa fa-lock m-r-xs icon-btn"></i>
				                                <p class="text-btn">&nbsp;&nbsp;&nbsp;&nbsp;Deny&nbsp;&nbsp;&nbsp;&nbsp;</p>
				                            </button>`;
		}else{
				elementHtml += 				`<button class="btn-content-request requestapp-${index} approval-request">
				                                <i class="fa fa-unlock m-r-xs icon-btn"></i>
				                                <p class="text-btn">Approval</p>
				                            </button>`;
		}
				                            
				elementHtml += 		   `</ul>
				                        <ul class="offerItems-nonePd container-btn">
											<button class="btn-content-request requestapp-${index} del-request">
				                                <i class="fa fa-trash-o m-r-xs icon-btn"></i>
				                                <p class="text-btn del-btn-text">Delete</p>
				                            </button>
										</ul>
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
	sortItems.delEvent();
	sortItems.eventShowbtn();
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
		sortItems.delEvent();
		sortItems.eventShowbtn();
	})
};
SortItems.prototype.checkMemberReq = function(){
	var name = [];
	sortItems.request.forEach((app, index)=>{
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
SortItems.prototype.saveDataChange = function(data, btn){
	$.post('/respon', data, function(data, textStatus, xhr) {
		$.each(sortItems.request, function(index, val) {
			if(val.affId === data.affId && val.offerId === data.offerId){
				if(btn){
					sortItems.request[index] = data;
					$($(`.requestapp-${index}`)[0]).children("i").removeClass('fa-spinner fa-pulse fa-unlock').addClass('fa-lock');
					$($(`.requestapp-${index}`)[0]).removeClass('approval-request').addClass('deny-request');
					$($(`.requestapp-${index}`)[0]).css("background","#4b7bec");
					$($(`.requestapp-${index}`)[0]).children("p").html("&nbsp;&nbsp;&nbsp;&nbsp;Deny&nbsp;&nbsp;&nbsp;&nbsp;")
				}else{
					sortItems.request[index] = data;
					$($(`.requestapp-${index}`)[0]).children("i").removeClass('fa-lock fa-spinner fa-pulse').addClass('fa-unlock');
					$($(`.requestapp-${index}`)[0]).removeClass('deny-request').addClass('approval-request');
					$($(`.requestapp-${index}`)[0]).css("background","#5b69bc");
					$($(`.requestapp-${index}`)[0]).children("p").html("Approval")
				}
				sortItems.delEvent();
				sortItems.eventShowbtn();
			}
		});
	});
};
SortItems.prototype.saveDelete = function(data, btn){
	$.post('/delrequest', data, function(data, textStatus, xhr) {
		if(data!=="error"){
			btn.parent().parent().parent().parent().parent().remove();
		}
	});
};
SortItems.prototype.updatePaySet = function(data){
	$.post('/updatepay', data, function(data, textStatus, xhr) {
		$.each(sortItems.request, function(index, val) {
			if(val.affId === data.affId && val.offerId === data.offerId){
				sortItems.request[index] = data;
				$(`.paytext-${index}`).text(`$${data.app.paySet}`)
			}
		})
	});
};
SortItems.prototype.delEvent = function(){
	$(".approval-request").unbind('click');
	$(".del-request").unbind('click');
	$(".box-green").unbind('click');
	$(".deny-request").unbind('click');
	$(".btn-fixPay").unbind('click');
};
SortItems.prototype.eventShowbtn = function(){
	$(".btn-fixPay").click(function(event) {
		var btnrequest = $($(`.${event.currentTarget.classList[2]}`)[0]);
		var pay = btnrequest.parent().parent().children().first().text();
		var indexApp = btnrequest.attr("class").split("fix-")[1];
		var paySet = prompt("Please enter the price",pay).split("$")[1];
		if(paySet !== pay&&paySet!=null){
			sortItems.request[indexApp].app.paySet = paySet;
			sortItems.updatePaySet(sortItems.request[indexApp])
		}
	});
	$(".approval-request").click(function(event) {
		var btnrequest = $($(`.${event.currentTarget.classList[1]}`)[0]);
		$(`.${event.currentTarget.classList[1]}`).unbind('click');
		btnrequest.children("i").removeClass('fa-shopping-cart').addClass('fa-spinner fa-pulse');
		btnrequest.css("background","#10c469");
		btnrequest.children("p").html("Pending");
		var numberInArray = event.currentTarget.classList[1].split("requestapp-")[1];
		sortItems.request[numberInArray].adConfirm = true;
		sortItems.saveDataChange(sortItems.request[numberInArray], sortItems.request[numberInArray].adConfirm)
	});
	$(".del-request").click(function(event) {
		var btnrequest = $($(`.${event.currentTarget.classList[1]}`)[1]);
		var sesison = confirm("You sure want delete request?");
		var numberInArray = event.currentTarget.classList[1].split("requestapp-")[1];
		if(sesison){	
			$(`.${event.currentTarget.classList[1]}`).unbind('click');
			btnrequest.children("i").removeClass('fa-shopping-cart').addClass('fa-spinner fa-pulse');
			btnrequest.css("background","#10c469");
			btnrequest.children("p").html("Pending");
			sortItems.saveDelete(sortItems.request[numberInArray], btnrequest)
		}
	});
	$(".deny-request").click(function(event) {
		var btnrequest = $($(`.${event.currentTarget.classList[1]}`)[0]);
		$(`.${event.currentTarget.classList[1]}`).unbind('click');
		btnrequest.children("i").removeClass('fa-lock').addClass('fa-spinner fa-pulse');
		btnrequest.css("background","#10c469");
		btnrequest.children("p").html("Pending");
		var numberInArray = event.currentTarget.classList[1].split("requestapp-")[1];
		sortItems.request[numberInArray].adConfirm = false;
		sortItems.saveDataChange(sortItems.request[numberInArray], sortItems.request[numberInArray].adConfirm)
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
var data = {
	"filterCountry"	: "",
	"filterPlatform": "",
	"filterName"	: "",
	"start"			: sortItems.countStart,
	"end"			: sortItems.countEnd
}
sortItems.getAPI(data);
filterBtn.click(function(event) {
	sortItems.searchMethod = true;
	requestItems.abort();
	sortItems.countStart = 0;
	filterBtn.children().removeClass("fa-search").addClass('fa-spin fa-refresh');
	var OS = "";
	var country = "";
	var name = "";
	if(platform.val()!=="all"){
		OS = platform.val();
	}
	if(members.val()!=="all"){
		name = members.val();
	}
	if(sortCountry.val()!=="all"){
		country = sortCountry.val().toUpperCase();
	}
	let dataFilter = {
		"filterCountry" : country,
		"filterPlatform": OS,
		"filterName" 	: name,
		"start"			: sortItems.countStart,
		"end"			: sortItems.countEnd
	}
	sortItems.getAPI(dataFilter)
});
btnSearch.click(function(event) {
	if(search.val()!==""){
		sortItems.searchMethod = true;
		requestItems.abort();
		sortItems.countStart = 0;
		var data = {
			query: search.val().trim().toLowerCase(),
			"start"			: sortItems.countStart,
			"end"			: sortItems.countEnd
		}
		btnSearch.children().removeClass("fa-search").addClass('fa-spin fa-refresh');
		sortItems.getAPI(data)
	}
});
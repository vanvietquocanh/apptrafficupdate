"use strict";
var table = $('#renderDataOffer');
var sortCountry = $("#country");
var search = $('#search');
var btnSearch = $("#btn-search");
var filterBtn = $("#filter");
var addBtn = $('.addOffer-btn');
var platform = $('#os');
var addoffer = new AddOffer();
var fromAddOffer = $(".custNet");
function AddOffer() {
	this.data = [];
	this.arrayList = [];
	this.page = 0;
	this.countStart = 0;
	this.newArrayList = [];
	this.checkboxGroup = [];
	this.requestItems;
	this.indexEdit = -1;
}
AddOffer.prototype.getData = function(path, data) {
	this.requestItems = $.post(path, data, function(response, textStatus, xhr) {
		filterBtn.children().removeClass("fa-spin fa-refresh").addClass('fa-search');
		btnSearch.children().removeClass("fa-spin fa-refresh").addClass('fa-search');
		if(response){
			addoffer.setData(response);
			if(response.length === 500){
				addoffer.countStart += 500;
				addoffer.getData(path, data)
			}
		}
	});
};
AddOffer.prototype.setData = function(arrData) {
	this.data = arrData;
	table.empty();
	addoffer.newArrayList=[];
	addoffer.createHtml();		
};
AddOffer.prototype.createHtml = function() {
	if(this.data !== undefined){
		$.each(this.data, function(index, el) {
			var elementHtml =  `<div class="offerItems">
						             <ul class="offerItems-nonePd block-img">
						                 <img class="image-logo" src="${el.imgSet}" alt="">
						                 <div class="respon-checkbox">
						                     <div class="checkbox checkbox-primary">
						                         <input class="checkbox-group" id="checkbox-${index}" type="checkbox" name="offer" value="${index}">
						                         <label for="checkbox-${index}">
						                         </label>
						                     </div>
						                 </div>
						             </ul>
						             <ul class="offerItems-nonePd block-name-platform">
						             <ul class="container-name-platform fix-margin">`;
				switch (el.platformSet) {
					case "android":
						elementHtml += `<li class="style-list-of-items style-plat"><img class="img-opacity" src="./assets/images/android.png" alt=""></li>`;
						break;
					case "ios":
						elementHtml += `<li class="style-list-of-items style-plat"><img class="img-opacity" src="./assets/images/apple.png" alt=""></li>`;
						break;
				}
					    elementHtml+=`<li class="style-list-of-items style-name"><a class="text-nameApp">${el.nameSet}</a></li>
						             </ul>
						             <li class="style-list-of-items flex-items fixline-text">
						                 <div class="content-info flex-left id-prevlink content-flex">
						                     <ul class="fix-margin custom-margin-respone">
						                         <a class="text-block" >#${index}</a>
						                     </ul>
						                     <ul class="fix-margin custom-margin-respone"><a class="paytext">$${new Number(el.paySet)}</a></ul>
						                 </div>
						                 <div class="content-info flex-left id-prevlink content-flex">
						                     <ul class="fix-margin "><a class="color-green prelink" target="_blank" href="${el.prevLink}"><i class="fa fa-external-link-square"></i>Preview</a></ul>
						                     <ul class="fix-margin "><a class="upper-case text-block">${el.offerType}</a></ul>
						                 </div>
						                 <div class="content-info flex-left last-info line-1366 click-show-${index} goals-bnt content-flex">
						                     <ul class="fix-margin custom-margin-respone">
						                         <li class="flex-left">KPIs<a class="box-green">!</a></li>
						                         <ul class="fix-margin-content-goals">
						                             <a style='display: none; line-height: 1.2em;'>${el.descriptionSet}</a>
						                         </ul>
						                     </ul>
						                 </div>
						                 <div class="content-info maxwidth-size line-1366 content-flex country-size-block">
						                     <ul class="offerItems-nonePd fix-margin flex-left country-size">
						                         <li class="style-list-of-items">
						                             <a class="upper-case text-block">${el.countrySet}</a>
						                         </li>
						                         <li class="style-list-of-items">`;
					if(el.categorySet===""){
							elementHtml +=		`<a class="">${el.categorySet}</a>`;
					}else{
							elementHtml +=		`<a class="boxcategory">${el.categorySet}</a>`;
					}
							elementHtml +=		`</li>
							                     </ul>
								                 </div>
								                 <div class="content-info center-btn content-flex resize-btn">
								                     <ul class="offerItems-nonePd container-btn" style="display: flex;">
								                         <button class="btn-content-request btn-edit-offer approval-request edit-${index}">
								                             <i class="fa fa-pencil m-r-xs icon-btn"></i>
								                             <p class="text-btn approval-btn-text">Edit&nbsp;&nbsp;&nbsp;&nbsp;</p>
								                         </button>
								                         <button class="btn-content-request btn-del-offer del-request delete-${index}">
								                             <i class="fa fa-trash-o m-r-xs icon-btn"></i>
								                             <p class="text-btn del-btn-text">Delete</p>
								                         </button>
								                     </ul>
								                     </div>
								                 </li>
								             </ul>
								         </div>`;
			addoffer.arrayList.push(elementHtml)
		});
	}else{
		this.data = [];
	}
	addoffer.countPage();
};
AddOffer.prototype.countPage = function() {
	addoffer.newArrayList = [];
	var x = 0;
	var paginationString = `<ul class="pagination auto-pagination pull-right m-t-lg">
                            <li class="prev-page disabled">
                            	<a class="pagination-items">‹</a>
					        </li>`;
	while (addoffer.arrayList.length>0){
		addoffer.newArrayList.push(addoffer.arrayList.splice(0, 20));
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
                                <a class="pagination-items pag-${addoffer.newArrayList.length-1} pagination-number">${addoffer.newArrayList.length}</a>
                            </li>
                            <li class="next-page">
                                <a class="pagination-items">›</a>
                            </li>
                        </ul>`;
	addoffer.renderPage(addoffer.page, paginationString);
};
AddOffer.prototype.newPagination = function(page){
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
                                    <a class="pagination-items pag-${addoffer.newArrayList.length-1} pagination-number">${addoffer.newArrayList.length}</a>
                                </li>
                                <li class="next-page">
                                    <a class="pagination-items">›</a>
                                </li>
                            </ul>`;
	addoffer.renderPage(page, paginationString);
};
AddOffer.prototype.renderPage = function(page, pagination){
	if(addoffer.newArrayList.length>0){
		$.each(addoffer.newArrayList[page], function(index, el) {
			table.append(el);
		});
		addoffer.delEvent();
		addoffer.eventEdit();
		if(pagination){
			table.append(pagination)
		};
		$(`.pag-${page}`).parent().addClass('active');
		$(".pagination-number").click((e)=>{
			addoffer.page = $(e.target).attr("class").split("pag-")[1].split(" ")[0];
			table.empty();
			if(addoffer.page>=2&&addoffer.page<addoffer.newArrayList.length-3){
				addoffer.newPagination(addoffer.page)
				$(`.next-page`).removeClass('active');
				$(`.pag-${addoffer.page}`).parent().addClass('active');
			}else{
				addoffer.renderPage(addoffer.page, pagination)
			}
		})
	}
};
AddOffer.prototype.customOfferReturn = function(custom){
	$("#OfferID").val(custom.offeridSet);
	$("#Platform").val(custom.platformSet);
	$("#Thumbnail").val(custom.imgSet);
	$("#Name").val(custom.nameSet);
	$("#Url").val(custom.urlSet);
	$("#Payout").val(custom.paySet);
	$("#Cap").val(custom.capSet);
	$("#Country").val(custom.countrySet);
	$("#Category").val(custom.categorySet);
	$("#OfferType").val(custom.offerType);
	$("#PrevLink").val(custom.prevLink);
	$("#description").val(custom.descriptionSet);
	$("#netName").val(custom.nameNetworkSet);
};
AddOffer.prototype.delEvent = function(){
	$(".btn-edit-offer").unbind('click');
	$(".btn-del-offer").unbind('click');
};
AddOffer.prototype.eventEdit = function(){
	$(".btn-edit-offer").click(function(event) {
		var indexEleClick = $(event.delegateTarget).attr("class").split("edit-")[2];
		addoffer.indexEdit = indexEleClick;
		addoffer.customOfferReturn(addoffer.data[indexEleClick])
		fromAddOffer.fadeIn('slow');
	});
	$(".btn-del-offer").click(function(event) {
		var indexEleClick = $(event.delegateTarget).attr("class").split("delete-")[1];
		addoffer.data.splice(indexEleClick, 1);
		var dataSend = {
			data : addoffer.data,
			method : "delete",
			index : indexEleClick
		}
		addoffer.updateReq(dataSend);
	});
};
AddOffer.prototype.updateReq = function(dataSend) {
	$.post("/addoffer", dataSend, (data, text, xhr)=>{
		if(data){
			$(".custNet").fadeOut('slow');
			addoffer.setData(data.data)
			$("#Confirm").html("Confirm");
		}else{
			alert("Error connect Internet please retry!!")
		}
	})
};
var dataRequest = {
	"start" : addoffer.countStart,
	"search": null,
	"filter": {
		"platform" : "",
		"country"  : ""
	}
}
var pathRequest = "/admincutomsoffer";
addoffer.getData(pathRequest, dataRequest);
filterBtn.click(function(event) {
	addoffer.searchMethod = true;
	addoffer.requestItems.abort();
	addoffer.countStart = 0;
	filterBtn.children().removeClass("fa-search").addClass('fa-spin fa-refresh');
	var OS = "";
	var country = "";
	if(platform.val()!=="all"){
		OS = platform.val();
	}
	if(sortCountry.val()!=="all"){
		country = sortCountry.val();
	}
	var data = {
		search   : "",
		"filter": {
			"platform" : OS,
			"country"  : country
		},
		start: addoffer.countStart
	}
	function filterRq(data) {
		addoffer.getData(pathRequest, data)
	}
	filterRq(data)
});
$("#Cancle").click((e)=>{
	$(".custNet").fadeOut('slow');
})
$("#Confirm").click((e)=>{
	var confirmAddCustom = confirm("You definitely want to add?");
	if($("#netName").val()&&$("#OfferID").val()&&$("#Platform").val()&&$("#Thumbnail").val()&&$("#Name").val()&&$("#Url").val()&&$("#Payout").val()&&$("#Cap").val()&&$("#Country").val()){
		if(confirmAddCustom){
			var dataSetToNetwork = {
				isOfferCustom  : true,
				offeridSet     : $("#OfferID").val(),
				platformSet    : $("#Platform").val(),
				imgSet     	   : $("#Thumbnail").val(),
				nameSet   	   : $("#Name").val(),
				urlSet    	   : $("#Url").val(),
				paySet    	   : $("#Payout").val(),
				capSet         : $("#Cap").val(),
				countrySet     : $("#Country").val(),
				categorySet    : $("#Category").val(),
				offerType      : $("#OfferType").val(),
				prevLink       : $("#PrevLink").val(),
				descriptionSet : $("#description").val(),
				nameNetworkSet : $("#netName").val()
			}
			var edit = "add";
			if(addoffer.indexEdit===-1){
				addoffer.data.push(dataSetToNetwork);
			}else{
				var index = addoffer.data[addoffer.indexEdit].index;
				addoffer.data[addoffer.indexEdit] = dataSetToNetwork;
				dataSetToNetwork.index = index;
				edit = "edit";
			}
			var dataSend = {
				data : addoffer.data[addoffer.data.length-1],
				method : edit,
				index : addoffer.indexEdit
			}
			$("#Confirm").html("<i class='fa fa-spinner fa-pulse'></i>");
			addoffer.updateReq(dataSend)
		}
	}else{
		alert("Please complete all information?")
	}
})
addBtn.click(function(event) {
	$("#OfferID").val("");
	$("#Platform").val("");
	$("#Thumbnail").val("");
	$("#Name").val("");
	$("#Url").val("");
	$("#Payout").val("");
	$("#Cap").val("");
	$("#Country").val("");
	$("#Category").val("");
	$("#OfferType").val("");
	$("#PrevLink").val("");
	$("#description").val("");
	$("#netName").val("");
	addoffer.indexEleClick = -1;
	fromAddOffer.fadeIn('slow');
});
search.keypress(function(event) {
	if(event.key==="Enter"||event.keyCode===13){
		btnSearch.click();
	}
});
btnSearch.click(function(event) {
	addoffer.searchMethod = true;
	requestItems.abort();
	addoffer.countStart = 0;
	var data = {
		search: search.val(),
		start: addoffer.countStart,
		filter : {
			OS 		: "",
			country : ""
		}
	}
	btnSearch.children().removeClass("fa-search").addClass('fa-spin fa-refresh');
	function filterRq(data) {
		addoffer.getData(pathRequest, data)
	}
	filterRq(data)
});

var table = $("#renderDataOffer");
var paginationUL = $('#pag');
var getIcon = $('#getbtn');
var btnSearch = $('#btn-search');
var search = $('#find');
var paginationULError = $('#pag2');
var icon = new IconHandle();
var requestPost;
function IconHandle(){
	this.start = 0;
	this.data = [];
	this.arrayList = [];
	this.newArrayList = [];
	this.page = 0;
};
IconHandle.prototype.get = (path, data)=>{
	requestPost = $.post(path, data, function(data, textStatus, xhr) {
		if(data){
			if(data.length===500){
				icon.setData(data);
				icon.start+=500;
				icon.get(path,{start: icon.start});
			}else if(data.length<500){
				icon.setData(data);
				requestPost.abort();
			}
			icon.returnDefault();
			icon.renderFirst();
			icon.countPage();
		}
	});
}
IconHandle.prototype.setData = function(data){
	data.forEach( function(element, index) {
		icon.data.push(element);
	});
	if(icon.start===0){
		icon.renderFirst();
		icon.countPage();
	}
};
IconHandle.prototype.renderFirst = function(){
	icon.data.forEach( function(element, index) {
		var elementHtml =  `<tr role="row" class="odd fixcenter sel-items" style="color: #111">
								<td class="sorting_1" tabindex="0" style="color: #111"><img src="${element.image}" style='border-radius:15em; width:30px; height:30px'/></td>
								<td class="sorting_1" tabindex="0" style="color: #111">${element.id}</td>
								<td class="sorting_1" tabindex="0" style="color: #111 text-wrap:">${element.image}</td>
								<td class="sorting_1" tabindex="0" style="color: #111">${element.platform}</td>
							</tr>`;
		icon.arrayList.push(elementHtml);
	});
};
IconHandle.prototype.countPage = function(){
	var x = 0;
	var paginationString = `<ul class="pagination auto-pagination pull-right m-t-lg">
                                <li class="prev-page disabled">
                                	<a class="pagination-items">‹</a>
						        </li>`;
	while (icon.arrayList.length>0){
		icon.newArrayList.push(icon.arrayList.splice(0, 50));
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
                                    <a class="pagination-items pag-${icon.newArrayList.length-1} pagination-number">${icon.newArrayList.length}</a>
                                </li>
                                <li class="next-page">
                                    <a class="pagination-items">›</a>
                                </li>
                            </ul>`;
	icon.renderPage(icon.page, paginationString);
};
IconHandle.prototype.newPagination = function(page){
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
                                    <a class="pagination-items pag-${icon.newArrayList.length-1} pagination-number">${icon.newArrayList.length}</a>
                                </li>
                                <li class="next-page">
                                    <a class="pagination-items">›</a>
                                </li>
                            </ul>`;
	icon.renderPage(page, paginationString);
};
IconHandle.prototype.renderPage = function(page, pagination){
	$.each(icon.newArrayList[page], function(index, el) {
		table.append(el);
	});
	if(pagination){
		paginationUL.empty();
		paginationUL.append(pagination);
	};
	$(`.pag-${page}`).parent().addClass('active');
	$(".pagination-number").click((e)=>{
		icon.page = $(e.target).attr("class").split("pag-")[1].split(" ")[0];
		table.empty();
		if(icon.page>2&&icon.page<icon.newArrayList.length-3){
			icon.newPagination(icon.page)
			$(`.next-page`).removeClass('active');
			$(`.pag-${icon.page}`).parent().addClass('active');
		}else{
			icon.renderPage(icon.page, pagination)
		}
	})
};
IconHandle.prototype.returnDefault = function() {
	icon.start = 0;
	icon.arrayList = [];
	icon.newArrayList = [];
	icon.page = 0;
	table.empty();
};
function getIconApp(){
	getIcon.click(function(event) {
		getIcon.unbind('click');
		var platform = "", network = "", country = "";
		if($("#country").val()!=="all"){
			country = $("#country").val(); 
		}
		if($("#os").val()!=="all"){
			platform = $("#os").val(); 
		}
		if($('#sel-Networks').val()!=="all"){
			network = $('#sel-Networks').val();
		}
		getIcon.children('i').removeClass('fa-download').addClass('fa-spinner fa-pulse');
		icon.post("/requesticonhandle",{country : country.trim(), platform : platform.trim(), network : network.trim()});
	});
}
IconHandle.prototype.post = function(path, data) {
	$.post(path, data, function(data, textStatus, xhr) {
		alert(data);
		getIcon.children('i').removeClass('fa-spinner fa-pulse').addClass('fa-download');
		getIcon();
	});
};
search.click(function(event) {
	icon.start = 0;
	var platform = "", bundleID = "";
	if($("#platform-search").val()!=="all"){
		platform = $("#platform-search").val(); 
	}
	if($('#bunndle-seach').val()!=="all"){
		bundleId = $('#bunndle-seach').val();
	}
	icon.data = [];
	icon.returnDefault();
	icon.get("/geticonhandle",{start: icon.start, search : bundleId.trim(), platform : platform.trim()});
});
icon.get("/geticonhandle",{start: icon.start});
getIconApp();
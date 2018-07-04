var index = 0;
var lengthStringLink;
var countPost = 0;
var regexLive = /market|itunes|play.google.com/;
var numberActive;
var countClick = 0;
var x = 0;
var arrCountry = ["ar", "sa", "sg", "id", "in", "hk", "tw", "my", "ph", "kr", "eg", "tr", "es", "ru", "jp", "vn", "br", "de", "cn", "th", "fr","ae","uk","us"];
function domain(url) {
    var result
    var match
    if (match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im)) {
        result = match[1]
        if (match = result.match(/^[^\.]+\.(.+\..+)$/)) {
            result = match[1]
        }
    }
    return result
}
function cutLink(link) {
	var listTracking = [];
	link.split("\n").forEach( function(element, index) {
		if(element.split("|")[1]!==undefined){
			element.split("|")[1].split(",").forEach((ele, i)=>{
				if(arrCountry.indexOf(ele.toLowerCase())!==-1){
					var data = {
						url 	  : element.split("|")[0],
						platform  : element.split("|")[2],
						country   : arrCountry[arrCountry.indexOf(ele.toLowerCase())]
					}
					listTracking.push(data);
				}
			})
		}
	});
	return listTracking;
}
function result(json, ring){
	if(index!==0&&index<lengthStringLink){
		jsonResponse(cutLink($("#link").val())[index], ring);
		index++;
	}else{
		ready();
		$("#btn-test").html("GO")
	}
	x++;
	var data = JSON.parse(json);
	var html = `<tr class="show-more ${x}">`;
	if(regexLive.test(data.message)){
		if(ring==="ring"){
			document.getElementById("liveOffer").volume = 0.5;
			document.getElementById("liveOffer").play();
		}
		html +=  `<td class="bg-success text-light"><img class="size-icon-app-live" src="${data.icon}"></td>`
	    html +=    `<td class="bg-success text-light">${domain(data.message)}</td>
	    			<td class="bg-success text-light">${data.message}</td>`;
	}else{
		html += `<td class="bg-danger text-light"></td>
				 <td class="bg-danger text-light">${domain(data.message)}</td>
				 <td class="bg-danger text-light">${data.message}</td>`
	}
    html +=  `</tr>`;
	if(data.ArrayUrl){
		data.ArrayUrl.forEach((ele,i)=>{
			html += `<tr class="table-hidden-more ${x}">
						<td class="bg-light text-light"></td>
						<td class="text-value-intable">${domain(ele)}</td>
						<td class="text-value-intable">${ele}</td>
					</tr>`
		})
	}
	$("#body").prepend(html)
	delEvent();
	addEvent();
}
function addEvent(){
	$(".show-more").click(function(event) {
		var numberClick = $(event.currentTarget).attr("class").split(" ")[1];
		if($(`.table-hidden-more.${numberClick}`).css("display")==="none"){
			$(`.table-hidden-more.${numberClick}`).css("display","table-row")
		}else{
			$(`.table-hidden-more.${numberClick}`).css("display","none")		
		}
	});
}
function delEvent(){
	$(".show-more").unbind('click')
}
function jsonResponse(userpost,ring){
	var data = {
		url: '/offerTest',
		type: 'POST',
		dataType: 'applicattion/json',
		data: userpost,
		timeout : 1000*60*15
	};
	$.ajax(data)
	.always(function(data) {
		result(data.responseText, ring);
	});
}
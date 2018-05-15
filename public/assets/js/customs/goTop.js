"use strict";
var btnLeftRight = $("#btn-left-right");
var wrapper = $("#wrapper");
btnLeftRight.click(function(event) {
	if(wrapper.attr('class').indexOf("enlarged")!==-1){
		btnLeftRight.children().addClass('fa-angle-double-right').removeClass('fa-angle-double-left')
	}else{
		btnLeftRight.children().addClass('fa-angle-double-left').removeClass('fa-angle-double-right')
	}
});
var button = "<div id='GoTop' class='gotop fa'></div>";
var bodyPage = $('body');
bodyPage.append(button);
window.onscroll = function() {
	scrollFunction();
	sortItems.scroll();
};
function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("GoTop").style.display = "block";
    } else {
        document.getElementById("GoTop").style.display = "none";
    }
}
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
$("#GoTop").click(function(event) {
	topFunction();
});
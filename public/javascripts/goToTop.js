jQuery(document).ready(function($) {
	var button = "<div id='GoTop' class='gotop fa'></div>";
	var bodyPage = $('body');
	bodyPage.append(button);
	window.onscroll = function() {scrollFunction()};
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
});
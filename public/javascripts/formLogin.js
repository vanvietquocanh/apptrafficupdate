jQuery(document).ready(function($) {
	var btnExit = $(".icon-exit");
	var fromLogin = $(".fromLogin");
	var btnShowLogin = $("#bt-show-log");
	var autoSelect = $("#autoSelect");
	btnExit.click(function(event) {
		fromLogin.fadeOut("slow");
	});
	btnShowLogin.click(function(event) {
		fromLogin.fadeIn("slow");
	});
	$("body").keydown(function(event) {
		if(event.key === "Escape" || event.keyCode === 27){
			fromLogin.fadeOut("slow");
		};
	});
});
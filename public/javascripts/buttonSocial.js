jQuery(document).ready(function($) {
	var btnNative = $("#native");
	var btnPerformance = $("#performance");
	var btnSocialsearrch = $("#socialsearrch");
	var btnMediabuying = $("#mediabuying");
	var infomation = $(".soc-introduce");
	function scrollInfomation(number) {
		console.log(infomation,number)
		infomation.css("left",number)
	}
	btnNative.click(function(event) {
		scrollInfomation("0%");
		btnNative.css('background-position-y',"bottom");
		btnPerformance.css('background-position-y',"top");
		btnSocialsearrch.css('background-position-y',"top");
		btnMediabuying.css('background-position-y',"top");
	});
	btnPerformance.click(function(event) {
		scrollInfomation("-100%");
		btnPerformance.css('background-position-y',"bottom");
		btnNative.css('background-position-y',"top");
		btnSocialsearrch.css('background-position-y',"top");
		btnMediabuying.css('background-position-y',"top");
	});
	btnSocialsearrch.click(function(event) {
		scrollInfomation("-200%");
		btnSocialsearrch.css('background-position-y',"bottom");
		btnNative.css('background-position-y',"top");
		btnPerformance.css('background-position-y',"top");
		btnMediabuying.css('background-position-y',"top");
	});
	btnMediabuying.click(function(event) {
		scrollInfomation("-300%");
		btnMediabuying.css('background-position-y',"bottom");
		btnNative.css('background-position-y',"top");
		btnPerformance.css('background-position-y',"top");
		btnSocialsearrch.css('background-position-y',"top");
	});
	btnNative.css('background-position-y',"bottom");
});
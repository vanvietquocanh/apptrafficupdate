// jQuery(document).ready(function($) {
// 	var interval;
// 	function ShowLogo(widthBrowser) {
// 		if(!widthBrowser){
// 			widthBrowser = $(window).width();
// 		}
// 		if(widthBrowser)
// 		var slideLogo = $(".slider-logo");
// 		var sliderLogoShow = $(".slider-logo-show");
// 		slideLogo.css("width",`${widthBrowser*10}px`)
// 		for (var i = 0; i < sliderLogoShow.length; i++) {
// 			$(sliderLogoShow[i]).css("width",`${widthBrowser}px`)
// 		}
// 		interval = setInterval(()=>{
// 					widthBrowser-=$(window).width();
// 					slideLogo.css("transition",`.5s`);
// 					slideLogo.css("left",`${widthBrowser}px`);
// 					if(-($(window).width()*9)===widthBrowser){
// 						widthBrowser=$(window).width();
// 						slideLogo.css("transition",`0`);
// 					}
// 				}, 1000);
// 	}
// 	//this is function check width if browser change
// 	$(window).resize((e)=>{
// 		clearInterval(interval);
// 		ShowLogo(e.target.innerWidth)
// 	})
// 	ShowLogo(null)
// });
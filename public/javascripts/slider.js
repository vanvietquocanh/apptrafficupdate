jQuery(document).ready(function($) {
	var html = "";
	function getImage(link){
		html +=`<img src="${link}" style="display: none;"/>`
	}
	var imagesArray = [
			{
			   "slide": "../images/slide/pexels1.jpg",
			},
			{
			   "slide": "../images/slide/pexels2.jpg",
			},
			{
			   "slide": "../images/slide/pexels3.jpg",
			},
			{
			   "slide": "../images/slide/pexels4.jpg",
			},
			{
			   "slide": "../images/slide/pexels5.jpeg",
			},
			{
			   "slide": "../images/slide/pexels6.jpg",
			}
		];
	imagesArray.forEach( function(element, index) {
		getImage(element.slide)
		$("body").append(html);
	});
	var i = 0;
	var eleShowSlider = $('#slideShow');
	var elePicker = $('#picker');
	var setWidth = `${100/imagesArray.length}%`;
	function prev() {
		i++;
		if(i>imagesArray.length-1){
			i-=imagesArray.length;
		}
		clearColorRunTime();
		runTime(i);
		IMGShow(i);
	}
	function next() {
		i--;
		if(i<0){
			i+=imagesArray.length;
		}
		clearColorRunTime();
		runTime(i);
		IMGShow(i);
	}
	function IMGShow(index) {
		eleShowSlider.css("background",`url(${imagesArray[index].slide})`)
		eleShowSlider.css("background-repeat",`no-repeat`)
		eleShowSlider.css("background-position-y",`center`)
		eleShowSlider.css("background-position-x",`center`)
		eleShowSlider.css("background-size",`cover`)
		eleShowSlider.css("transtion",`.5s`)
	}
	function addPicker() {
		for(let i = 0; i < imagesArray.length; i++){
		var elsShowTime = `<ul class='Slider-content-picker-items' id="${i}"><li class='showtime'></li></ul>`;
			elePicker.append(elsShowTime);
			$('.Slider-content-picker-items').css('width', setWidth);
		}
	};
	function clearColorRunTime() {
		$('.active').removeClass('active');
	}
	function runTime(index) {
		$($('.showtime')[index]).addClass('active');
	}
	addPicker();
	$('.Slider-content-picker-items').on("click",(event)=> {
		i = event.target.id;
		clearColorRunTime();
		IMGShow(i);
		runTime(i);
	});
	$('#prev').click(()=>{
		prev();
	});
	$('#next').click(()=>{
		next();
	});
	IMGShow(i);
	runTime(i);
	setTimeout(()=>{
		clearColorRunTime();
	},100);
	setInterval(()=>{
		prev();
	},6000)
});
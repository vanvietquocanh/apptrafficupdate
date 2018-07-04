function ready() {
	$("#btn-test").click(function(event) {
		$("#btn-test").unbind('click')
		$("#body").empty();
		$("#btn-test").html("<i class='fa fa-spinner fa-pulse'></i>")
		var data;
		lengthStringLink = $("#link").val().split("\n").length;
		if(lengthStringLink>1){
			for (var i = 0; i < 5; i++) {
				data = cutLink($("#link").val())[index];
				index++;
				jsonResponse(data,"ring");					
			}
		}else{
			data = {
				url       : $("#link").val(),
				platform  : $("#os").val(),
				country   : $("#country").val()
			}
			jsonResponse(data, null);
		}
	})
}
ready()
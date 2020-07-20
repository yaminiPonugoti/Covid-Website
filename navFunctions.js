//Website navigation scripts

function loadNextPage(key){
	switch(key){
		case "survey1":
			document.getElementById("body").innerHTML = '\
				<div class="center" style="text-align: center;">\
					<button type = "button" onclick="loadNextPage(\'survey2\')">\
						Next\
					</button>\
				</div>\
			';
			break;
		case "survey2":
			window.open();
			break;
		case "adminLogin":
			window.open();
			break;
	}
}
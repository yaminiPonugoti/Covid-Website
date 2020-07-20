//Website navigation scripts

function loadNextPage(key){
	switch(key){
		case "survey1":
			document.getElementById("body").innerHTML = '\
				<div class="center" style="text-align: center;">\
					<button type = "button" >\
						Submit\
					</button>\
				</div>\
			';
		case "survey2":
			window.open();
		case "adminLogin":
			window.open();
	}
}
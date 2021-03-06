//History Entry without Page Reload
function setLocation(href){
	//If Else Statement
	history.pushState ? history.pushState(null, null, href) : location.hash = href;
}

function replaceLocation(href) {
	history.replaceState ? history.replaceState(null, null, href) : location.hash = href;
}

//Access Cookies
function setCookie(cname,cvalue,exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires=" + d.toGMTString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for( var i = 0; i < ca.length; i++ ){
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

//Go to Homepage
function home(){
	setCookie('lastPage','',30);
	window.location.href = '../';
};

if (window.location.href != "https://awesome-e.github.io/hs-tools/") setCookie('lastPage', window.location.href, 30);

//Define Scroll End Function
$.fn.scrollEnd = function(callback, timeout) {          
  $(this).scroll(function(){
    var $this = $(this);
    if ($this.data('scrollTimeout')) {
      clearTimeout($this.data('scrollTimeout'));
    }
    $this.data('scrollTimeout', setTimeout(callback,timeout));
  });
};

//If there is an element with class "save-scroll", then set the hash to the nearest element
$(window).scrollEnd(function(){
	var headings = document.querySelector(".save-scroll")
	if (headings != undefined) {
		headings = headings.querySelectorAll('h2[id], h3[id]');
		var headingPositions = {};
		var offset = 302 - document.getElementById(headings[0].id).getBoundingClientRect().top;
		for (var i = 0; i < headings.length; i++) {
			headingPositions[Math.floor((document.getElementById(headings[i].id).getBoundingClientRect().top + offset)/2)*2] = headings[i].id;
		}
		
		//When the Scroll Stops, set hash to the closest heading not passed yet
		function closest(arr,val){
			return Math.max.apply(null, arr.filter(function(v){return v <= val}))
		}
		var hash = headingPositions[String(closest(Object.keys(headingPositions), Math.abs(document.body.getBoundingClientRect().top)))]||"";
		//(String(window.location.href.match(RegExp("#" + hash))) != "null")
		if (window.location.href.replace(/.*?#/,"") != hash){
			//Set Hash if Different
			replaceLocation('#' + hash);
			setCookie('lastPage', window.location.href, 30);
		}
		//console.log(window.location.href);
	}
	
}, 100);

//Remove Elements
Element.prototype.remove = function() {
	this.parentElement.removeChild(this);
}

NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
	for(var i = this.length - 1; i >= 0; i--) {
		if(this[i] && this[i].parentElement) {
			this[i].parentElement.removeChild(this[i]);
		}
	}
}

//Space or Enter -> Click Child Element
document.querySelectorAll('*[SH-STCE]').forEach(function(elm){
	elm.addEventListener('keydown', function(){if(event.keyCode == 13 || event.keyCode == 32) this.querySelector('*').click();});
});

//Space or Enter -> Click Current Element
document.querySelectorAll('*[SH-STSE]').forEach(function(elm){
	elm.addEventListener('keydown', function(){if(event.keyCode == 13 || event.keyCode == 32) this.click();});
});

function doCORSRequest(options, printResult) {
	var x = new XMLHttpRequest();
	x.open(options.method, '' + options.url);
	x.onload = x.onerror = function() {
		if (x.status == 429 || x.status == 403) target.value = "Server Error (" + x.status + ") – Try again later."; else 
		printResult(
			//options.method + ' ' + options.url + '\n' +
			//x.status + ' ' + x.statusText + '\n\n' +
			(x.responseText || '')
		);
	};
	if (/^POST/i.test(options.method)) {
		x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	}
	x.send(options.data);
}

function request(input_url, print) {
	console.log(input_url);
	doCORSRequest({
		method: 'GET',
		url: input_url,
		//data: dataField.value
	}, print);
};
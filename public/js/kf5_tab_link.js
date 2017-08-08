
if(DROPBOX.tab_img){custom_img= 'background:url('+DROPBOX.tab_img+')'};
var custom_color= '';
if(DROPBOX.tab_color){custom_color= 'background-color:'+DROPBOX.tab_color+''};

var html = '<div id="kf5_tab" onclick="show_box()" href="#" style="'+custom_color+';'+custom_img+'" class="pattern'+pattern+' kf5_Tab'+DROPBOX.tab_position+'"><p>'+DROPBOX.tab_title+'</p></div>';
var content = '<div id="kf5_container" style="top: 100px; "><a id="kf5_close" onclick="kf5_box_close()"></a><iframe id="kf5_body" frameborder="0" scrolling="auto" allowtransparency="true" src="'+DROPBOX.dropbox_url+'"></iframe></div><div id="kf5_scrim" style="height: 800px; ">&nbsp;</div>';

function kf5_box_close(){
	var overlay = document.getElementById("kf5_overlay");
	overlay.parentNode.removeChild(overlay);
}
function show_box(){
	
	var windowWidth;
	var windowHeight;
	if (self.innerHeight) {   // all except Explorer
		windowWidth = self.innerWidth;
		windowHeight = self.innerHeight;
	} else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
		windowWidth = document.documentElement.clientWidth;
		windowHeight = document.documentElement.clientHeight;
	} else if (document.body) { // other Explorers
		windowWidth = document.body.clientWidth;
		windowHeight = document.body.clientHeight;
	}  
	
	var kf5_overlay = document.createElement('div');
	kf5_overlay.setAttribute('id',"kf5_overlay");
	kf5_overlay.setAttribute('style',"height: "+windowHeight+"px; display: block;");
	kf5_overlay.innerHTML = content;
	document.body.appendChild(kf5_overlay);
	
	document.getElementById("kf5_scrim").style.height = document.body.scrollHeight+"px";
	if(document.body.scrollTop) document.getElementById("kf5_container").style.top = (document.body.scrollTop+100)+"px";
	  
}
window.onload = function(){
	var kf5_tab = document.createElement('div');
	kf5_tab.innerHTML = html;
	document.body.appendChild(kf5_tab);
};

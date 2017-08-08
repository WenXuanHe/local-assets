var pattern= "1";
if (DROPBOX.tab_title=="技术支持"){
	pattern="1";
	}
else if(DROPBOX.tab_title=="售后支持"){
	pattern="2";	
	}
else if(DROPBOX.tab_title=="售后帮助"){
	pattern="3";	
	}
else if(DROPBOX.tab_title=="反馈问题"){
	pattern="4";	
	}
else if(DROPBOX.tab_title=="提交事务"){
	pattern="5";	
	}
else if(DROPBOX.tab_title=="提交工单"){
	pattern="6";	
	}
else if(DROPBOX.tab_title=="事务处理"){
	pattern="7";	
	}
else if(DROPBOX.tab_title=="留言反馈"){
	pattern="8";	
	}
else if(DROPBOX.tab_title=="咨询问题"){
	pattern="9";	
	}
else if(DROPBOX.tab_title=="在线客服"){
	pattern="10";	
	}
else if(DROPBOX.tab_title=="在线帮助"){
	pattern="11";	
	}
else if(DROPBOX.tab_title=="在线支持"){
	pattern="12";	
	}
else{
	pattern="13";	
	}
var custom_img= '';
if(DROPBOX.tab_img){custom_img= 'background:url('+DROPBOX.tab_img+')'};
var custom_color= '';
if(DROPBOX.tab_color){custom_color= 'background-color:'+DROPBOX.tab_color+''};

var html = '<div id="kf5_tab" onclick="show_box()" href="#" style="'+custom_color+';'+custom_img+'" class="pattern'+pattern+' kf5_Tab'+DROPBOX.tab_position+'"><p>'+DROPBOX.tab_title+'</p></div>';
var content = '<div id="kf5_container"><a id="kf5_close" onclick="kf5_box_close()"></a><iframe id="kf5_body" frameborder="0" scrolling="auto" allowtransparency="true" onload="kf5_box_resize()"></iframe></div><div id="kf5_scrim" style="height: 800px; ">&nbsp;</div>';

function kf5_box_resize() { 
	document.getElementById("kf5_body").height = "810px";
} 

function kf5_box_close(){
	var overlay = document.getElementById("kf5_overlay");
	overlay.style.display = "none";
	document.getElementById('kf5_body').src = DROPBOX.dropbox_url+"/loading";
	//overlay.parentNode.removeChild(overlay);
}
function kf5_box_init(){
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
	var left = windowWidth/2-310;
	var kf5_overlay = document.createElement('div');
	kf5_overlay.setAttribute('id',"kf5_overlay");
	kf5_overlay.setAttribute('style',"height: "+windowHeight+"px; display: none;");
	kf5_overlay.innerHTML = content;
	document.body.appendChild(kf5_overlay);
	
	document.getElementById("kf5_container").style.left = left+"px";
	document.getElementById("kf5_scrim").style.height = document.body.scrollHeight+"px";
	document.getElementById('kf5_body').src = DROPBOX.dropbox_url+"/loading";
}
function show_box(){
	document.getElementById('kf5_body').height = "170px";
	document.getElementById("kf5_container").style.top = (document.body.scrollTop+100)+"px";
	document.getElementById('kf5_overlay').style.display = "block";
	document.getElementById('kf5_body').src = DROPBOX.dropbox_url; 
}
window.onload = function(){
	var kf5_tab = document.createElement('div');
	kf5_tab.innerHTML = html;
	document.body.appendChild(kf5_tab);
	kf5_box_init();
};

var KF5_Form_Url = document.getElementById("kf5_ticketform").getAttribute('name');
var kf5_iframe = document.createElement("iframe");
var kf5_iframe_style = "width:100%";
//kf5_iframe_style += "width:"+((typeof(KF5_Form_width) !== "undefined") ? KF5_Form_width : "500")+"px;";
//kf5_iframe_style += "height:"+((typeof(KF5_Form_height) !== "undefined") ? KF5_Form_height : "450")+"px;";
kf5_iframe.setAttribute("id","kf5_frame");
kf5_iframe.setAttribute("frameborder","0");
kf5_iframe.setAttribute("scrolling","auto");
kf5_iframe.setAttribute("style",kf5_iframe_style);
kf5_iframe.setAttribute("allowtransparency","true");
kf5_iframe.setAttribute("onLoad","iFrameHeight()"); 
document.getElementById("kf5_ticketform").appendChild(kf5_iframe);
document.getElementById("kf5_frame").src = KF5_Form_Url+"/dropbox/form";
function iFrameHeight() { 
var ifm= document.getElementById("kf5_frame"); 
var subWeb = document.frames ? document.frames["kf5_frame"].document : ifm.contentDocument; 
if(ifm != null && subWeb != null) { 
ifm.height = subWeb.body.scrollHeight; 
} 
} 

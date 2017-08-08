var DIALOGUE={
	lang:{
		wait:"等待用户请求",
	},
	status:function(str){
		//$(".agent_title").html($str);
		$("#status").html(str);
		//alert(str);
		return true;
	},
	showMessage:function(msg,from){
		$(".dialog").append("<p><span><i>"+from+"</i><em>"+getTime()+"</em></span>"+msg+"</p>");
		return true;
	},
	connected:function(){
		
	},
};
function getTime()
{
	var today = new Date();  
	var hour = today.getHours();
	var minute =today.getMinutes();
	var second = today.getSeconds();
	return hour+":"+minute+":"+second;
}	
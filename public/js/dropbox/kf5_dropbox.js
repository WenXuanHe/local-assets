// JavaScript Document
var KF5_DROPBOX = {};
KF5_DROPBOX.current = null;
KF5_DROPBOX.keyword = '';
KF5_DROPBOX.notice = function(message){
	var notice = '<div class="notice">'+message+'</div>';
	KF5_DROPBOX.clearNotice();
	$("#"+KF5_DROPBOX.current).children(".box_wp").prepend(notice);
};
KF5_DROPBOX.clearNotice = function(){
	$("#"+KF5_DROPBOX.current+" .notice").remove();
};
KF5_DROPBOX.showDiv = function(div){
	if(div == "dropbox_method_selection" && $("#dropbox_method_selection").length==0){
		KF5_DROPBOX.showDiv("dropbox_ticket");
		return;
	}
	if(div == "dropbox_question"){
		$(".dropbox_search").hide();
	}else{
		$(".dropbox_search").show();
	}
	if(div == "dropbox_ticket"){
		$("#ticket_form :submit").attr("disabled",false);
		$("#ticket_form").children("#errs").html("");
	}
	KF5_DROPBOX.clearNotice();
	$(".box_wp").parent().hide();
	$("#"+div).show();
	KF5_DROPBOX.current = div;
};
KF5_DROPBOX.loading = function(){
	$(".dropbox_loading").show();
};
KF5_DROPBOX.loaded = function(){
	$(".dropbox_loading").hide();
};
KF5_DROPBOX.question = function(){
	var keyword = $("#question_keyword").val();
	KF5_DROPBOX.search(keyword);
};
KF5_DROPBOX.search = function(keyword){
	KF5_DROPBOX.loading();
	$.get("/dropbox/search?keyword="+keyword,function(data){
		KF5_DROPBOX.loaded();
		if(data=="failed"){
			KF5_DROPBOX.showDiv("dropbox_method_selection");
			KF5_DROPBOX.notice("没有搜索到你提交的问题的解决方法，请用以下方式解决问题");
		}else{
			$("#dropbox_search_result .posts").html(data);
			KF5_DROPBOX.showDiv("dropbox_search_result");
			KF5_DROPBOX.notice("我们为您找到以下的内容以解决您的问题");
			$("#search_keyword").val(keyword);
		}
	});
};
KF5_DROPBOX.checkChat = function(){
	KF5_DROPBOX.loading();
	$.get("/dropbox/agentonline",function(data){
		KF5_DROPBOX.loaded();
		if(data=="failed"){
			KF5_DROPBOX.showDiv("dropbox_ticket");
			KF5_DROPBOX.notice("当前没有客服在线！请提交工单让我们处理");
		}else{
			KF5_DROPBOX.showDiv('dropbox_chat');
		}
		
	});
};
KF5_DROPBOX.openChat = function(){
	var email = $("#dropbox_chat #user_email").val();
	var name = $("#dropbox_chat #user_name").val();
	var title = $("#dropbox_chat #user_title").val();
	KF5_DROPBOX.loading();
	$.post("/dropbox/chat",{email:email,name:name,title:title},function(data){
		KF5_DROPBOX.loaded();
		if(data!='success'){
			KF5_DROPBOX.notice(data);
		}else{
			window.open("/chat/?email="+email+"&name="+name+"&title="+title,"chat","width=650,height=560,toolbar=no, menubar=no, scrollbars=no");
		}
		
	});
};

KF5_DROPBOX.ticket_options = { 
	beforeSubmit:  	showRequest, 
	success:       	showResponse 
}; 
function showRequest(formData, jqForm, options) { 
	//var queryString = $.param(formData); 
	//alert('About to submit: \n\n' + queryString); 
	KF5_DROPBOX.loading();
	return true; 
}; 
function showResponse(data){ 
	KF5_DROPBOX.loaded();
	if(data == "success"){
		KF5_DROPBOX.showDiv("dropbox_ticket_confirm");
		$("#ticket_form")[0].reset();
	}else{
		KF5_DROPBOX.clearNotice();
		$("#ticket_form").children("#errs").html("").append('<div class="errorSummary"><p>请更正下列输入错误:</p>'+data+'</div>').show();
		$("#ticket_form :submit").removeAttr("disabled");
	}
};

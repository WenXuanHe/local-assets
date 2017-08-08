var CHAT_USER={
	dialogues:[],
	roomid:null,
	connected:function(){
		var pre_room = Math.floor(Math.random()*10000+1);
		$(".connecting").remove();
		CHAT_USER.roomid = "room_"+Strophe.getNodeFromJid(CHAT.user.jid)+'_'+pre_room+'@'+CHAT.CHAT_ROOM;
		CHAT.enterRoom(CHAT_USER.roomid+"/"+CHAT.user.name);
		CHAT.invite(AGENT,CHAT_USER.roomid,ticket_id,CHAT.user.title);
		var msg_html = "<p><span><i>等待客服加入会话。。。</i></span></p>"
		$(".dialog").append(msg_html);
	},
	disconnected:function(){
		
	},
	status:function(msg){
		//alert(msg);
		return true;
	},
	decline:function(){
		var msg_html = "<p><span><i>客服忙，请稍后再试</i><em>"+CHAT.getTime()+"</em></span></p>"
		$(".dialog").append(msg_html);
	},
	showMessage:function(msg,from){
		var name = Strophe.getResourceFromJid(from);
		if(name == CHAT.user.name) return true;
		else if(name) {
			$.blinkTitle.clear(blink);
			blink = $.blinkTitle.show();
		}
		var msg_html = "<p><span><i>"+name+"</i><em>"+CHAT.getTime()+"</em></span>"+msg+"</p>"
		if(name) $(".dialog").append(msg_html);
		$(".dialog").scrollTo(99999,0);
		return true;
	},
	presence:function(presence){
		var from = $(presence).attr('from');
		var type = $(presence).attr('type');
		var room = Strophe.getBareJidFromJid(from);
		
		if(room == CHAT_USER.roomid){
			var name = Strophe.getResourceFromJid(from);
			if(name == CHAT.user.name) return true;
			if(type !== 'unavailable'){
				name += ' 加入了会话';
				if(CHAT.user.title) CHAT.sendMessage(CHAT.user.title,CHAT_USER.roomid);
			}else{
				name += ' 离开了会话';
				CHAT.exitRoom(CHAT_USER.roomid);
				$(".send").attr("disabled","disabled");
			}
			var msg_html = "<p><span><i>"+name+"</i><em>"+CHAT.getTime()+"</em></span></p>"
			$(".dialog").append(msg_html);
			$(".dialog").scrollTo(99999,0);
		}
		
		return true;
	},
	addRoom:function(roomid,name)
	{
		//return true;
	},
	sendMessage:function()
	{
		var msg = $(".msg_box").val();
		if(msg) {
			CHAT.sendMessage(msg,CHAT_USER.roomid);
			$(".msg_box").val("");
			var msg_html = "<p><span><i>我</i><em>"+CHAT.getTime()+"</em></span>"+msg+"</p>"
			$(".dialog").append(msg_html);
			$(".dialog").scrollTo(99999,0);
		}
	},
	overDialogue:function()
	{
		if(confirm("确定要结束对话吗？结束对话后窗口将在3秒后关闭")){
			CHAT.exitRoom(CHAT_USER.roomid);
			CHAT.offLine();
			$(".send").attr("disabled","disabled");
			setTimeout("window.close()",3000);
		}
		
	}
};
var DIALOGUE = CHAT_USER;
jQuery(function($) {
	$(".msg_box").keydown(function(event){
		if(event.ctrlKey && event.keyCode==13) $(".send").click();
	});
	$("#chat_client_wrapper").click(function(){$.blinkTitle.clear(blink);});
});
var CHAT_USER={
	dialogues:[],
	roomid:null,
	connected:function(){
		var pre_room = Math.floor(Math.random()*10000+1);
		$(".chat-connecting,.chat-overlay").remove();
		CHAT_USER.roomid = "room_"+Strophe.getNodeFromJid(CHAT.user.jid)+'_'+pre_room+'@'+CHAT.CHAT_ROOM;
		CHAT.enterRoom(CHAT_USER.roomid+"/"+CHAT.user.name);
		CHAT.invite(AGENT,CHAT_USER.roomid,ticket_id,CHAT.user.title);
		
		var pingTimer = setInterval(function() {CHAT_USER.ping()},30000);
		
		var msg_html = '<section class="service">';
		msg_html += '<span>等待客服加入会话。。。</span>';
		msg_html += '</section>';
		$(".chat-option").show();
		$(".chat-content").append(msg_html);
		
	},
	disconnected:function(){
		clearInterval(pingTimer);
	},
	status:function(msg){
		//alert(msg);
		return true;
	},
	decline:function(){
		var msg_html = '<section class="service">';
		msg_html += '<span>客服忙，请稍后再试'+' '+CHAT.getTime()+'</span>';
		msg_html += '</section>';
		$(".chat-content").append(msg_html);
		//不是基于工单提交的聊天，弹出提示
		if(ticket_id==0)	chatToTicket();
	},
	showMessage:function(msg,from){
		var name = Strophe.getResourceFromJid(from);
		if(name == CHAT.user.name) return true;
		else if(name) {
			$(".message_text").removeAttr("disabled");
			if(msg == CHAT.command.inputing){
				if(showInputingTimer){
					window.clearInterval(showInputingTimer);
				}
				$(".chat-typing").html("客服正在输入...");
				showInputingTimer = window.setInterval('$(".chat-typing").html("");',3000);
				return true;
			}
			$(".chat-typing").html("");
			window.clearInterval(showInputingTimer);
			showInputingTimer = null;
			
			//客服进入交谈
			if(isFirstMessage){
				if(!durationTimer) durationTimes();
				isFirstMessage = false;
			}
			if(waitingTimer!=null){
				window.clearTimeout(waitingTimer);
				waitingTimer = null;
			}
			
			$.blinkTitle.clear(blink);
			blink = $.blinkTitle.show();
		}
		
		var msg_html = '<section class="user">';
		msg_html += '<span>'+name+' '+CHAT.getTime()+'</span>';
		msg_html += '<div>'+msg+'</div>';
		msg_html += '</section>';
		
		if(name) $(".chat-content").append(msg_html);
		$(".chat-content").scrollTo(99999,0);
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
				if(CHAT.user.title)
					CHAT.sendMessage(CHAT.user.title,CHAT_USER.roomid);
			}else{
				name += ' 离开了会话';
				CHAT.exitRoom(CHAT_USER.roomid);
				$("#send").attr("disabled","disabled");
				if(durationTimer){
					window.clearTimeout(durationTimer);
					durationTimer = null;
				}
			}
			var msg_html = '<section class="service">';
			msg_html += '<span>'+name;
			msg_html += ' '+CHAT.getTime()+'</span>';
			msg_html += '</section>';
			$(".chat-content").append(msg_html);
			$(".chat-content").scrollTo(99999,0);
		}
		
		return true;
	},
	addRoom:function(roomid,name)
	{
		//return true;
	},
	sendMessage:function()
	{
		if(inputingTimer){
			window.clearTimeout(inputingTimer);
			inputingTimer = null;
		}
		var msg = $(".message_text").val();
		if(msg) {
			CHAT.sendMessage(msg,CHAT_USER.roomid);
			$(".message_text").val("");
			var msg_html = '<section class="agent">';
			msg_html += '<span>我'+' '+CHAT.getTime()+'</span>';
			msg_html += '<div>'+msg+'</div>';
			msg_html += '</section>';
			$(".chat-content").append(msg_html);
			$(".chat-content").scrollTo(99999,0);
		}
	},
	overDialogue:function()
	{
		if(confirm("确定要结束对话吗？结束对话后窗口将在3秒后关闭")){
			CHAT.exitRoom(CHAT_USER.roomid);
			CHAT.offLine();
			if(durationTimer){
				window.clearTimeout(durationTimer);
				durationTimer = null;
			}
			$("#send").attr("disabled","disabled");
			setTimeout("window.close()",3000);
		}
	},
	ping:function(){
		CHAT.connection.send($iq({to:CHAT.SERVER_NAME,type:"get",id:"ping"}).c("ping",{xmlns:"urn:xmpp:ping"}));
	}
};
var DIALOGUE = CHAT_USER;

//会话持续时间
var durationTimer = null;
var duration = 0;
function durationTimes()
{
	duration += 1;
	$(".chat-duration").html("持续时长："+duration+" 秒");
	durationTimer = window.setTimeout("durationTimes()",1000);
}

var isFirstMessage = true;//客服进入交谈
//正在输入标示
var inputingTimer = null;
var showInputingTimer = null;
jQuery(function($) {
	$(".message_text").keydown(function(event){
		if(event.ctrlKey && event.keyCode==13) $("#send").click();
		else if(inputingTimer==null){
			inputingTimer = window.setTimeout('CHAT.sendMessage(CHAT.command.inputing,CHAT_USER.roomid);inputingTimer=null;',2500);
		}
	});
	$(".chat-wrap").click(function(){$.blinkTitle.clear(blink);});
});
var blink;
;(function($) {
	 
	$.extend({
		/**
		 * 调用方法： var blink = $.blinkTitle.show();
		 *			$.blinkTitle.clear(blink);
		 */
		blinkTitle : {
			show : function() {	//有新消息时在title处闪烁提示
				var step=0, _title = document.title;
 
				var timer = setInterval(function() {
					step++;
					if (step==3) {step=1};
					if (step==1) {document.title='【　　　】'+_title};
					if (step==2) {document.title='【新消息】'+_title};
				}, 500);
 
				return [timer, _title];
			},
 
			/**
			 * @param timerArr[0], timer标记
			 * @param timerArr[1], 初始的title文本内容
			 */
			clear : function(timerArr) {	//去除闪烁提示，恢复初始title文本
				if(timerArr) {
					clearInterval(timerArr[0]);	
					document.title = timerArr[1];
				};
			}
		}
	});
})(jQuery);
jQuery(function($) {
	CHAT.init();
});
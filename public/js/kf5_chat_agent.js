/**
 * 客服聊天js
 */
var AGENT_CHAT = {
	over_id:0,
	status:function(str){
		// console.log(str);
		return true;
	},
	showMessage:function(msg,from,type){
		var name = Strophe.getResourceFromJid(from);
		var id = Strophe.getNodeFromJid(from);
		if(name == CHAT.user.name) return true;
		//用户正在输入
		if(msg == CHAT.command.inputing){
			if(showInputingTimer){
				window.clearInterval(showInputingTimer);
			}
			$("#dialogue_"+id+" .chat-typing").html("用户正在输入...");
			showInputingTimer = window.setInterval('$(".chat-typing").html("");',3000);
			return true;
		}
		$("#dialogue_"+id+" .chat-typing").html("");
		window.clearInterval(showInputingTimer);
		showInputingTimer = null;
		
		var msg_html = '<section class="user"><span>'+name+' '+CHAT.getTime()+'</span><div>'+msg+'</div></section>';
		if(name) {
			$("#dialogue_"+id+" .chat-content").append(msg_html);
			$("#dialogue_"+id+" .chat-content").scrollTo(99999,0);
			if(name != CHAT.user.name) {
				$("#head_"+id+" .c_chat_notice").show();
				$("#icon_livechat .message_dot").show();
				$.blinkTitle.clear(blink);
				blink = $.blinkTitle.show("新消息");
			}
		}
		return true;
	},
	active:function(obj)
	{
		$(obj).addClass("active");
		$(obj).children(".c_chat_notice").hide();
		$("#icon_livechat .message_dot").hide();
		$.blinkTitle.clear(blink);
	},
	connected:function(){
		//连接上线成功
		statusOnline();
		$(".pane-status #status-loading").remove();
		chatOnline = true;
		$("#icon_livechat").addClass("active");
		var pingTimer = setInterval(function() {AGENT_CHAT.ping()},30000);
 		window.onbeforeunload = function(){
 			return '您的交谈当前还处于在线状态，确认要离线？';
 		};
	},
	disconnected:function(){
		statusOffline();
		clearInterval(pingTimer);
	},
	changeDialogue:function(id)
	{
		$(".wait_box").removeClass("active");
		$(".chat-main-panel").hide();
		$("#"+id).show();
	},
	sendMessage:function(id)
	{
		var msg = $("#dialogue_"+id+" .message_text").val();
		if(msg) {
			CHAT.sendMessage(msg,id+'@'+CHAT.CHAT_ROOM);
			$("#head_"+id+" .c_chat_notice").hide();
			$("#icon_livechat .message_dot").hide();
			$.blinkTitle.clear(blink);
			$("#dialogue_"+id+" .message_text").val("");
			var msg_html = '<section class="agent">';
			msg_html += '<span>'+CHAT.user.name+' '+CHAT.getTime()+'</span><div>'+msg+'</div>';
			msg_html += '</section>';
			$("#dialogue_"+id+" .chat-content").append(msg_html);
			$("#dialogue_"+id+" .chat-content").scrollTo(99999,0);
		}
	},
	createDialogue:function(id,ticket_id)
	{
		$('#head_'+id).attr('onclick','DIALOGUE.changeDialogue("dialogue_'+id+'");AGENT_CHAT.active(this);');
		var roomid = id+'@'+CHAT.CHAT_ROOM+"/"+CHAT.user.name;
		CHAT.enterRoom(roomid);
		$("#head_"+id+" .user-status a").remove();
		$("#head_"+id+" .user-status").text("会话中");
		$("#head_"+id).removeClass("requesting");
		AGENT_CHAT.changeDialogue(id);
		var html = '';
		html += '<div class="chat-main-panel" data-source="'+ticket_id+'" id="dialogue_'+id+'">';
		if(ticket_id) {
			html += '<div class="chat_head"><div class="chat_title">该会话来源于 <a href="/agent/#/ticket/'+ticket_id+'">#'+ticket_id+' 工单</a></div>';
			html += '<div class="chat_ops"><a class="btn" onclick="AGENT_CHAT.over(\''+roomid+'\',\''+id+'\');" title="结束当前会话交谈">结束会话</a></div><div class="chat_source" style="display:none;"></div></div>';
		}else{
			html += '<div class="chat_head"><div class="chat_ops"><a class="btn" onclick="AGENT_CHAT.over(\''+roomid+'\',\''+id+'\');" title="结束当前会话交谈">结束会话</a><div class="chat_source" style="display:none;"></div></div></div>';
		}
		html += '<div class="chat-content"></div>';
		//输入状态与持续时长
		endTimes[duration_id] = 0;
		durationRoom[duration_id] = id;
		if(durationTimer==null){
			durationTimes();
		}
		html += '<div class="chat-operation">';
		html += '<span class="chat-typing"></span>';
		html += '<span id="chat-duration_'+duration_id+'" class="chat-duration"></span>';
		html += '</div>';
		duration_id ++;
		//回复框
		html += '<div class="chat-message">';
		html += '<textarea class="message_text" placeholder="在此输入消息，按Ctrl+Enter发送"></textarea>';
		html += '<div class="send_area">';
		html += '<a class="btn btn-operate" onclick="AGENT_CHAT.sendMessage(\''+id+'\');">发送</a>';
		html += '</div>';
		html += '</div>';
		
		html += '</div>';
		$("#chat-main").append(html);
		if(CHAT.user.welcome) 
			CHAT.sendMessage(CHAT.user.welcome,id+'@'+CHAT.CHAT_ROOM);
		
		$("#dialogue_"+id+" .message_text").keydown(function(event){
			if(event.ctrlKey && event.keyCode==13){
				$(this).parent().children(".send_area").children(".btn-operate").click();
			}else if(inputingTimer==null){
				inputingTimer = window.setTimeout("CHAT.sendMessage(CHAT.command.inputing,'"+id+"'+'@'+CHAT.CHAT_ROOM);inputingTimer=null;",2500); 
			}
		});
	},
	addRoom:function(id,name,ticket_id,user_id,title)
	{
		$(".requesting").each(function(i){
			if($(this).attr('data-user') == user_id) {
				$(this).remove();
			}
		});
		if($("#head_"+id).length>0) return ;
		var html = '';
		html += '<div class="wait_box requesting" data-title="'+title+'" data-user="'+user_id+'" id="head_'+id+'" >';
		html += '<div class="user_info"><i class="c_status_icon online"></i><em>';
		html += '<a href="/agent/#/user/'+CHAT.getUid(user_id)+'">'+name+'</a>';
		html += '</em></div>';
		html += '<div class="user-status">';
		html += '	<a class="btn btn-operate" href="javascript:;" onclick="DIALOGUE.createDialogue(\''+id+'\','+ticket_id+')">开始交谈</a>';
		html += '	<a class="btn" href="javascript:;" onclick="AGENT_CHAT.decline(this,\''+id+'\');">忽略请求</a>';
		html += '</div>';
		html += '<div class="chat_active c_chat_notice"></div>';
		html += '</div>';
			
		$("#chat-queue").append(html);
		$("#icon_livechat .message_dot").show();
		$("#chat-section").show();
		$.blinkTitle.clear(blink);
		blink = $.blinkTitle.show("新消息");
	},
	invite:function(msg){
		var from = msg.getAttribute('from');
	    var type = msg.getAttribute('type');
	    var elems = msg.getElementsByTagName('invite');
	    var roomid = $(elems).attr('to');
	    var ticket_id = $(msg.getElementsByTagName('reason')).attr('ticket_id');
	    //var title = msg.getElementsByTagName('reason')[0];
	    var title = Strophe.getText(msg.getElementsByTagName('reason')[0]);
		
	    AGENT_CHAT.addRoom(Strophe.getNodeFromJid(roomid),Strophe.getResourceFromJid(from),ticket_id,from,title);
	},
	decline:function(obj,roomid){
		CHAT.decline(roomid,$(obj).parent().parent().attr("data-user"));
		$(obj).parent().parent().remove();
		$("#icon_livechat .message_dot").hide();
		$.blinkTitle.clear(blink);
	},
	presence:function(presence){
		var from = $(presence).attr('from');
		var type = $(presence).attr('type');
		var room = Strophe.getBareJidFromJid(from);
		var id = Strophe.getNodeFromJid(from);
		var name = Strophe.getResourceFromJid(from);
		if(type !== 'unavailable'){
			name += ' 加入了会话';
			var msg_html = '<section class="service">';
			msg_html += '<div>'+name;
			msg_html += ' '+CHAT.getTime()+'</div>';
			msg_html += '</section>';
			$("#dialogue_"+id+" .chat-content").append(msg_html);
			$("#dialogue_"+id+" .chat-content").scrollTo(99999,0);
		}else{
			name += ' 离开了会话';
			var msg_html = '<section class="service">';
			msg_html += '<div>'+name;
			msg_html += ' '+CHAT.getTime()+'</div>';
			msg_html += '</section>';
			$("#dialogue_"+id+" .chat-content").append(msg_html);
			$("#dialogue_"+id+" .chat-content").scrollTo(99999,0);
			
			AGENT_CHAT.over(room,id);
		}
		
		return true;
	},
	over:function(room,id)
	{
		CHAT.exitRoom(room);
		
		$("#head_"+id+" .c_chat_notice").remove();
		$("#icon_livechat .message_dot").hide();
		$("#head_"+id+" .c_status_icon").removeClass("online");
		$("#head_"+id+" .c_status_icon").addClass("offline");
		$("#head_"+id+" .user-status").text("会话结束");
		
		$("#head_"+id).attr('onclick','DIALOGUE.changeDialogue("over_dialogue_'+AGENT_CHAT.over_id+'");AGENT_CHAT.active(this);');
		$("#head_"+id).attr('id','over_head_'+AGENT_CHAT.over_id);
		$("#dialogue_"+id).attr('id','over_dialogue_'+AGENT_CHAT.over_id);

		closeRoomTimer(id);
		
		if($('#over_dialogue_'+AGENT_CHAT.over_id).attr("data-source"))
			AGENT_CHAT.save($('#over_dialogue_'+AGENT_CHAT.over_id).attr("data-source"),$('#over_head_'+AGENT_CHAT.over_id).attr("data-user"),$('#over_head_'+AGENT_CHAT.over_id).attr("data-title"),$('#over_dialogue_'+AGENT_CHAT.over_id+' .chat-content').html(),AGENT_CHAT.over_id);
		
		AGENT_CHAT.over_id++;
	},
	save:function(id,uid,title,content,chat_id){
		$.post('/livechat/save',{id:id,uid:uid,title:title,content:content},function(result){
			var source = $("#over_dialogue_"+chat_id+" .chat_source");
			if(result == 'fail'){
				//保存失败
				source.append("工单更新失败");
			}else{
				//保存成功
				if(id==0){//新工单
					source.html('<a href="/agent/#/ticket/'+result+'">工单 # '+result+'</a> 已创建');
				}else
					source.html("工单已更新");
			}
			$("#over_dialogue_"+chat_id+" .chat_ops .btn").remove();
			$("#over_dialogue_"+chat_id+" .chat_ops").prepend("<a href='javascript:;' class='btn' onclick='$(\"#over_head_"+chat_id+"\").remove();$(\"#over_dialogue_"+chat_id+"\").remove();AGENT_CHAT.chatIntro();'>关闭会话</a>");
			source.show();
		});
	},
	ping:function(){
		CHAT.connection.send($iq({to:CHAT.SERVER_NAME,type:"get",id:"ping"}).c("ping",{xmlns:"urn:xmpp:ping"}));
	},
	chatIntro:function(){
		if($(".chat-main-panel").length<2) $(".chat-main-panel").show();
		$.blinkTitle.clear(blink);
	}
};

var DIALOGUE = AGENT_CHAT;

//交谈状态切换
var chatOnline = false;
var inputingTimer = null;
var showInputingTimer = null;
var endTimes = [];
var durationRoom = [];
var duration_id = 0;
var durationTimer = null;

var blink = null;

function statusOnline()
{
	$("#status-switch").removeClass("offline").addClass("online");
	$("#status-switch").children(".status-text").html("有空交谈");
}
function statusOffline()
{
	$("#status-switch").removeClass("online").addClass("offline");
	$("#status-switch").children(".status-text").html("没空交谈");
}
function durationTimes()
{
	var length = endTimes.length;
	for(var i=0; i<length; i++){
		if(endTimes[i]==null) continue;
		endTimes[i] += 1;
		$("#chat-duration_"+i).html("持续时长："+endTimes[i]+" 秒");
	}
	if($(".wait_box").length==0){
		window.clearTimeout(durationTimer);
		durationTimer = null;
	}else if(length){
		durationTimer = window.setTimeout("durationTimes()",1000);
	}
}
function closeRoomTimer(room_id)
{
	var id = null;
	for(var i=0; i<durationRoom.length; i++){
		if(durationRoom[i] == room_id){
			id = i;
			endTimes[i] = null;
		}
	}
}

jQuery(function($) {
	//载入chat窗口
	var chat_html = '<div id="chat-section" class="plat-pane from-top at-right chat-pane" style="display:none">'
		+ '	<div class="pane-arrow at-right"></div>'
		+ '	<div class="pane-main clearfix">'
		+ '		<div class="pane-title">在线交谈</div>'
		+ '		<div class="pane-status">'
		+ '			<a id="status-switch" class="status-switch offline">'
		+ '				<i class="status-dot"></i>'
		+ '				<i class="status-text">没空交谈</i>'
		+ '			</a>'
		+ '		</div>'
		+ '	</div>'
		+ '	<div class="chat-wrapper">'
		+ '		<div id="chat-queue" class="chat-queue"></div>'
		+ '		<div id="chat-main" class="chat-main">'
		+ '			<div class="chat-main-panel">'
		+ '			    <div class="preload-content">'
		+ '					<p>用户的会话请求将在左边侧栏显示</p>'
		+ '					<p>接受请求后可以和用户在线交谈</p>'
		+ '			    </div>'
		+ '			</div>'
		+ '		</div>'
		+ '	</div>'
		+ '</div>';
	$('body').append(chat_html);
	
	$('#status-switch').click(function(){
		if(chatOnline){
			CHAT.offLine();
			chatOnline = false;
			$("#icon_livechat").removeClass("active");
		}else{
			$(".pane-status").append("<span id='status-loading'></span>");
			$.get("/livechat/updateuser",function(data){
				if(data=="success"){
					CHAT.init();
				}
			});
		}
	});
	$('#status-switch').hover(
		function () {
			chatOnline ? statusOffline():statusOnline();
		},
		function () {
			chatOnline ? statusOnline():statusOffline();
		}
	);

});

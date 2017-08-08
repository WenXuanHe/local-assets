var CHAT_AGENT={
	over_id:0,
	status:function(str){
		$("#status").html(str);
		return true;
	},
	showMessage:function(msg,from,type){
		var name = Strophe.getResourceFromJid(from);
		var id = Strophe.getNodeFromJid(from);
		if(name == CHAT.user.name) return true;
		var msg_html = "<p><span><i>"+name+"</i><em>"+CHAT.getTime()+"</em></span>"+msg+"</p>"
		if(name) {
			$("#dialogue_"+id+" .dialog").append(msg_html);
			$("#dialogue_"+id+" .dialog").scrollTo(99999,0);
			if(name != CHAT.user.name) {
				$("#head_"+id+" .notice").show();
				$.blinkTitle.clear(blink);
				blink = $.blinkTitle.show();
			}
		}
		return true;
	},
	active:function(obj)
	{
		$(obj).addClass("onchat");
		$(obj).children(".notice").hide();
		$.blinkTitle.clear(blink);
	},
	connected:function(){
		$(".session").show();
		CHAT.showStatus ('状态在线');
		var timer = setInterval(function() {CHAT_AGENT.ping()},30000);
	},
	disconnected:function(){
		$("#show_status span").text("离线");
		$("#show_status").attr('class',"status_offline");
		clearInterval(timer);	
	},
	changeDialogue:function(id)
	{
		$(".user_request").removeClass("onchat");
		$(".chat_main").hide();
		$("#"+id).show();
	},
	sendMessage:function(id)
	{
		var msg = $("#dialogue_"+id+" .msg_box").val();
		if(msg) {
			CHAT.sendMessage(msg,id+'@'+CHAT.CHAT_ROOM);
			$("#head_"+id+" .notice").hide();
			$("#dialogue_"+id+" .msg_box").val("");
			var msg_html = "<p><span><i>"+CHAT.user.name+"</i><em>"+CHAT.getTime()+"</em></span>"+msg+"</p>"
			$("#dialogue_"+id+" .dialog").append(msg_html);
			$("#dialogue_"+id+" .dialog").scrollTo(99999,0);
		}
	},
	createDialogue:function(id,ticket_id)
	{
		$('#head_'+id).attr('onclick','DIALOGUE.changeDialogue("dialogue_'+id+'");CHAT_AGENT.active(this);');
		var roomid = id+'@'+CHAT.CHAT_ROOM+"/"+CHAT.user.name;
		CHAT.enterRoom(roomid);
		$("#head_"+id+" .request_operate a").remove();
		$("#head_"+id+" .chat_status").text("会话中");
		$("#head_"+id).removeClass("requesting");
		CHAT_AGENT.changeDialogue(id);
		var html = '';
		html += '<div class="chat_main" data-source="'+ticket_id+'" id="dialogue_'+id+'">';
		if(ticket_id) {
			html += '<div class="source">该会话来源于 <a href="/ticket/view/id/'+ticket_id+'" target="_blank">#'+ticket_id+' 工单</a></div>';
		}else{
			html += '<div class="source" style="display:none"></div>';
		}
			
		html += '<div class="dialog" style="height:'+($(window).height()-228)+'px"></div><div class="chat_miscell"></div>';

		html += '<div class="chat_sub">';
		html += '<div class="chat_msg"><textarea class="msg_box" placeholder="在此输入消息"></textarea></div>';
		html += '<div class="chat_operate"><input type="button" value="发送" class="send" onclick="CHAT_AGENT.sendMessage(\''+id+'\');" /> <span class="tip">按Ctrl+回车键快捷发送</span><a onclick="CHAT.exitRoom(\''+roomid+'\');$(this).remove();" class="end_dialog">结束会话</a></div>';
		html += '</div></div>';
		$(".chatright").append(html);
		if(CHAT.user.welcome) CHAT.sendMessage(CHAT.user.welcome,id+'@'+CHAT.CHAT_ROOM);
		$("#dialogue_"+id+" .msg_box").live('keydown',function(event){
			if(event.ctrlKey && event.keyCode==13) 
				$(this).parent().parent().children(".chat_operate").children(".send").click();
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
		html += '<div class="user_request requesting" data-title="'+title+'" data-user="'+user_id+'" id="head_'+id+'" >';
		html += '	<a target="_blank" href="/user/info/'+CHAT.getUid(user_id)+'" class="user_status user online" title="'+name+'">'+name+'</a>';
		html += '	<div class="request_operate"><span class="chat_status red">等待会话</span>';
		html += '	<a href="javascript:;" onclick="DIALOGUE.createDialogue(\''+id+'\','+ticket_id+')">接受</a> ';
		html += '	<a href="javascript:;" onclick="CHAT_AGENT.decline(this,\''+id+'\');">忽略</a></div>';
		html += '	<span class="notice" style="display:none"></span></div>';
		$("#user_wait").append(html);
		$.blinkTitle.clear(blink);
		blink = $.blinkTitle.show();
	},
	invite:function(msg){
		
		var from = msg.getAttribute('from');
	    var type = msg.getAttribute('type');
	    var elems = msg.getElementsByTagName('invite');
	    var roomid = $(elems).attr('to');
	    var ticket_id = $(msg.getElementsByTagName('reason')).attr('ticket_id');
	    //var title = msg.getElementsByTagName('reason')[0];
	    var title = Strophe.getText(msg.getElementsByTagName('reason')[0]);
		
	    CHAT_AGENT.addRoom(Strophe.getNodeFromJid(roomid),Strophe.getResourceFromJid(from),ticket_id,from,title);
	},
	decline:function(obj,roomid){
		CHAT.decline(roomid,$(obj).parent().parent().attr("data-user"));
		$(obj).parent().parent().remove();
	},
	presence:function(presence){
		var from = $(presence).attr('from');
		var type = $(presence).attr('type');
		var room = Strophe.getBareJidFromJid(from);
		var id = Strophe.getNodeFromJid(from);
		var name = Strophe.getResourceFromJid(from);
			
		if(type !== 'unavailable'){
			name += ' 加入了会话';
			var msg_html = "<p><span><i>"+name+"</i><em>"+CHAT.getTime()+"</em></span></p>";
			$("#dialogue_"+id+" .dialog").append(msg_html);
			$("#dialogue_"+id+" .dialog").scrollTo(99999,0);
		}else{
			name += ' 离开了会话';
			var msg_html = "<p><span><i>"+name+"</i><em>"+CHAT.getTime()+"</em></span></p>";
			$("#dialogue_"+id+" .dialog").append(msg_html);
			$("#dialogue_"+id+" .dialog").scrollTo(99999,0);
			CHAT_AGENT.over(room,id);
		}
		
		return true;
	},
	over:function(room,id)
	{
		CHAT.exitRoom(room);
		
		$("#head_"+id+" .notice").remove();
		$("#head_"+id+" .user_status").removeClass("online");
		$("#head_"+id+" .user_status").addClass("offline");
		$("#head_"+id+" .chat_status").text("会话结束");
		
		$("#dialogue_"+id+" .end_dialog").remove();
		$("#head_"+id).attr('onclick','DIALOGUE.changeDialogue("over_dialogue_'+CHAT_AGENT.over_id+'");CHAT_AGENT.active(this);');
		$("#head_"+id).attr('id','over_head_'+CHAT_AGENT.over_id);
		$("#dialogue_"+id).attr('id','over_dialogue_'+CHAT_AGENT.over_id);
		
		if($('#over_dialogue_'+CHAT_AGENT.over_id).attr("data-source"))
			CHAT_AGENT.save($('#over_dialogue_'+CHAT_AGENT.over_id).attr("data-source"),$('#over_head_'+CHAT_AGENT.over_id).attr("data-user"),$('#over_head_'+CHAT_AGENT.over_id).attr("data-title"),$('#over_dialogue_'+CHAT_AGENT.over_id+' .dialog').html(),CHAT_AGENT.over_id);
		
		CHAT_AGENT.over_id++;
	},
	save:function(id,uid,title,content,chat_id){
		$.post('/chat/default/save',{id:id,uid:uid,title:title,content:content},function(result){
			var source = $("#over_dialogue_"+chat_id+" .source");
			if(result == 'fail'){
				//保存失败
				source.append("工单更新失败");
			}else{
				//保存成功
				source.html("<a href='/ticket/view/id/"+result+"' target='_blank'>#"+result+"工单</a>已更新");
			}
			source.append(" | <a href='javascript:;' onclick='$(\"#over_head_"+chat_id+"\").remove();$(\"#over_dialogue_"+chat_id+"\").remove();CHAT_AGENT.chatIntro();'>关闭会话</a>");
			source.show();
		});
	},
	ping:function(){
		CHAT.connection.send($iq({to:CHAT.SERVER_NAME,type:"get",id:"ping"}).c("ping",{xmlns:"urn:xmpp:ping"}));
	},
	chatIntro:function(){
		if($(".chat_main").length<2) $(".chat_main").show();
	}
};
var DIALOGUE = CHAT_AGENT;
	
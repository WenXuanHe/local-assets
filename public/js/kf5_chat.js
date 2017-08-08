var SERVER_NAME = 'openfire.kf5.com';
var CHAT={
	SERVER_NAME:SERVER_NAME,
	BOSH_SERVICE:'http://'+SERVER_NAME+'/xmpp-httpbind',
	CHAT_ROOM:'conference.'+SERVER_NAME,
	connection:null,
	user:null,
	messageTypes:['invite','decline'],
	
	//聊天命令，作为信息发送
	command:{
		inputing:"command:inputing"
	},
	
	init:function()
	{
		CHAT.showStatus('初始化中...');
		CHAT.connection = new Strophe.Connection(CHAT.BOSH_SERVICE);
		CHAT.connection.connect(CHAT.user.jid,CHAT.user.token,CHAT.onConnect);
		//CHAT.connection.rawInput = CHAT.rawInput;
		//CHAT.connection.rawOutput = CHAT.rawOutput;
	},
	log:function(msg) 
	{
		//console.log(msg);
		//$('.dialog').append(document.createTextNode(msg));
	},
	send:function(msg)
	{
		CHAT.connection.send(msg.tree());
	},
	rawInput:function (data)
	{
		CHAT.log('收到: ' + data);
	},
	rawOutput:function (data)
	{
		CHAT.log('发送: ' + data);
	},
	onConnect:function(status)
	{
		if (status == Strophe.Status.CONNECTING) {
			CHAT.showStatus ('正在建立通信,请稍后...');
		} else if (status == Strophe.Status.CONNFAIL) {
			CHAT.showStatus ('连接超时！');
		} else if (status == Strophe.Status.DISCONNECTING) {
			CHAT.showStatus ('正在断开通信...');
		} else if (status == Strophe.Status.DISCONNECTED) {
			CHAT.showStatus ('状态离线');
			DIALOGUE.disconnected();
		} else if (status == Strophe.Status.CONNECTED) {
			//CHAT.showStatus (DIALOGUE.lang.wait);
			CHAT.connection.addHandler(CHAT.onMessage, null, 'message', 'groupchat', null,  null);
			CHAT.connection.addHandler(CHAT.onCase, null, 'message', null, null,  null);
			CHAT.connection.addHandler(CHAT.onPresence, null, 'presence', null, null,  null);
			var show = $pres().c("show",{},"chat").c("status",{},"free");
			CHAT.connection.send(show.tree());
			DIALOGUE.connected();
		}else{
			CHAT.showStatus("建立通信中..."+status);
		}
	},
	//解析消息类型的方法
	resolveType:function(msg){
		var type = null;
		$.each( CHAT.messageTypes, function(i, n){
			var elems = msg.getElementsByTagName(n);
			if( elems.length > 0){
				type = n;
				return false;
			}
		});
		return type;
	},
	onCase:function(msg){
		switch (CHAT.resolveType(msg)){
			case "invite":
				DIALOGUE.invite(msg);
				break;
			case "decline":
				DIALOGUE.decline(msg);
				break;
			default:break;
		}
		return true;
	},
	onMessage:function(msg){
		var from = msg.getAttribute('from');
	    var type = msg.getAttribute('type');
	    var elems = msg.getElementsByTagName('body');
		var body = elems[0];
		DIALOGUE.showMessage(Strophe.getText(body),from,type);
		return true;
	},
	onPresence:function(msg){
		//解析和处理消息
		return DIALOGUE.presence(msg);
	},
	showStatus:function(msg){
		return DIALOGUE.status(msg);
	},
	reconnect:function()
	{
		//CHAT.connection.disconnect();
		CHAT.connection = new Strophe.Connection(CHAT.BOSH_SERVICE);
		CHAT.connection.connect(CHAT.user.jid,CHAT.user.token,CHAT.onConnect);
	},
	//改变聊天状态
	chageStatus:function(status)
	{
		if(!CHAT.connection.connected){
			CHAT.reconnect();
		};
		var show = $pres().c("show",{},"chat").c("status",{},status);
		CHAT.connection.send(show.tree());
		if(status=='free') CHAT.showStatus ('状态在线');
		else if(status=='away') CHAT.showStatus("状态离开");
	},
	//离线
	offLine:function()
	{
		CHAT.connection.send($pres({"type":"unavailable"}).tree());
		CHAT.showStatus ('状态离线');
		CHAT.connection.disconnect();
		window.onbeforeunload = "";
	},
	//加入房间
	enterRoom:function(roomid)
	{
		var room = $pres({"to":roomid,"from":CHAT.user.jid});
		CHAT.connection.send(room.tree());
	},
	//离开房间
	exitRoom:function(roomid)
	{
		var room = $pres({to:roomid,from:CHAT.user.jid,type:"unavailable"});
		CHAT.connection.send(room.tree());
	},
	//发送消息
	sendMessage:function(message,roomid)
	{
		var msg = $msg({to:roomid,type:"groupchat"}).c("body").t(message);
		CHAT.connection.send(msg.tree());
	},
	//邀请
	invite:function(jid,roomid,ticket_id,title)
	{
		CHAT.send($msg({to:jid,from:CHAT.user.jid}).c("x",{xmlns:"jabber:x:conference"}).c("invite",{to:roomid}).c("reason",{ticket_id:ticket_id},title));
	},
	//接受邀请 
	acceptInvite:function(jid)
	{
		
	},
	//拒绝邀请 
	decline:function(roomid,to)
	{
		CHAT.send($msg({form:CHAT.user.jid,to:to}).c("x",{xmlns:"http://jabber.org/protocol/muc#user"}).c("decline",{from:roomid}).c("reason",{},"客服忙"));
	},
	//获取当前时间
	getTime:function()
	{
		var today = new Date();
		var h = today.getHours();
		var m = today.getMinutes();
		var s = today.getSeconds();
		h = (h>9) ? h.toString() : '0' + h;
		m = (m>9) ? m.toString() : '0' + m;
		s = (s>9) ? s.toString() : '0' + s;
		return h+":"+m+":"+s;
	},
	getUid:function(jid){
		//user_738@192.168.2.80/用户123
		var id = Strophe.getNodeFromJid(jid);
		return id.substr(5);
	}
};
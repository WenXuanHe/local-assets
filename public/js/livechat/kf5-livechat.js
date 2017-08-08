(function()
{

String.prototype.trim = String.prototype.trim || function()
{
    return this.replace(/^\s+|\s+$/g, '');
};

String.prototype.safeString = function()
{
    var $container = $('<div>');

    return $container.text(this).html();
};

window.JSON = window.JSON || {

    stringify: function(object)
    {
        if(object && object.toJSON)
        {
            object = object.toJSON();
        }

        var str = '';
        if($.isArray(object))
        {
            str += '[';
            for(var i = 0; i < object.length; ++i)
            {
                str += JSON.stringify(object[i]) + ','
            }
            str = str.replace(/,$/, '');
            str += ']';
        }
        else if($.isPlainObject(object))
        {
            str += '{';
            for(var key in object)
            {
                if(object.hasOwnProperty(key))
                {
                    str += '"' + key + '":' + JSON.stringify(object[key]) + ',';
                }
            }
            str = str.replace(/,$/, '');
            str += '}';
        }
        else if(typeof object === 'number')
        {
            str += object;
        }
        else if(typeof object === 'string')
        {
            str += '"' + object + '"';
        }
        else if(object === null)
        {
            str += 'null';
        }
        else
        {
            str += object;
        }

        return str;
    },

    parse: function(jsonStr)
    {
        return eval('(' + jsonStr + ')');
    }
};
jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie 
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString();
        }
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};

navigator.getBrowserName = function()
{
    var name = "netscape";
    var ag = navigator.userAgent.toLowerCase();
    if (/(msie|firefox|opera|chrome|netscape)\D+(\d[\d.*])/.test(ag)) 
    {
        var n = RegExp.$1;
        var v = parseInt(RegExp.$2);
        name = n;
        if (n == "msie") 
        {
            name += " " + v;
        }
    } 
    else if (/version\D+(\d[\d.]*).*safari/.test(ag)) 
    {
        name = "safari";
    }
    return name;
};

Date.prototype.format = function(format, UTC)
{
    var parts = format.split(''),
        key, value, ret = '';

    for(var i = 0; i < parts.length; i++)
    {
        key = parts[i];
        switch(key)
        {
            case 'Y':
                value = this['get' + (UTC ? 'UTC' : '') + 'FullYear']();
            break;

            case 'm':
                value = ('0' + (this['get' + (UTC ? 'UTC' : '') + 'Month']() + 1)).slice(-2);
            break;

            case 'd':
                value = ('0' + this['get' + (UTC ? 'UTC' : '') + 'Date']()).slice(-2);
            break;

            case 'h':
                value = ('0' + this['get' + (UTC ? 'UTC' : '') + 'Hours']()).slice(-2);
            break;

            case 'i':
                value = ('0' + this['get' + (UTC ? 'UTC' : '') + 'Minutes']()).slice(-2);
            break;

            case 's':
                value = ('0' + this['get' + (UTC ? 'UTC' : '') + 'Seconds']()).slice(-2);
            break;

            default:
                value = key;
        }

        ret += value;
    }

    return ret;
};

function validateEmail(str)
{
    var reg = /^[a-zA-Z0-9!#$%&\'*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&\'*+\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;

    return reg.test(str);
}

var KChat = {};

var Tree = {
    getNewRoot: function(name)
    {
        var root = document.createDocumentFragment();

        root._nodeName = name || 'root';
        $.extend(true, root, NodeMixin);

        return root;
    },

    getNewNode: function(name)
    {
        name = name || 'node';
        var parts = name.split(':'),
            nodeName = parts[0],
            uid = parts[1];

        var node = document.createElement(nodeName);
        $.extend(true, node, NodeMixin);

        if(uid)
        {
            node.setUID(uid);
        }

        return node;
    }
};

var NodeMixin = {

    _nodeType: 'treeNode',

    getNewNode: Tree.getNewNode,

    setUID: function(uid)
    {
        this.uid = uid;

        return this;
    },

    getName: function()
    {
        return ((this.nodeType === 1 ? this.nodeName : this._nodeName) 
                + (this.uid != 0 ? ':' + this.uid : '')).toLowerCase();
    },

    getPath: function()
    {
        var path = this.getName();

        if(this.parentNode)
        {
            path = this.parentNode.getPath() + '.' + path;
        }

        return path.toLowerCase();
    },

    getNodeByPath: function(path, create)
    {
        var parts = path.split('.'),
            node = this, temp;

        for(var i = 0; i < parts.length; i++)
        {
            temp = node.getChild(parts[i]);

            if(!temp && create)
            {
                temp = node.addChild(parts[i])
            }

            node = temp

            if(!node)
            {
                break;
            }
        }

        return node;
    },

    getChild: function(name)
    {
        var parts = name.split(':'),
            name = parts[0],
            uid = parts[1];

        if(this.childNodes.length)
        {
            var node;
            for(var i = 0; i < this.childNodes.length; ++i)
            {
                node = this.childNodes[i];

                if(name === node.nodeName.toLowerCase())
                {
                    if(uid === undefined)
                    {
                        return node;
                    }
                    else
                    {
                        if(node.uid == uid)
                        {
                            return node;
                        }
                    }
                }
            }
        }
    },

    addChild: function(child)
    {
        var name = 'node';

        if(child.nodeType)
        {
            name = child.nodeName;
        }
        else
        {
            name = child;
            child = this.getNewNode(child);
        }

        if(this.getChild(name))
        {
            console.error(this + '.' + name + ', 此节点已存在！');
        }
        else
        {
            this.appendChild(child);
            $(this).triggerHandler('addChild', child);
        }

        return child;
    },

    input: function(data)
    {
        for(var key in data)
        {
            this.set(key, data[key]);
        }
    },

    set: function(key, value)
    {
        $(this).data(key, value);
        $(this).trigger('propertyChange', key);

        return value;
    },

    get: function(key)
    {
        return $(this).data(key);
    }
};

var RootMixin = {

    socket: null,

    init: function(options)
    {
        this.options = options;
        this.initSocket();
        this.initModules();
        this.initActions();

        return this;
    },

    initSocket: function()
    {
        this.socket = io(
                    (this.options.socket.secure ? 'https' : 'http') + '://' 
                    + this.options.socket.host + ':' + this.options.socket.port, 
                    {
                        secure: this.options.socket.secure,
                        query: this.options.socket.query
                    }
                );

        return this;
    },

    /**
     * 初始化相关模块
     * @return {[type]} [description]
     */
    initModules: function()
    {
        
        return this;
    },

    initActions: function()
    {
        var self = this;

        this.socket.on('message', function(message)
        {
            self.handleMessage(message);
        });

        // this.socket.on('connect', function()
        // {
        //     self.send({
        //         __type: 'cookie',
        //         referrer: 'dashboard.zopim.com',
        //         status: 'online',
        //         key: 'thisiskey',
        //         username: '384069799@qq.com',
        //     });
        // });
    },

    handleMessage: function(message)
    {
        message = this._unpack(message);
        
        if(KChat.debug)
        {
            console.log(JSON.parse(JSON.stringify(message)));
        }

        if(message.path === 'livechat.api')
        {
            this.getNodeByPath(message.path, true).input(message);
        }
        else
        {
            this.getNodeByPath(message.path, true).input(message.update);
        }
    },

    _unpack: function(data)
    {
        if(typeof data === 'string')
        {
            data = JSON.parse(data);
        }

        return data;
    },

    _pack: function(data)
    {
        if(typeof data !== 'string')
        {
            data = JSON.stringify(data);
        }

        return data;
    },

    send: function(data)
    {
        if(KChat.debug)
        {
            console.warn(data)
        }

        this.socket.emit('message', this._pack(data));
    },

    sendOfflineMessage: function(message)
    {
        this.send({
            path: ['livechat', 'offline_msg'],
            value: message
        });
    },

    createChannel: function(role, userID)
    {
        var path = ['livechat', 'channels', 'channel'];

        if(!this.socket.connected)
        {
            $(this).trigger('disconnectedError', {cmd: 'createChannel', data: role + ':' + userID});
            return;
        }

        this.send({
            path: path,
            value: {
                role: role,
                userID: userID
            }
        });
    },

    isSelf: function(uid)
    {
        var user_id = root.getNodeByPath('livechat.profile').get('id');

        if(uid)
        {
            return user_id == uid;
        }

        return true;
    }
};

var ChannelsMixin = {

    init: function()
    {
        this.setupTimer();

        $(this).on('tick', function()
        {
            for(var i = 0; i < this.childNodes.length; ++i)
            {
                if(this.childNodes[i].channelID)
                {
                    this.childNodes[i].updateDuration();
                }
            }
        });
    },

    setupTimer: function()
    {
        var self = this;

        if(this.timer)
        {
            clearInterval(this.timer);
        }

        this.timer = setInterval(function()
        {
            $(self).triggerHandler('tick');
        }, 1000);
    },

    removeChannel: function(channel)
    {
        channel = channel.nodeType ? channel : this.getNodeByPath(channel);

        this.removeChild(channel);

        $(this).triggerHandler('channelRemoved', channel);
    },

    getChild: function(name, create)
    {
        var parts = name.split(':'),
            nodeName = parts[0],
            uid = parts[1];

        var channel = NodeMixin.getChild.apply(this, arguments);

        if(!channel && +uid)
        {
            channel = NodeMixin.getChild.call(this, 'channel:0');

            channel && channel.setUID(uid);
        }

        return channel;
    },

    getNewNode: function(channel)
    {
        var node = Tree.getNewNode(channel);

        $.extend(true, node, ChannelMixin);

        node.init();

        return node;
    },

    getChannelList: function()
    {
        return this.childNodes;
    },

    activateChannel: function(channel)
    {
        channel = channel.nodeType ? channel : this.getChannelByID(channel);

        var activeChannel = this.getActiveChannel(true);
            activeChannel && activeChannel.deactivate();

        channel.activate();

        return this;
    },

    openNewRequest: function(channel)
    {
        if(!channel.nodeType)
        {
            channel = this.getChannelByID(channel);
        }        

        if(channel.isNew())
        {
            channel.sendOpen();
        }
        else if(channel.isEnd())
        {
            this.activateChannel(channel);
        }
    },

    getChannelByID: function(channelID)
    {
        var channel = this.getChild('channel:' + channelID);

        if(!channel)
        {
            channel = this.getNewNode('channel:' + channelID);
        }

        return channel;
    },

    getDefaultChannel: function()
    {
        return this.getNodeByPath('channel:0', true);
    },

    getActiveChannel: function(noDefault)
    {
        var channelList = this.childNodes,
            channel;

        if(channelList.length)
        {
            for(var i = 0; i < channelList.length; ++i)
            {
                if(channelList[i].isActive())
                {
                    channel = channelList[i];
                    break;
                }
            }

            if(!noDefault && !channel && channelList.length)
            {
                channel = channelList[0];
            }
        }
        else if(!noDefault)
        {
            channel = this.getDefaultChannel();
        }

        channel && !channel.isActive() && channel.activate();

        return channel;
    },

    toJSON: function()
    {
        var arr = [];

        for(var i = 0; i < this.childNodes.length - 1; ++i)
        {
            arr.push(this.childNodes[i].toJSON());
        }

        return arr;
    }
};

/**
 * 聊天室
 * @type {Object}
 */
var ChannelMixin = {

    view: null,

    channelID: null,

    // channelName: '',

    chatLog: null,

    unreadCount: 0,

    duration: 0,

    setUID: function(uid)
    {
        this.uid = uid;
        this.channelID = this.uid;
    },

    getVisitor: function()
    {
        var vid = this.get('visitor_id');

        return vid && root.getNodeByPath('livechat.visitors.visitor:' + vid);
    },

    updateDuration: function(duration)
    {
        if(duration)
        {
            this.duration = duration;
        }
        else
        {
            if(!this.isEnd() && !this.isClosed())
            {
                ++this.duration;                
            }
        }

        $(this).trigger('durationChange', this);
    },

    init: function()
    {
        this.channelID = this.getName().split(':')[1];
        this.chatLog = [];

        this.initActions();
    },

    loadChatLog: function(log)
    {
        this.chatLog = log;

        return this;
    },

    isTransfer: function()
    {
        return this.get('isTransfer');
    },

    isNew: function()
    {
        return !this.get('status') || this.get('status') == 'new';
    },

    isOpen: function()
    {
        return this.get('status') == 'open';
    },

    isEnd: function()
    {
        return this.get('status') == 'end';
    },

    isClosed: function()
    {
        return this.get('status') == 'close';
    },

    log: function(message)
    {
        this.chatLog.push(message);

        return this;
    },

    findMessageByKey: function(key, value)
    {
        var message;
        for(var i = 0; i < this.chatLog.length; i++)
        {
            message = this.chatLog[i];

            if(message[key] === value)
            {
                break;
            }
            else
            {
                message = null;
            }
        }

        return message;
    },

    updateMessage: function(message, data)
    {
        for(var key in data)
        {
            if(data.hasOwnProperty(key))
            {
                message[key] = data[key];
            }
        }

        $(message).triggerHandler('update');

        return this;
    },

    initActions: function()
    {
        $(this).on('propertyChange', function(e, key)
        {
            var data = this.get(key);
            switch(key)
            {
                case 'chat_memberjoin':
                    this.handleMemberJoin(new Message({
                        type        : 'chat.memberjoin',
                        timestamp   : data.timestamp,
                        msg         : data.display_name + ' 加入会话',
                        display_name: data.display_name,
                        user_id     : data.user_id,
                        role        : data.role
                    }));
                    break;

                case 'chat_memberleave':
                    this.handleMemberLeave(new Message({
                        type        : 'chat.memberleave',
                        timestamp   : data.timestamp,
                        msg         : data.display_name + ' 离开会话',
                        display_name: data.display_name,
                        user_id     : data.user_id,
                        role        : data.role
                    }));
                    break;

                case 'chat_msg':
                    this.handleChatMessage(new Message({
                        type        : 'chat.msg',
                        timestamp   : data.timestamp,
                        msg         : data.msg,
                        display_name: data.display_name,
                        user_id     : data.user_id,
                        role        : data.role
                    }));
                    break;

                case 'chat_ai':
                    this.handleChatMessage(new Message({
                        type        : 'chat.ai',
                        timestamp   : data.timestamp,
                        msg         : data.msg,
                        'documents' : data.documents,
                        display_name: '',
                        user_id     : data.user_id,
                        role        : data.role
                    }));
                    break;

                case 'chat_upload':
                    var msg = Message.findBy('verification', data.v);

                    if(msg)
                    {
                        this.updateMessage(msg, data);

                        if(!this.findMessageByKey('verification', data.v))
                        {
                            this.handleChatMessage(msg);
                        }
                    }
                    else
                    {
                        this.handleChatMessage(new Message({
                            id          : data.id,
                            type        : 'chat.upload',
                            timestamp   : data.timestamp,
                            msg         : data.msg,
                            display_name: data.display_name,
                            user_id     : data.user_id,
                            role        : data.role,
                            verification: data.v
                        }));
                    }
                    break;

                case 'chat_system':
                    this.handleSystemInfo(new Message({
                        type: 'chat.system',
                        msg: data.msg
                    }));
                    break;

                case 'history':
                    this.handleChatHistory(data);
                    break;

                case 'typing':
                    this.handleTyping(data);
                    break;

                case 'name':
                    this.handleChannleName(data);
                    break;

                case 'status':
                    this.handleStatusChange(data);
                    break;

                case 'created':
                    this.handleCreatedTime(data);
                    break;

                case 'rating':
                    $(this).trigger('ratingChange', data);
                    break;
            }
        });
    },

    handleCreatedTime: function(timestamp)
    {
        timestamp = parseInt(timestamp);
        timestamp = timestamp < 1e10 ? timestamp * 1000 : timestamp;

        this.updateDuration(Math.floor((Date.now() - timestamp) / 1000));
    },

    handleStatusChange: function(data)
    {
        var self = this;
        
        setTimeout(function()
        {
            $(self).trigger('channelStatusChange', self);
        });
    },

    handleChatHistory: function(historyLog)
    {
        this.chatLog = [];

        historyLog = historyLog.reverse();
        for(var i = 0; i < historyLog.length; ++i)
        {
            this.chatLog.unshift(new Message(historyLog[i]));
        }

        $(this).trigger('historyMessageLoaded', this);
    },

    isActive: function()
    {
        return this.get('active');
    },

    activate: function()
    {
        this.set('active', true);
        $(this).trigger('channelActivate', this);

        this.updateUnreadCount(0);
    },

    sendOpen: function()
    {
        if(this.isNew())
        {
            root.send({
                path: ['livechat', 'channels', this.getName(), 'open']
            });
        }
    },

    transfer: function(agentID)
    {
        if(agentID)
        {
            root.send({
                path: ['livechat', 'channels', this.getName(), 'transfer'],
                value: {
                    to_agent_id: agentID
                }
            });
        }
    },

    deactivate: function()
    {
        this.set('active', false);
        $(this).trigger('channelDeactivate', this);
    },

    handleMemberJoin: function(message)
    {
        this.log(message);

        if(!this.isActive())
        {
            this.updateUnreadCount();
        }

        $(this).trigger('memberJoin', message);
    },

    handleMemberLeave: function(message)
    {
        this.log(message);

        if(!this.isActive())
        {
            this.updateUnreadCount();
        }

        $(this).trigger('memberLeave', message);
    },

    handleSystemInfo: function(message)
    {
        this.log(message);

        if(!this.isActive())
        {
            this.updateUnreadCount();
        }

        $(this).trigger('sysinfo', message);
    },

    handleChatMessage: function(message)
    {
        this.log(message);

        if(!this.isActive())
        {
            this.updateUnreadCount();
        }

        $(this).trigger('newChatMessage', message);
    },

    updateUnreadCount: function(count)
    {
        if(typeof count === 'number')
        {
            this.unreadCount = count;
        }
        else
        {
            ++this.unreadCount;
        }
        
        $(this).trigger('unreadChange', this.unreadCount);
    },

    sendChatMessage: function(message)
    {
        if(this.isEnd())
        {
            $(this).trigger('channelEndedError', {cmd: 'sendChatMessage', data: message});
            return;
        }

        var path = ['livechat', 'channels', this.getName(), 'log'];

        if(!root.socket.connected)
        {
            $(this).trigger('disconnectedError', {cmd: 'sendChatMessage', data: message});
            return;
        }

        root.send({
            path: path,
            value: {
                type: message.type,
                msg: message.msg,
                display_name: message.display_name,
                timestamp: Math.floor(message.timestamp / 1000),
                v: message.verification
            }
        });

        if(this.channelID === 'ai')
        {
            this.handleChatMessage(message);
        }
        
        return message;
    },

    updateChatMessage: function(message)
    {
        if(this.isEnd())
        {
            $(this).trigger('channelEndedError', {cmd: 'updateChatMessage', data: message});
            return;
        }

        var path = ['livechat', 'channels', this.getName(), 'upload'];

        if(!root.socket.connected)
        {
            $(this).trigger('disconnectedError', {cmd: 'updateChatMessage', data: message});
            return;
        }

        root.send({
            path: path,
            value: message
        });

        return message;
    },

    sendUpdateVisitorProfile: function(data)
    {
        root.send($.extend(data, {__type: 'update_visitor', visitor_id: this.get('visitor_id')}));
    },

    getProfile: function()
    {
        var profile = root.getNodeByPath('livechat.profile', true);

        return profile;
    },

    isStartedBySelf: function()
    {
        var profile = this.getProfile();

        return !this.get('started_by_id') || profile.get('role') === this.get('started_by') &&
                profile.get('id') == this.get('started_by_id');
    },

    sendMemberJoin: function()
    {
        var display_name = this.getProfile().get('display_name') || 'agent';
        var message = new Message({
            type: 'chat.memberjoin',
            display_name: display_name,
            msg: display_name + ' 加入会话'
        });

        if(this.channelID)
        {
            root.send({
                path: ['livechat', 'channels', this.getName(), 'member_join'],
                value: {
                    display_name: message.display_name,
                    timestamp: message.timestamp
                }
            });
        }            

        // this.handleMemberJoin(message);
    },

    sendMemberLeave: function()
    {
        var message = new Message({
            type: 'chat.memberleave',
            display_name: this.getProfile().get('display_name')
        });

        root.send({
            path: ['livechat', 'channels', this.getName(), 'member_leave'],
            value: {
                display_name: message.display_name,
                timestamp: message.timestamp
            }
        });

        // this.handleMemberJoin(message);
    },

    sendEndChat: function()
    {
        if(this.channelID && !this.isEnd() && !this.isClosed())
        {
            root.send({
                path: ['livechat', 'channels', this.getName(), 'end'],
                value: {
                    display_name: root.getNodeByPath('livechat.profile').get('display_name')
                }
            });
        }
    },

    sendCloseChannel: function()
    {
        if(this.channelID)
        {
            root.send({
                path: ['livechat', 'channels', this.getName(), 'close'],
                value: {
                    display_name: root.getNodeByPath('livechat.profile').get('display_name')
                }
            });
        }
    },

    sendTyping: function(typing)
    {
        if(this.channelID && !this.isEnd())
        {
            root.send({
                path: ['livechat', 'channels', this.getName(), 'typing'],
                value: {
                    typing: typing,
                    display_name: root.getNodeByPath('livechat.profile').get('display_name')
                }
            });
        }
    },

    sendRating: function(data)
    {
        if(this.channelID && !this.isEnd())
        {
            root.send({
                path: ['livechat', 'channels', this.getName(), 'rating'],
                value: {
                    rating: data.rating,
                    display_name: root.getNodeByPath('livechat.profile').get('display_name')
                }
            });
        }
    },

    handleTyping: function(data)
    {
        $(this).trigger('receiveTyping', data);
    },

    handleChannleName: function(name)
    {
        $(this).trigger('channelNameChange', this);
    },

    // addTicket: function(ticket)
    // {
    //     var tickets = this.get('tickets') || [];

    //     tickets.push(ticket);

    //     this.set('tickets', tickets);

    //     root.send({
    //         path: ['livechat', 'channels', this.getName(), 'create_ticket'],
    //         value: {
    //             ticket_id: ticket.id
    //         }
    //     });
    // },

    toJSON: function()
    {
        return {
            id: this.channelID,
            name: this.get('name'),
            status: this.get('status'),
            visitor_id: this.get('visitor_id'),
            created: this.get('created'),
            duration: this.duration,
            unreadCount: this.unreadCount,
            chatLog: this.chatLog.slice()
        };
    }
};


// 消息对象
function Message(data)
{
    $.extend(this, data);

    this.timestamp = (this.timestamp < 1e10 ? this.timestamp * 1000 : this.timestamp) || Date.now();
    this.verification = this.verification || (this.timestamp + ':' + Math.round(Math.random() * 1000));

    Message.log(this);
}

Message.queue = [];
Message.log = function(message)
{
    Message.queue.push(message);
};
Message.findBy = function(key, value)
{
    var message;

    for(var i = 0; i < Message.queue.length; i++)
    {
        message = Message.queue[i];

        if(message[key] === value)
        {
            break;
        }
        else
        {
            message = null;
        }
    }

    return message;
};

Message.prototype = {

    getTimestamp: function()
    {
        var timestamp = this.timestamp;

        return (timestamp < 1e10 ? timestamp * 1000 : timestamp) || Date.now();
    },

    type: 'chat.msg', // (chat.msg | chat.memberjoin | chat.memberleave | chat.system | chat.upload),
    timestamp: 0,
    status: 1,
    verification: null,
    msg: '',

    display_name: '',
    user_id: 0,
    role: '' // (agent | visitor)
};

var UserMixin = {

    name: '',
    role: '',
    user_id: 0
};

var root = Tree.getNewRoot();
    $.extend(true, root, RootMixin);

// KChat.debug = true;

KChat.Tree = Tree;
KChat.root = root;
KChat.Message = Message;
KChat.validateEmail = validateEmail;
KChat.ChannelsMixin = ChannelsMixin;

window.KChat = KChat;

})();
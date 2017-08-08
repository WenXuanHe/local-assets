function livechatAgentInit(view, application)
{
    var store = application.container.lookup('store:main');
    var livechat = KChat.root.getNodeByPath('livechat', true);

    // 聊天室
    var channels = KChat.Tree.getNewNode('channels');
        $.extend(true, channels, KChat.ChannelsMixin);
        livechat.addChild(channels);
        channels.init();

    var visitors = KChat.root.getNodeByPath('livechat.visitors', true);

    var profile = livechat.getNodeByPath('profile', true);

    var connection = KChat.root.getNodeByPath('connection', true);

    var api = livechat.getNodeByPath('api', true);

    // 在线状态保持
    var prevStatus = $.cookie('livechatOnline-' + application.get('id'));
    if(prevStatus)
    {
        initSocket();
    }

    function initSocket()
    {
        KF5.checkNotifyPermission();

        $.getJSON('/app/kchat/agentPrepare', function(response)
        {
            if(!response.error)
            {
                // todo
                if(!response.data || !response.data.email)
                {
                    console.error('email error');
                }

                KChat.root.init({
                    socket: {
                        host: response.data.agentHost || 'agent-chat.kf5.com',
                        port: response.data.agentPort || 3000,
                        query: {
                            'kchatid': response.data.kchatid
                        },
                        secure: response.data.httpSecure
                    }
                });

                // KChat.root.socket.on('message', function(message)
                // {
                //     console.log(message)
                // });

                KChat.root.socket.on('connect', function()
                {
                    KChat.root.send({
                        __type: 'cookie',
                        referrer: window.location.href,
                        status: 'online',
                        photo: response.data.photo,
                        username:  response.data.email
                    });
                });

                KChat.root.socket.on('disconnect', function(message)
                {
                    // console.log('disconnect:', message)
                    application.set('livechatOnline', false);
                });

                KChat.root.socket.on('error', function(message)
                {
                    console.error('error:', message)
                });
            }
            else
            {
                showNotice(response.message);
            }
        });        
    }

    $(connection).on('propertyChange', function(e, key)
    {
        if(e.target === connection)
        {
            if(key === 'status')
            {
                application.set('livechatOnline', (connection.get(key) == 'connected'));
            }
        }
    });

    // socket 推送的 path: livechat.api 数据，将直接放进 DS.Store
    $(api).on('propertyChange', function(e, key)
    {
        if(key === 'value')
        {
            try
            {
                // 没有对应的model时，不作处理
                store.pushPayload('agent', api.get('value'));
            }
            catch(e)
            {

            }
        }
    });

    view.set(
        'onlineAgents', 
        store.filter('agent', 
            function(agent)
            {
                // 除去自己以外在线的客服
                return agent.get('status') === 'online'
                        && agent.get('id') != application.get('id');
            }
        )
    );

    ///////////////////////////////////////////////////////////////////////
    view._initEvents();

    $(view).on('typing', function(e, typing)
    {
        var channel = channels.getActiveChannel(true);

        channel && channel.sendTyping(typing);
    });

    $(view).on('triggerEditProfile', function(e, profile)
    {
        var channel = channels.getActiveChannel(true);

        if(channel && channel.channelID)
        {
            channel.sendUpdateVisitorProfile(profile);
        }
    });

    $(view).on('triggerSendAttachment', function(e, loader)
    {
        var message = new KChat.Message({
            type: 'chat.upload',
            msg: 'loading'// {type: 'image'}
        });
        var channel = channels.getActiveChannel();

        if(!loader.error)
        {
            loader.onSuccess = function(data, xhr)
            {
                var msg = {
                    id: message.id,
                    v: message.verification
                };

                if(data.error)
                {
                    msg.error = data.error;
                }
                else
                {
                    msg.upload_token = data.data.token;
                }

                $(view).triggerHandler('triggerUpdateMessage', {

                    channel: channel,
                    msg: msg
                });
            };

            $(view).triggerHandler('triggerSendMessage', message);
        }
    });

    $(view).on('fileTypeNotSupported', function(e)
    {
        var channel = channels.getActiveChannel();

        channel.handleSystemInfo(new KChat.Message({
            type: 'chat.system',
            msg: '不支持的文件格式！'
        }));
    });

    $(view).on('triggerSendMessage', function(e, content)
    {
        var channel = channels.getActiveChannel(true);

        if(!channel)
        {
            showNotice('请选择聊天对象！', false);
            return;
        }

        if(channel.isOpen() && !channel.isStartedBySelf())
        {
            channel.sendMemberJoin();
        }

        var message;

        if(content instanceof KChat.Message)
        {
            message = content;
        }
        else
        {
            message = new KChat.Message({
                type: 'chat.msg',
                display_name: KChat.root.getNodeByPath('livechat.profile').get('display_name'),
                msg: content,
                role: 'agent'
            });
        }

        channel.sendChatMessage(message);
    });

    $(view).on('triggerUpdateMessage', function(e, context)
    {
         var channel = context.channel || channels.getActiveChannel();

        channel.updateChatMessage(context.msg);
    });

    $(view).on('statusChange', function(e, status)
    {
        if(status === 'online')
        {
            if(KChat.root.socket)
            {
                !KChat.root.socket.connected && KChat.root.socket.connect();
            }
            else
            {
                initSocket();
            }

            $.cookie('livechatOnline-' + application.get('id'), true, {expires: 30});
        }
        else
        {
            if(KChat.root.socket)
            {
                if(!channels.childNodes.length || confirm('确认要结束所有会话并离线吗？'))
                {
                    KChat.root.send({
                        __type: 'set_agent_status',
                        status: status
                    });

                    KChat.root.socket.disconnect();
                    view.empty();
                    application.send('toggleLivechat');

                    $.cookie('livechatOnline-' + application.get('id'), null);
                }                    
            }
        }
    });

    $(view).on('endChat', function(e)
    {
        var channel = channels.getActiveChannel(true);

        if(channel && confirm('确认要关闭当前会话吗？'))
        {
            // channel.sendEndChat();
            channel.sendCloseChannel();
        }
    });

    $(view).on('banVisitor', function(e, context)
    {
        var channel = channels.getActiveChannel(true);

        if(channel && channel.get('visitor_id'))
        {
            KChat.root.send({
                __type: 'ban_visitor',
                visitor_id: channel.get('visitor_id'),
                reason: context.reason
            });

            var visitor = KChat.root.getNodeByPath('livechat.visitors.visitor:' + channel.get('visitor_id'));

            visitor && visitor.set('banned', true);
        }
    });

    $(view).on('transferVisitor', function(e, context)
    {
        var channel = channels.getActiveChannel(true);

        if(channel && channel.get('visitor_id'))
        {
            channel.transfer(context.agent_id);
        }
    });

    $(view).on('createTicket', function(e)
    {
        var channel = channels.getActiveChannel(true);

        if(channel)
        {
            var chatLog = channel.chatLog.filter(function(message)
                {
                    return ['chat.msg', 
                            'chat.memberjoin', 
                            'chat.memberLeave',
                            'chat.upload',
                            'chat.system'].indexOf(message.type) !== -1;
                });

            if(!chatLog.length)
            {
                showNotice('没有聊天内容！', false);
                return;
            }

            var log = '', msg;
            var user = KChat.root.getNodeByPath('livechat.visitors.visitor:' + channel.get('visitor_id'));

            if(!user.get('kf5_user_id') && !user.get('email'))
            {
                KF5.alert('请提示用户输入邮箱地址才能提交工单！');
                return;
            }


            for(var i = 0; i < chatLog.length; ++i)
            {
                msg = chatLog[i];

                switch(msg.type)
                {
                    case 'chat.msg':
                        log += '<p>' 
                            + new Date(msg.timestamp).format('h:i:s') + '-' + msg.display_name + ':'
                            + '<br />'
                            + msg.msg
                            + '</p>';
                        break;
                    case 'chat.memberjoin':
                        log += '<p>' + msg.display_name + '加入会话</p>';
                        break;
                    case 'chat.memberleave':
                        log += '<p>' + msg.display_name + '离开会话</p>';
                        break;
                    case 'chat.upload':
                        var file = msg.msg;
                        log += '<p>'
                                + new Date(msg.timestamp).format('h:i:s') + '-' + msg.display_name + ':'
                                + '<br />'
                                + (
                                    ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'image'].indexOf(file.type) !== -1
                                    ? '<img src="' + file.url + '" title="' + file.name + '" />'
                                    : '<a href="' + file.url + '" target="_blank">' + file.name + '</a>'
                                    )
                            + '</p>';
                        break;
                    case 'chat.system':

                        if(msg.msg && msg.msg.indexOf('转接') !== -1)
                        {
                            log += '<p>' + msg.msg + '</p>';
                        }

                        break;
                }
            }

            view.send('sendCreateTicket', {
                channelID: channel.channelID,
                name: user.get('display_name'),
                email: user.get('email'),
                kf5_user_id: user.get('kf5_user_id'),
                content: log
            });
        }
    });

    $(view).on('newTicketCreated', function(e, ticket)
    {
        var channel = channels.getChannelByID(ticket.channelID);
        var visitor = channel.getVisitor();
        var tickets = visitor.get('tickets') || [];

        tickets.push(ticket);
        visitor.set('tickets', tickets);
    });

    $(visitors).on('propertyChange', function(e, key)
    {
        if(key === 'tickets')
        {
            var channel = channels.getActiveChannel(true);
            var visitor = channel.getVisitor();
            var node = e.target;

            // 当前激活的用户
            if(visitor.get('id') === node.get('id'))
            {
                view.renderTickets(node.get('tickets'));
            }
        }
            
    });

    ////////////////////////////////////////////////////////////////////////////
    $(livechat).on('propertyChange', function(e, key)
    {
        var node = e.target,
            channel = channels.getActiveChannel(true);

        if(channel && /^visitor/i.test(node.getName()))
        {
            var visitor = node;
            if(visitor.get('id') == channel.get('visitor_id'))
            {
                view.renderVisitorProfile(visitor);

                if(key == 'session')
                {
                    var session = visitor.get('session') || {};

                    if(visitor.get('from'))
                    {
                        session.source = visitor.from;
                    }

                    view.renderVisitorSession(
                        session, 
                        channel.get('type') === 'weixin'
                    );
                }
            }

            if(key == 'display_name')
            {
                setTimeout(function()
                {
                    var channel = visitor.get('channel');

                    if(channel)
                    {
                        channel.set('name', visitor.get('display_name') + ' 会话');
                    }
                });
            }

            if(key === 'banned')
            {
                if(visitor.get('banned'))
                {
                    view.$el('#banVisitor').hide();
                }
            }
        }
    });

    $(channels).on('propertyChange', function(e, key)
    {
        if(e.target.channelID)
        {
            var channel = e.target;

            if(key === 'visitor_id')
            {
                var visitor = KChat.root.getNodeByPath('livechat.visitors.visitor:' + channel.get(key), true);
                visitor && visitor.set('channel', channel);
            }
        }
    });

    $(channels).on('durationChange', function(e, channel)
    {
        if(channel.isActive())
        {
            view.updateDuration(channel.duration);
        }
    });

    $(channels).on('historyMessageLoaded', function(e, channel)
    {
        if(channel.isActive())
        {
            view.renderChatLog(channel.chatLog);
        }
    });

    function notifyNewMessageComming(channel, context)
    {
        // 铃声
        KF5.ringBell();
        application.send('newLivechatMessage');

        // 桌面通知
        if(channel.isNew() && !channel.note)
        {
            channel.note = KF5.showDesktopNotification(
                context.title, 
                context.content,
                context.type
            );

            channel.note && channel.note.on('click', function()
            {
                application.send('toggleLivechat', true);
                channels.openNewRequest(channel);
                channel.note = null;
            });
        }
    }

    $(channels).on('newChatMessage', function(e, message)
    {
        var channel = e.target;
        if(channel.isActive())
        {
            view.renderMessage(message);
        }
        else
        {
            view.updateUnread(channel);
        }

        if(message.type === 'chat.msg' && message.user_id && profile.get('id') != message.user_id)
        {
            notifyNewMessageComming(channel, {
                title: '新在线交谈会话', 
                content: message.display_name + ':' + message.msg,
                type: 'chatMsg'
            });
        }
    });

    $(channels).on('sysinfo', function(e, message)
    {
        var channel = e.target;

        if(channel.isActive())
        {
            view.renderMessage(message);
        }

        notifyNewMessageComming(channel, {
            title: '系统消息', 
            content: message.msg,
            type: 'chatMsg'
        });
    });

    $(channels).on('unreadChange', function(e, message)
    {
        var channel = e.target;
            view.updateUnread(channel);
    });

    $(channels).on('memberJoin', function(e, message)
    {
        var channel = e.target;
        if(channel.isActive())
        {
            view.renderMessage(message);
        }
    });

    $(channels).on('memberLeave', function(e, message)
    {
        var channel = e.target;
        if(channel.isActive())
        {
            view.renderMessage(message);
        }
    });

    $(channels).on('receiveTyping', function(e, data)
    {
        var channel = e.target;

        if(channel.isActive())
        {
            if(data.typing === true)
            {
                view.showTyping(data);
            }
            else if(data.typing === false)
            {
                view.hideTyping(data);
            }
        }
            
    });

    // todo
    $(channels).on('channelNameChange', function(e, channel)
    {
        view.updateChannelName(channel);
    });

    $(channels).on('channelStatusChange', function(e, channel)
    {

        if(channel.isNew())
        {
            if(!$('.kca-notice-content .notice-box[data-channel=' + channel.channelID + ']').length)
            {
                if(channel.isTransfer())
                {
                    $('.kca-notice-content').prepend(
                        '<div data-channel=' + channel.channelID + ' class="notice-box new-redirect">收到一条转接会话</div>'
                    );
                }
                else
                {
                    $('.kca-notice-content').prepend(
                        '<div data-channel=' + channel.channelID + ' class="notice-box new-request">您有一条新消息</div>'
                    );
                }
            }
        }
        else
        {
            var status = channel.get('status');

            switch(status)
            {
                case 'open':

                    channels.activateChannel(channel);

                    break;

                case 'chatting':

                    view.addChannelTab(channel);
                    if(!channels.getActiveChannel(true))
                    {
                        channels.activateChannel(channel);
                    }

                    break;

                case 'end':

                    view.$el('#transferVisitor').hide();

                    if(!$('.kca-notice-content .notice-box[data-channel=' + channel.channelID + ']').length)
                    {
                        view.addChannelTab(channel);
                        if(!channels.getActiveChannel(true))
                        {
                            channels.activateChannel(channel);
                        }

                        var $tab = $('.kca-queuelist-content [data-channel=' + channel.channelID + ']');
                        $tab.removeClass('ongoing').addClass('over');
                    }

                    break;

                case 'close':

                    view.$el('#transferVisitor').hide();

                    channels.removeChannel(channel);
                    channels.getActiveChannel();

                    break;
            }
        }
    });

    $(channels).on('channelRemoved', function(e, channel)
    {
        $('.kca-queuelist-content [data-channel=' + channel.channelID + ']').remove();

        rerenderChannelList();
    });

    $('.kca-notice-content').on('click', '.new-request, .new-redirect', function()
    {
        channels.openNewRequest($(this).data('channel'));
        $(this).remove();
    });

    $('.kca-queuelist-content').on('click', '.queue-box', function()
    {
        if($(this).hasClass('active'))
        {
            return false;
        }

        var channelID = $(this).data('channel');
        channels.activateChannel(channelID);
    });

    $(channels).on('channelDeactivate', function(e, channel)
    {
        view.$('.kca-queuelist-content .queue-box[data-channel=' + channel.channelID + ']').removeClass('active');

        if(!channels.childNodes.length)
        {
            $('.kca-queuelist-content .queue-empty').show();
        }

        view.$('.kca-incoming').hide();
        view.$('.kca-disabled').show();
    });

    $(view).on('panelChange', function(e, pannel)
    {
        var channel = channels.getActiveChannel();

        if(channel)
        {
            renderMainPanel(channel);
        }
    });

    function renderMainPanel(channel)
    {
        if(!view.get('isHistoryActive'))
        {
            view.renderChatLog(channel.chatLog);
        }
        else
        {
            new SocketRequest('/visitors/' + channel.get('visitor_id') + '/history').send()
            .then(function(response)
            {
                view.renderHistory(response, true);
            });
        }
    }

    $(channels).on('channelActivate', function(e, channel)
    {
        if(channel.channelID)
        {
            // 显示聊天框
            application.send('toggleLivechat', true);

            renderMainPanel(channel);

            view.renderVisitor(channel);
            view.renderButtons(channel);

            view.addChannelTab(channel);

            $('.kca-queuelist-content .queue-empty').hide();

            $('.kca-queuelist-content .queue-box[data-channel=' + channel.channelID + ']').addClass('active');
            view.$('.kca-incoming').show();
            view.$('.kca-disabled').hide();

            $('.kca-notice-content [data-channel=' + channel.channelID + ']').remove();
        }            
    });

    if(!channels.getActiveChannel(true))
    {
        view.$('.kca-incoming').hide();
        view.$('.kca-disabled').show();
    }

    function rerenderChannelList()
    {
        var channel = channels.getActiveChannel(true);

        if(!channel || (channels.childNodes.length == 1 && !channel.channelID))
        {
            $('.kca-queuelist-content .queue-empty').show();
            view.$('.kca-incoming').hide();
            view.$('.kca-disabled').show();
        }
    }
}
$(document).ready(function()
{
    var dropbox = new Dropbox();

    /*
        搜索
     */
    var search = dropbox.addPanel('search');
    search.$el.on('click', '[role=submit]', function()
    {
        var question = $('input[name=question]').val();

        searchRequest(question);
    });

    /*
        顶部搜索框功能
     */
    function searchRequest(keyword)
    {
        keyword = keyword.replace(/^\s*|\s*$/, '');

        if(keyword)
        {
            $.getJSON('/supportbox/search', {keyword: keyword}, function(data)
            {
                var resultView = dropbox.getPanel('search-result');

                dropbox.navigate('search-result');
                resultView.render(data);
            });
        }
        else
        {
            alert('请输入关键词！');
        }
    }

    $('.search-btn').click(function()
    {
        var keyword = $(this).parent().find('.search-input').val();

        searchRequest(keyword);
    });

    $('.search-input').on('keydown', function(e)
    {
        if(e.keyCode == 13)
        {
            searchRequest($(this).val());
        }
    });

    /*
        搜索结果
     */
    var result = dropbox.addPanel('search-result');

    result.render = function(data)
    {
        var $articleList = this.$el.find('ul.article-list');

        $articleList.empty();

        for(var i = 0; i < data.length; i++)
        {
            $articleList.append('<li><a target="_blank" href="' 
                +  '/posts/view/' + data[i].id
                + '">' + data[i].title + '</a></li>'
            );
        }
    };

    // 判断是否支持选择方式
    var methodChoose = $('#contact-method').length;

    result.$el.on('click', '.to-support a[role=button]', function()
    {
        if(methodChoose)
        {
            dropbox.navigate('contact-method');
        }
        else
        {
            dropbox.navigate('create-ticket');
        }
    });

    /*
        工单提交
     */
    var ticket = dropbox.addPanel('create-ticket');
    ticket.$el.on('click', '[role="submit"]', function()
    {
        var $form = ticket.$el.find('form'),
            dataArray = $form.serializeArray(),
            dataObject = {};

        ticket.$el.find('.alert-error').hide();

        for(var i = 0; i < dataArray.length; i++)
        {
            dataObject[dataArray[i].name] = dataArray[i].value;
        }

        $.post($form.attr('action'), dataObject, function(data)
        {
            if(data == 'success')
            {
                alert('提交成功');
            }
            else
            {
                ticket.showError(data);
            }
        });
    });

    ticket.showError = function(message)
    {
        ticket.$el.find('.alert-error').show().html(message);
    };

    if(methodChoose)
    {
        // 方式选择
        var method = dropbox.addPanel('contact-method');
        // 交谈信息
        var info = dropbox.addPanel('contact-info');
        // 在线聊天
        var livechat = dropbox.addPanel('livechat-box');

        ////////////////////////////////
        method.$el.find('.method-chat').click(function()
        {
            livechat.checkAgent();
        });

        method.$el.find('.method-ticket').click(function()
        {
            dropbox.navigate('create-ticket');
        });

        ////////////////////////////////

        livechat.checkAgent = function()
        {
            $.get("/supportbox/agentonline", function(data)
            {
                if(data == "failed")
                {
                    dropbox.navigate('create-ticket');
                    ticket.showError("当前没有客服在线！请提交工单让我们处理");
                }
                else
                {
                    dropbox.navigate('contact-info');
                }
                
            });
        };

        livechat.openChat = function(client)
        {
            $.post("/supportbox/chat", client, function(data)
            {
                if(data.error)
                {
                    info.showError(data.message);
                }
                else
                {
                    dropbox.navigate('livechat-box');
                    $.getJSON('/chat/default/Livechat', client, function(response)
                    {
                        if(response && response.user)
                        {
                            var user = response.user;

                            CHAT.user = {
                                jid: "user_" + user.id + "@" + CHAT.SERVER_NAME + "/" + user.name,
                                name: user.name,
                                pw: user.pw,
                                token: user.token,
                                title: client.title
                            };

                            window.AGENT = "user_" + response.agent_id + "@" + CHAT.SERVER_NAME;
                            window.ticket_id = response.ticket_id || 0;

                            // 初始化聊天通道
                            CHAT.init();

                            CHAT_USER.timers.waitingTimer = null;
                            if(window.ticket_id == 0)
                            {
                                CHAT_USER.timers.waitingTimer = setTimeout(function()
                                {
                                    clearTimeout(CHAT_USER.timers.waitingTimer);
                                    if(confirm("客服忙，请提交工单让客服来处理？"))
                                    {
                                        dropbox.navigate('create-ticket');
                                    }
                                }, 30000);
                            }

                            $(CHAT_USER).on('overDialogue', function()
                            {
                                window.parent.kf5SupportBox.close();
                            });
                        }
                    });
                }
            },'json');
        };

        /////////////////////////////////
        info.$el.find('[role="submit"]').click(function()
        {
            var data = {
                email: info.$el.find('input[name="email"]').val().replace(/^\s+|\s+$/g, ''),
                name: info.$el.find('input[name="nickname"]').val().replace(/^\s+|\s+$/g, ''),
                title: info.$el.find('input[name="question"]').val().replace(/^\s+|\s+$/g, '')
            };
            
            livechat.openChat(data);
        });

        info.showError = function(msg)
        {
            this.$el.find('.alert-error').show().html(msg);
        };
    }
    
    // 初始化显示 search
    dropbox.navigate('search');
});
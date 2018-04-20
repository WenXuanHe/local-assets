function _getNewsArticleVersion() {
    var t = /NewsArticle\/([\d\.]*)/i.exec(navigator.userAgent);
    return t ? t[1] : "";
}

function _getAndroidVersion() {
    var t = /android ([0-9\.]*)/i.exec(navigator.userAgent);
    return t ? t[1] : "";
}

function _getIOSVersion() {
    var t = /iPhone OS ([0-9_]*)/i.exec(navigator.userAgent);
    return t ? t[1].replace(/_/g, ".") : "";
}

function _isNewsArticleVersionNoLessThan(t) {
    var e = client.newsArticleVersion;
    return e ? (t = t.split(".").slice(0, 3), e = +e.split(".").slice(0, t.length).join(""),
    e >= +t.join("")) : !1;
}

function hash2string(t) {
    var e = "#";
    for (var a in t) e += a + "=" + t[a] + "&";
    return "&" == e.substr(-1) ? e = e.slice(0, -1) : "#" == e.substr(-1) && (e = ""),
        e;
}

function formatCount(t, e, a) {
    var i = "";
    if ("number" != typeof e || 0 === e) i = a || "赞"; else if (1e4 > e) i = e; else if (1e8 > e) {
        var n = (Math.floor(e / 1e3) / 10).toFixed(1);
        i = (n.indexOf(".0") > -1 || n >= 10 ? n.slice(0, -2) : n) + "万";
    } else {
        var n = (Math.floor(e / 1e7) / 10).toFixed(1);
        i = (n.indexOf(".0") > -1 || n >= 10 ? n.slice(0, -2) : n) + "亿";
    }
    return t && $(t).each(function() {
        $(this).attr("realnum", e).html(i);
    }), i;
}

function commentTimeFormat(t) {
    var e, a = new Date(), i = "";
    try {
        if (e = new Date(1e3 * t), isNaN(e.getTime())) throw new Error("Invalid Date");
    } catch (n) {
        return "";
    }
    return i += e.getFullYear() < a.getFullYear() ? e.getFullYear() + "-" : "", i += e.getMonth() >= 9 ? e.getMonth() + 1 : "0" + (e.getMonth() + 1),
        i += "-", i += e.getDate() > 9 ? e.getDate() : "0" + e.getDate(), i += " ", i += e.getHours() > 9 ? e.getHours() : "0" + e.getHours(),
        i += ":", i += e.getMinutes() > 9 ? e.getMinutes() : "0" + e.getMinutes();
}

function formatDuration(t) {
    if (isNaN(Number(t))) return "00:00";
    var e = [ Math.floor(t / 60), ":", Math.ceil(t % 60) ];
    return e[2] <= 9 && e.splice(2, 0, 0), e[0] <= 9 && e.unshift(0), e.join("");
}

function formatTime(t) {
    var e = 6e4, a = 60 * e, i = new Date(), n = i.getTime(), o = new Date(i.getFullYear(), i.getMonth(), i.getDate()), r = new Date(+t);
    if (isNaN(r.getTime())) return "";
    var s = n - t;
    if (0 > s) return "";
    if (e > s) return "刚刚";
    if (a > s) return Math.floor(s / e) + "分钟前";
    if (24 * a > s) return Math.floor(s / a) + "小时前";
    for (var l = (r.getHours() > 9 ? r.getHours() : "0" + r.getHours()) + ":" + (r.getMinutes() > 9 ? r.getMinutes() : "0" + r.getMinutes()), c = 0; c++ <= 8; ) if (o.setDate(o.getDate() - 1),
        t > o.getTime()) return 1 === c ? "昨天 " + l : 2 === c ? "前天 " + l : c + "天前";
    return (r.getFullYear() < i.getFullYear() ? r.getFullYear() + "年" : "") + (r.getMonth() + 1) + "月" + r.getDate() + "日";
}

function send_umeng_event(t, e, a) {
    var i = "bytedance://" + event_type + "?category=umeng&tag=" + t + "&label=" + e;
    if (a) for (var n in a) {
        var o = a[n];
        if ("extra" === n && "object" == typeof o) if (client.isAndroid) i += "&extra=" + JSON.stringify(o); else {
            var r = "";
            for (var s in o) r += "object" == typeof o[s] ? "&" + s + "=" + JSON.stringify(o[s]) : "&" + s + "=" + o[s];
            i += r;
        } else i += "&" + n + "=" + o;
    }
    try {
        window.webkit.messageHandlers.observe.postMessage(i);
    } catch (l) {
        console.log(i);
    }
}

function send_request(t, e) {
    var a = "bytedance://" + t;
    if (e) {
        a += "?";
        for (var i in e) a += i + "=" + e[i] + "&";
        a = a.slice(0, -1);
    }
    location.href = a;
}

function send_exposure_event_once(t, e, a) {
    function i() {
        o && clearTimeout(o), o = setTimeout(function() {
            var a = n(t, r);
            console.info(a, t), a && (e(), document.removeEventListener("scroll", i, !1));
        }, 50);
    }
    function n(t, e) {
        var i = t.getBoundingClientRect(), n = i.top, o = i.height || i.bottom - i.top, r = n;
        return a && (r = n + o), e > r;
    }
    if (t && "function" == typeof e) {
        var o = 0, r = window.innerHeight;
        n(t, r) ? e() : document.addEventListener("scroll", i, !1);
    }
}

function isElementInViewportY(t, e) {
    var a = t.getBoundingClientRect(), i = window.innerHeight || document.body.clientHeight;
    return e ? a.height < i ? a.top > 0 && a.top < i && a.bottom > 0 && a.bottom < i : a.top < 0 && a.bottom > i : a.top < i && a.bottom > 0;
}

function sendUmengWhenTargetShown(t, e, a, i, n) {
    t && (isElementInViewportY(t, n) ? send_umeng_event(e, a, i) : imprProcessQueue.push(arguments));
}

function buildServerVIcon(t, e) {
    var a = Page.h5_settings.user_verify_info_conf["" + t];
    if (!a) return "";
    if (a = a[e], !a) return "";
    var e = a.icon;
    return e = client.isIOS ? a.web_icon_ios : client.isSeniorAndroid ? a.web_icon_android : a.icon_png,
    '<i class="server-v-icon" style="background-image: url(' + e + ');">&nbsp;</i>';
}

function buildServerVIcon2(t, e) {
    var a = Page.h5_settings.user_verify_info_conf["" + t];
    if (!a) return "";
    if (a = a[e], !a) return "";
    var e = a.icon;
    return e = client.isIOS ? a.web_icon_ios : client.isSeniorAndroid ? a.web_icon_android : a.icon_png,
    '<div class="server-v-icon-wrap"><i class="server-v-icon" style="background-image: url(' + e + ');">&nbsp;</i></div>';
}

function trans_v_info(t) {
    var e = {};
    if (Array.isArray(t.type_config)) for (var a = 0; a < t.type_config.length; a++) {
        var i = t.type_config[a];
        e[i.type] = i;
    }
    return e;
}

function buildPage(t) {
    function e() {
        var e = t.h5_extra, a = {
            font_size: e.font_size || "m",
            image_type: e.image_type || "thumb",
            is_daymode: !!e.is_daymode,
            use_lazyload: !!e.use_lazyload,
            url_prefix: e.url_prefix || "content://com.ss.android.article.base.ImageProvider/"
        };
        return a;
    }
    function a() {
        var t = {
            font_size: getMeta("font_size") || "m",
            image_type: getMeta("load_image") || "thumb",
            is_daymode: getMeta("night_mode") ? !1 : !0,
            use_lazyload: "undefined" == typeof close_lazyload ? !0 : !1,
            url_prefix: "undefined" == typeof url_prefix ? "content://com.ss.android.article.base.ImageProvider/" : url_prefix
        };
        return t;
    }
    function i() {
        var t = {
            font_size: hash("tt_font") || "m",
            image_type: hash("tt_image") || "thumb",
            is_daymode: "1" == hash("tt_daymode"),
            use_lazyload: !!parseInt(getMeta("lazy_load")),
            url_prefix: "undefined" == typeof url_prefix ? "content://com.ss.android.article.base.ImageProvider/" : url_prefix
        };
        return t;
    }
    var n = {
        v55: {
            android: a(),
            ios: i()
        },
        v60: {
            ios: e(),
            android: e()
        }
    }, o = {
        article: {},
        author: {},
        tags: [],
        h5_settings: {},
        statistics: {},
        pageSettings: {}
    }, r = {
        getArticleType: function() {
            var e = "zhuanma";
            if ("object" == typeof t.wenda_extra) e = "wenda"; else if ("object" == typeof t.forum_extra) e = "forum"; else if ("object" == typeof t.h5_extra) {
                var a = t.h5_extra.media;
                "object" == typeof a && null !== a && 0 != a.id && (e = "pgc");
            }
            return e;
        },
        wenda: function() {
            var e = t.wenda_extra, a = e.user || {};
            t.wenda_extra.title = _.escape(t.wenda_extra.title), o.article = {
                title: e.title,
                publishTime: e.show_time
            }, o.author = {
                userId: a.user_id,
                name: a.user_name,
                link: o.h5_settings.is_liteapp ? "javascript:;" : a.schema,
                intro: a.user_intro,
                avatar: a.user_profile_image_url,
                isAuthorSelf: !1,
                verifiedContent: a.is_verify ? "PLACE_HOLDER" : ""
            };
            var i = {
                auth_type: "",
                auth_info: ""
            };
            try {
                i = JSON.parse(a.user_auth_info);
            } catch (n) {}
            o.author.auth_type = a.user_auth_info ? i.auth_type || 0 : "", o.author.auth_info = i.auth_info,
            "is_following" in e && (o.author.followState = e.is_following ? "following" : ""),
                o.wenda_extra = e, o.wenda_extra.aniok = client.isSeniorAndroid;
        },
        forum: function() {
            var e = t.forum_extra, a = e.user_info || {};
            e.forum_info || {}, o.article = {
                title: e.thread_title || "",
                publishTime: formatTime(1e3 * e.publish_timestamp)
            }, o.author = {
                userId: a.id,
                name: a.name,
                link: "",
                avatar: a.avatar_url,
                isAuthorSelf: !!e.is_author,
                verifiedContent: a.verified_content
            };
            var i = {
                auth_type: "",
                auth_info: ""
            };
            try {
                i = JSON.parse(a.user_auth_info);
            } catch (n) {}
            o.author.auth_type = a.user_auth_info ? i.auth_type || "0" : "", o.author.auth_info = i.auth_info,
            "is_following" in e && (o.author.followState = e.is_following ? "following" : "");
            var r = [];
            "object" == typeof a.media && a.media.name && r.push(a.media.name), a.verified_content && r.push(a.verified_content),
                o.author.intro = r.join("，"), o.tags = e.label_list, o.forum_extra = e, o.forumStatisticsParams = {
                value: e.thread_id,
                ext_value: e.forum_id,
                extra: {
                    enter_from: e.enter_from,
                    concern_id: e.concern_id,
                    refer: e.refer,
                    group_type: e.group_type,
                    category_id: e.category_id
                }
            };
        },
        pgc: function() {
            var e = t.h5_extra, a = e.media || {};
            o.article = {
                title: e.title,
                publishTime: e.publish_stamp ? formatTime(1e3 * e.publish_stamp) : e.publish_time
            }, o.author = {
                userId: e.media_user_id,
                mediaId: a.id,
                name: a.name,
                link: "sslocal://media_account?refer=all&source=article_top_author&media_id=" + a.id,
                intro: a.description,
                avatar: a.avatar_url,
                isAuthorSelf: !!e.is_author
            }, (o.h5_settings.is_liteapp || !e.media_user_id) && (o.author.link = "bytedance://media_account?refer=all&media_id=" + a.id + "&loc=0&entry_id=" + a.id);
            var i = {
                auth_type: "",
                auth_info: ""
            };
            try {
                i = JSON.parse(a.user_auth_info);
            } catch (n) {}
            o.author.auth_type = a.user_auth_info ? i.auth_type || 0 : "", o.author.auth_info = i.auth_info,
                o.author.verifiedContent = a.user_verified && o.author.auth_info || "", "is_subscribed" in e && (o.author.followState = e.is_subscribed ? "following" : ""),
            e.is_original && o.tags.push("原创");
        },
        zhuanma: function() {
            var e = t.h5_extra;
            o.article = {
                title: e.title,
                originalLink: e.src_link,
                publishTime: e.publish_time || "0000-00-00 00:00"
            }, o.author.name = e.source;
        },
        common: function() {
            var e = t.h5_extra;
            !e.is_original && e.original_media_id && (o.original = {
                link: "bytedance://media_account?media_id=" + e.original_media_id + "&entry_id=" + e.original_media_id,
                name: e.original_media_name || ""
            }), "custom_style" in t && (o.customStyle = t.custom_style), "novel_data" in e && (o.novel_data = e.novel_data);
            var a = e.ab_client || [];
            o.topbuttonType = "pgc" !== o.article.type || a.indexOf("f7") > -1 ? "concern" : "digg";
            try {
                o.h5_settings = "object" == typeof e.h5_settings ? e.h5_settings : JSON.parse(e.h5_settings);
            } catch (i) {
                o.h5_settings = {};
            }
            if (o.h5_settings.pgc_over_head = !!o.h5_settings.pgc_over_head && "pgc" === o.article.type,
                    o.h5_settings.is_liteapp = !!e.is_lite, o.h5_settings.pgc_recommend_connect_fe = !0,
                    o.h5_settings.user_verify_info_conf) {
                if ("string" == typeof o.h5_settings.user_verify_info_conf) try {
                    o.h5_settings.user_verify_info_conf = JSON.parse(o.h5_settings.user_verify_info_conf);
                } catch (i) {
                    o.h5_settings.user_verify_info_conf = {};
                }
                o.h5_settings.user_verify_info_conf = trans_v_info(o.h5_settings.user_verify_info_conf),
                    o.useServerV = !0;
            } else o.useServerV = !1;
            o.hasExtraSpace = !o.h5_settings.is_liteapp && o.h5_settings.pgc_recommend_connect_fe && "pgc" === o.article.type && client.isSeniorAndroid,
                o.hideFollowButton = !!e.hideFollowButton, o.statistics = {
                group_id: e.str_group_id || e.group_id || "",
                item_id: e.str_item_id || e.item_id || ""
            };
        }
    };
    "object" != typeof t && (t = window);
    var s = r.getArticleType();
    return o.article.type = s, r.common(), window.OldPage && (o.hasExtraSpace = OldPage.hasExtraSpace),
        r[s](), o.pageSettings = n[APP_VERSION][CLIENT_VERSION], o.article.type = s, o;
}

function buildHeader(t) {
    var e = renderHeader({
        data: t
    }), a = $("header");
    a.length <= 0 ? $(document.body).prepend(e) : a.replaceWith(e);
}

function buildArticle(t) {
    document.body.classList.add(Page.article.type), document.body.classList.add(CLIENT_VERSION),
        document.body.classList.add(APP_VERSION), "string" == typeof t && $("article").html(t),
    "wenda" === Page.article.type && processWendaArticle(), "forum" === Page.article.type && processForumArticle();
}

function buildFooter(t) {
    var e = renderFooter({
        data: t
    }), a = $("footer");
    a.length > 0 ? a.replaceWith(e) : $(document.body).append(e);
}

function processWendaArticle() {
    var t, e = Page.wenda_extra, a = e.show_post_answer_strategy || {}, i = e.wd_version || 0, n = Page.h5_settings.is_liteapp, o = "show_top" in a && !n, r = "show_default" in a && !n, s = {
        value: e.qid,
        ext_value: e.nice_ans_count,
        extra: {
            enter_from: e.enter_from,
            ansid: e.ansid,
            parent_enterfrom: e.parent_enterfrom || ""
        }
    };
    if (window.assignThroughWendaNiceanscount = function(t) {
            s.ext_value = t;
        }, 1 > i || i >= 3 && 1 == e.showMode) $("header").find(".tt-title").remove(); else {
        t = $(o ? '<div class="wt">' + e.title + '</div><div class="ft"><span class="see-all-answers" id="total-answer-count"></span><span class="hide-placeholder">&nbsp;</span></div><a class="big-answer-buttoon go-to-answer" href="' + a.show_top.schema + '">' + a.show_top.text + '</a><div class="big-answer-buttoon-gap"></div>' : r ? '<div class="wt">' + e.title + '</div><div class="ft"><a class="go-to-answer go-to-answer-small" href="' + a.show_default.schema + '">回答</a><span class="see-all-answers" id="total-answer-count"></span></div>' : '<div class="wt">' + e.title + '</div><div class="ft"><span class="see-all-answers" id="total-answer-count"></span><span class="hide-placeholder">&nbsp;</span></div>');
        var l = o ? "bigans" : r ? "smlans" : "noans";
        if ($("header").find(".tt-title").removeClass("tt-title").addClass("wenda-title " + l).html(t).on("click", function() {
                "need_return" in e ? e.need_return ? ToutiaoJSBridge && ToutiaoJSBridge.call("close") : window.location.href = e.list_schema : [ "click_answer", "click_answer_fold" ].indexOf(e.enter_from) > -1 ? ToutiaoJSBridge && ToutiaoJSBridge.call("close") : window.location.href = e.list_schema;
            }), new PressState({
                bindSelector: ".wenda-title,.big-answer-buttoon",
                exceptSelector: ".go-to-answer-small,.see-all-answers",
                pressedClass: "pressing",
                removeLatency: 500
            }), o ? (send_umeng_event("answer_detail", "top_write_answer_show", s), $(".go-to-answer").on("click", function(t) {
                t.stopPropagation(), send_umeng_event("answer_detail", "top_write_answer", s);
            })) : r && (send_umeng_event("answer_detail", "wirte_answer_show", s), $(".go-to-answer").on("click", function(t) {
                    t.stopPropagation(), send_umeng_event("answer_detail", "wirte_answer", s);
                })), "show_bottom" in a && $("article").height() > 2 * window.innerHeight && !n) {
            var c = $('<a href="' + a.show_bottom.schema + '" class="bottom-big-answer-button"><div class="pl wdi iconfont">&#xe62f;</div><div class="pr"><div class="wdq">' + e.title + '</div><div class="wds">' + a.show_bottom.text + "</div></div></a>");
            setTimeout(function() {
                $("footer").append(c), c.on("click", function() {
                    send_umeng_event("answer_detail", "bottom_write_answer", s);
                }), send_exposure_event_once(c.get(0), function() {
                    send_umeng_event("answer_detail", "bottom_write_answer_show", s);
                }, !0);
            }, 500);
        }
    }
    $("#wenda_index_link").on("click", function() {
        [ "click_answer", "click_answer_fold" ].indexOf(e.enter_from) > -1 ? ToutiaoJSBridge.call("close") : location.href = e.list_schema;
    });
}

function processForumArticle() {
    var t = $("article p").eq(0);
    "" !== t.text() ? t.addClass("first-forum-p") : (t.before('<p class="first-forum-p">'),
        t = t.prev()), Page.article.title && t.prepend("【" + Page.article.title + "】"),
    Page.forum_extra.forum_info && t.prepend('<span href="' + Page.forum_extra.forum_info.schema + '">#' + Page.forum_extra.forum_info.name + "#</span>"),
    "" === t.text() && t.remove();
    var e = "inline";
    $(".poi").length > 0 ? $(".poi").each(function(t, a) {
        var i = a.textContent;
        $(a).closest(".tt-repost-thread").length > 0 ? ($(a).replaceWith('<p class="poi" style="overflow: hidden;"><span class="location">' + i + "</span></p>"),
        0 === $("article>.poi").length && $("article").append('<p class="poi" style="overflow: hidden;"><span style="display: ' + e + ';">' + formatCount(null, forum_extra.read_count, "0") + "阅读</span></p>")) : $(a).replaceWith('<p class="poi" style="overflow: hidden;"><span class="location">' + i + '</span><span style="display: ' + e + ';">&thinsp;&thinsp;&middot;&thinsp;&thinsp;' + formatCount(null, forum_extra.read_count, "0") + "阅读</span></p>");
    }) : $("article").append('<p class="poi" style="overflow: hidden;"><span style="display: ' + e + ';">' + formatCount(null, forum_extra.read_count, "0") + "阅读</span></p>");
}

function buildUIStyle(t) {
    if ("forum" !== Page.article.type && 1 == t.font_size_ui_test && 0 === document.querySelector("head").querySelectorAll("style[source=abtest]").length) {
        var e = "article,p{line-height:1.5!important}.font_s article p,.font_s article h1,.font_s article h2,.font_s article h3,.font_s article h4,.font_s article h5,.font_s article h6,.font_s article ul,.font_s article ol,.font_s article hr,.font_s article .image-wrap{margin-top:16px;margin-bottom:16px}article p,article h1,article h2,article h3,article h4,article h5,article h6,article blockquote,article ul,article ol,article hr,.font_m article p,.font_m article h1,.font_m article h2,.font_m article h3,.font_m article h4,.font_m article h5,.font_m article h6,.font_m article ul,.font_m article ol,.font_m article hr,.font_m article .image-wrap{margin-top:18px;margin-bottom:18px}.font_l article p,.font_l article h1,.font_l article h2,.font_l article h3,.font_l article h4,.font_l article h5,.font_l article h6,.font_l article ul,.font_l article ol,.font_l article hr,.font_s article .image-wrap{margin-top:20px;margin-bottom:20px}.font_xl article p,.font_xl article h1,.font_xl article h2,.font_xl article h3,.font_xl article h4,.font_xl article h5,.font_xl article h6,.font_xl article ul,.font_xl article ol,.font_xl article hr,.font_s article .image-wrap{margin-top:23px;margin-bottom:23px}.font_s article li p{margin-top:4px;margin-bottom:4px}article li p,.font_m article li p{margin-top:6px;margin-bottom:6px}.font_l article li p{margin-top:8px;margin-bottom:8px}.font_xl article li p{margin-top:11px;margin-bottom:11px}p.pgc-img-caption{font-size:12px!important;line-height:16px!important;margin-top:-10px!important}h1{line-height:1.4}.font_s article .image-wrap:first-child{margin-top:16px!important;margin-bottom:16px!important}article .image-wrap:first-child,.font_m article .image-wrap:first-child{margin-top:18px!important;margin-bottom:18px!important}.font_l article .image-wrap:first-child{margin-top:20px!important;margin-bottom:20px!important}.font_xl article .image-wrap:first-child{margin-top:23px!important;margin-bottom:23px!important}.font_s article .image-wrap>.image,.font_s article .table-wrap{margin-top:0;margin-bottom:0}article .image-wrap>.image,article .table-wrap,.font_m article .image-wrap>.image,.font_m article .table-wrap{margin-top:0;margin-bottom:0}.font_l article .image-wrap>.image,.font_l article .table-wrap{margin-top:0;margin-bottom:0}.font_xl article .image-wrap>.image,.font_xl article .table-wrap{margin-top:0;margin-bottom:0}@media(max-device-width:374px){.font_s article p,.font_s article h1,.font_s article h2,.font_s article h3,.font_s article h4,.font_s article h5,.font_s article h6,.font_s article ul,.font_s article ol,.font_s article hr,.font_s article .image-wrap{margin-top:14px;margin-bottom:14px}article p,article h1,article h2,article h3,article h4,article h5,article h6,article blockquote,article ul,article ol,article hr,.font_m article p,.font_m article h1,.font_m article h2,.font_m article h3,.font_m article h4,.font_m article h5,.font_m article h6,.font_m article ul,.font_m article ol,.font_m article hr,.font_m article .image-wrap{margin-top:16px;margin-bottom:16px}.font_l article p,.font_l article h1,.font_l article h2,.font_l article h3,.font_l article h4,.font_l article h5,.font_l article h6,.font_l article ul,.font_l article ol,.font_l article hr,.font_s article .image-wrap{margin-top:18px;margin-bottom:18px}.font_xl article p,.font_xl article h1,.font_xl article h2,.font_xl article h3,.font_xl article h4,.font_xl article h5,.font_xl article h6,.font_xl article ul,.font_xl article ol,.font_xl article hr,.font_s article .image-wrap{margin-top:21px;margin-bottom:21px}.font_s article .image-wrap:first-child{margin-top:14px!important;margin-bottom:14px!important}article .image-wrap:first-child,.font_m article .image-wrap:first-child{margin-top:16px!important;margin-bottom:16px!important}.font_l article .image-wrap:first-child{margin-top:18px!important;margin-bottom:18px!important}.font_xl article .image-wrap:first-child{margin-top:21px!important;margin-bottom:21px!important}}", a = document.createElement("style");
        a.setAttribute("source", "abtest"), a.innerHTML = e, document.querySelector("head").appendChild(a),
            a = null;
    }
}

function update_forum_tags(t) {
    "string" == typeof t && (t = t.split(","));
    var e = $('<div class="article-tags">');
    t.forEach(function(t) {
        "" !== t && e.append($('<div class="article-tag">').html(t));
    }), t.length >= 1 ? $(".name-link-w").removeClass("no-intro") : "" === $(".sub-title").text() && $(".name-link-w").addClass("no-intro"),
        $(".article-tags").replaceWith(e);
}

function on_page_disappear() {
    mediasugScroll.pushimpr();
}

function set_info(t) {
    if ("string" == typeof t) t = JSON.parse(t); else if ("object" != typeof t) return;
    $.extend(window.globalWendaStates, t), "is_concern_user" in t && change_following_state(!!t.is_concern_user),
    "brow_count" in t && ($(".brow-count").text(t.brow_count), formatCount(".brow-count", t.brow_count, "0")),
    "is_digg" in t && "digg_count" in t && (t.is_digg && $("#digg").attr({
        "wenda-state": "digged",
        aniok: "false"
    }), formatCount(".digg-count", t.digg_count, "赞"), formatCount(".digg-count-special", t.digg_count, "0")),
    "is_buryed" in t && "bury_count" in t && (t.is_buryed && $("#bury").attr({
        "wenda-state": "buryed",
        aniok: "false"
    }), formatCount(".bury-count", t.bury_count, "踩")), "is_show_bury" in t && t.is_show_bury && $("#bury").show().parent().removeClass("only-one").addClass("only-two");
}

function getElementPosition(t) {
    var e = document.querySelector(t);
    if (e) {
        var a = e.getBoundingClientRect();
        return "{{" + a.left + "," + e.offsetTop + "},{" + a.width + "," + a.height + "}}";
    }
    return "{{0,0},{0,0}}";
}

function setFontSize(t) {
    var e = t.split("_")[0], a = (t.split("_")[1], [ "s", "m", "l", "xl" ]), i = $.map(a, function(t) {
        return "font_" + t;
    }).join(" ");
    a.indexOf(e) > -1 && $("body").removeClass(i).addClass("font_" + e);
}

function setDayMode(t) {
    var e = [ 0, 1, "0", "1" ];
    e.indexOf(t) > -1 && (t = parseInt(t), $("body").removeClass("night"));
}

function appCloseVideoNoticeWeb(t) {
    var e = $('[data-vid="' + t + '"]');
    e.each(function() {
        $(this).css("display", "block"), $(this).next(".cv-wd-info-wrapper").show(), $("body").css("margin-top", "0px");
    });
}

function getVideoFrame(t) {
    var e = document.querySelector('[data-vid="' + t + '"]'), a = "{{0,0},{0,0}}";
    if (e) {
        var i = e.getBoundingClientRect();
        a = "{{" + i.left + "," + e.offsetTop + "},{" + i.width + "," + i.height + "}}";
    }
    return a;
}

function processMenuItemPressEvent() {
    ToutiaoJSBridge.call("typos", {
        strings: getThreeStrings()
    });
}

function getThreeStrings() {
    var t = "", e = "", a = "", i = document.getSelection();
    if ("Range" !== i.type) return [ t, e, a ];
    var n = i.getRangeAt(0);
    if (!n) return [ t, e, a ];
    try {
        t = n.startContainer.textContent.substring(0, n.startOffset).substr(-20), e = n.toString(),
            a = n.endContainer.textContent.substring(n.endOffset).substring(0, 20);
    } catch (o) {}
    return n.detach(), n = null, [ t, e, a ];
}

function updateAppreciateCountByServer() {}

function subscribe_switch(t) {
    "pgc" == Page.article.type && change_following_state(!!t);
}

function _videoInView(t) {
    var e = t.getBoundingClientRect(), a = e.height || 100;
    return (e.top >= 0 && e.left >= 0 && e.top) <= (window.innerHeight || document.documentElement.clientHeight) - a;
}

function videoAutoPlay() {
    var t = $(".custom-video");
    if (!autoplayed && t.length) {
        var e = t.get(0);
        _videoInView(e) ? (playVideo(e, 1), autoplayed = !0) : document.addEventListener("scroll", videoAutoPlay, !1);
    } else document.removeEventListener("scroll", videoAutoPlay, !1);
}

function dealNovelButton(t, e, a, i) {
    t.preventDefault(), send_umeng_event("detail", e.is_concerned ? "click_fictioncard_discare" : "click_fictioncard_care", i),
        $.ajax({
            url: "http://ic.snssdk.com/concern/v1/commit/" + (e.is_concerned ? "discare/" : "care/"),
            dataType: "jsonp",
            data: {
                concern_id: e.concern_id
            },
            beforeSend: function() {
                return e.isclicking ? !1 : void (e.isclicking = !0);
            },
            complete: function() {
                e.isclicking = !1;
            },
            error: function() {
                ToutiaoJSBridge.call("toast", {
                    text: "操作失败，请重试",
                    icon_type: "icon_error"
                });
            },
            success: function(t) {
                return 0 != t.err_no ? (ToutiaoJSBridge.call("toast", {
                    text: "操作失败，请重试",
                    con_type: "icon_error"
                }), !1) : (e.is_concerned = !e.is_concerned, a.attr("is-concerned", Boolean(e.is_concerned)).html(e.is_concerned ? "已关注" : "关注"),
                    ToutiaoJSBridge.call("page_state_change", {
                        type: "concern_action",
                        id: e.concern_id,
                        status: e.is_concerned ? 1 : 0
                    }), ToutiaoJSBridge.call("page_state_change", {
                    type: "forum_action",
                    id: e.forum_id,
                    status: e.is_concerned ? 1 : 0
                }), void send_umeng_event(e.is_concerned ? "concern_novel" : "unconcern_novel", "detail", {
                    value: Page.statistics.group_id,
                    extra: {
                        item_id: Page.statistics.item_id,
                        novel_id: e.id
                    }
                }));
            }
        });
}

function dealOptionalStockButton(t, e, a, i, n) {
    t.stopPropagation(), send_umeng_event("stock", "article_add_stock", n);
    var o, r = 0, s = e.attr("data-stock"), l = 0;
    i.forEach(function(t, e) {
        t.code == s && (l = e, o = t.market), 0 == t.selected && r++;
    }), 1 != i[l].selected && $.ajax({
        url: "http://ic.snssdk.com/stock/like/",
        dataType: "jsonp",
        data: {
            code: s,
            market: o
        },
        beforeSend: function() {
            return i[l].isclicking || 1 == i[l].selected ? !1 : void (i[l].isclicking = !0);
        },
        complete: function() {
            i[l].isclicking = !1;
        },
        error: function() {
            ToutiaoJSBridge.call("toast", {
                text: "操作失败，请重试",
                icon_type: "icon_error"
            });
        },
        success: function(t) {
            return 1 != t.code ? (ToutiaoJSBridge.call("toast", {
                text: 0 == t.code && t.data.msg ? t.data.msg : "操作失败，请重试",
                con_type: "icon_error"
            }), !1) : (a.stocks.click_mount++, e.removeClass("pcard-w1").addClass("pcard-w3").html('<i class="pcard-icon opstock-iconfont icon-done"></i>已添加'),
            r > 3 && (e.css("height", 0), $parent = e.parent(), $parent.on("webkitAnimationEnd", function() {
                $parent.remove();
            }), $parent.on("animationend", function() {
                $parent.remove();
            }), $parent.addClass("ant-notification-fade-leave")), void (i[l].selected = !0));
        }
    });
}

function wendaConetxtRender(context) {
    !function() {
        if ("wenda_context" in context) {
            var t = context.wenda_context;
            if ("is_author" in t && (t.is_author ? ($(".follow-button").hide(), $(".author-function-buttons").hide(),
                    $(".wenda-info").show()) : "wenda" === Page.article.type && Page.h5_settings.is_liteapp ? ($(".follow-button").hide(),
                    $(".author-function-buttons").hide(), $(".wenda-info").hide()) : ($(".author-function-buttons").show(),
                    $(".follow-button").show(), $(".wenda-info").hide())), "is_author" in t && t.is_author ? ($(".wd-footer .editor-edit-answer").attr("href", t.edit_answer_schema).show(),
                    $(".wd-footer .dislike-and-report").hide()) : ($(".wd-footer .editor-edit-answer").hide(),
                    $(".wd-footer .dislike-and-report").show()), "is_author" in t && t.is_author || ($(".report").show(),
                    $(".sep.for-report").show()), "brow_count" in t && ($(".brow-count").text(t.brow_count),
                    formatCount(".brow-count", t.brow_count, "0")), "is_digg" in t && "digg_count" in t && (t.is_digg && $("#digg").attr({
                    "wenda-state": "digged",
                    aniok: "false"
                }), formatCount(".digg-count", t.digg_count, "赞"), formatCount(".digg-count-special", t.digg_count, "0")),
                "is_buryed" in t && "bury_count" in t && (t.is_buryed && $("#bury").attr({
                    "wenda-state": "buryed",
                    aniok: "false"
                }), formatCount(".bury-count", t.bury_count, "踩"), t.is_buryed && $(".dislike-and-report").css("color", "#999999").text("已反对")),
                "is_show_bury" in t && t.is_show_bury && $("#bury").show().parent().removeClass("only-one").addClass("only-two"),
                "is_concern_user" in t && change_following_state(!!t.is_concern_user), !("show_next" in t) || t.show_next) {
                if ($(".serial").show(), "has_next" in t) {
                    var e = $("#next_answer_link");
                    t.has_next ? (e.attr("href", t.next_answer_schema), e.attr("onclick", null)) : (e.attr("onclick", null),
                        e.addClass("disabled").on("click", function() {
                            ToutiaoJSBridge.call("toast", {
                                text: "这是最后一个回答",
                                icon_type: ""
                            });
                        }), needCleanDoms.push(e));
                }
                "ans_count" in t && ($("#total-answer-count").html(t.ans_count + "个回答").css("display", "inline-block"),
                    $("#total-answer-count-index").html("全部" + t.ans_count + "个回答")), "nice_ans_count" in t && "wenda_extra" in window && ("function" == typeof window.assignThroughWendaNiceanscount ? window.assignThroughWendaNiceanscount(t.nice_ans_count) : window.wenda_extra.nice_ans_count = t.nice_ans_count);
            }
        }
    }(), function() {
        if (1 == context.is_question_shown && "pgc" === Page.article.type) {
            var createArticleAskTemplate = function(obj) {
                var __t, __p = "";
                with (Array.prototype.join, obj || {}) __p += '<a class="cardx ask" href="' + (null == (__t = data.url) ? "" : __t) + '" style="visibility: hidden;"><div class="title" id="cutwrapper"><i class="iconfont ttwdlogo">&#xe633;</i>关于「<span id="cut">' + (null == (__t = data.title) ? "" : __t) + '</span>」，提个问题跟大家讨论下<i class="iconfont rightarrowicon">&#xe644;</i></div></a>';
                return __p;
            }, $articleAskTpl = $(createArticleAskTemplate({
                data: {
                    url: "sslocal://wenda_question_post?api_param=" + encodeURIComponent(JSON.stringify({
                        group_id: Page.statistics.group_id,
                        item_id: Page.statistics.item_id,
                        enter_from: "group_detail"
                    })),
                    title: Page.article.title
                }
            }));
            $articleAskTpl.on("click", function() {
                send_umeng_event("ask_question", "article_ask_click", {
                    value: Page.statistics.group_id,
                    extra: {
                        item_id: Page.statistics.item_id
                    }
                });
            }), needCleanDoms.push($articleAskTpl), $("footer").append($articleAskTpl);
            var height = $("#cutwrapper").height();
            if (height > 81) {
                do $("#cut").html($("#cut").html().slice(0, -3)), height = $("#cutwrapper").height(); while (height > 81);
                $("#cut").html($("#cut").html().slice(0, -3) + "...");
            }
            $articleAskTpl.css("visibility", "visible"), send_exposure_event_once($articleAskTpl.get(0), function() {
                send_umeng_event("ask_question", "article_ask_show", {
                    value: Page.statistics.group_id,
                    extra: {
                        item_id: Page.statistics.item_id
                    }
                });
            }, !0);
        }
    }(), function() {
        if ("wenda_recommend" in context && Page.wenda_extra) {
            var templateFunction = function(obj) {
                var __t, __p = "";
                with (Array.prototype.join, obj || {}) __p += '<a class="jrwdpd" href="' + (null == (__t = data.open_url) ? "" : __t) + '"><div class="jrwdpd-slogan">' + (null == (__t = data.text) ? "" : __t) + '</div><button class="jrwdpd-button">' + (null == (__t = data.button_text) ? "" : __t) + '</button><div class="jrwdpd-logo"></div><div class="jrwdpd-logo-wrap"></div></a>';
                return __p;
            }, $template = $(templateFunction({
                data: context.wenda_recommend
            }));
            $("footer").append($template), $template.on("click", function() {
                send_umeng_event("wenda_channel_detail", "enter", {
                    extra: {
                        qid: Page.wenda_extra.qid,
                        ansid: Page.wenda_extra.ansid,
                        enter_from: Page.wenda_extra.enter_from,
                        parent_enterfrom: Page.wenda_extra.parent_enterfrom || ""
                    }
                });
            }), needCleanDoms.push($template);
        }
    }();
}

function bindStatisticsEvents23() {
    $(".subscribe-button"), $("#mediasug-list"), $(document.body).on("click", ".subscribe-button", followActionHandler),
        $(document.body).on("click", ".mediasug-arrow-button", mediasugArrowAction), $(document.body).on("click", ".ms-item", mediasugCardClickHandler),
        $(document.body).on("click", ".ms-subs", mediasugFollowAction);
}
//文章底部车系卡片关注
var change_car_following_state = (function() {
    var async_timer;
    var executing_target_state;

    function sync_func(willFollowing, callback) {
        var like_text = ["关注", "已关注"],
            $btn = $('#car-subscribe-btn');

        executing_target_state = undefined;

        if (willFollowing) {
            $btn .attr("data-action", "like");
            $btn.text(like_text[0]);
        } else {
            $btn .attr("data-action", "unlike");
            $btn.text(like_text[1]);
        }
    }

    return function(willFollowing, isAsync, callback) {
        // FIXME 那之前的回调和新的回调该怎么处理？这儿绝壁是个bug!!!
        if (typeof callback === 'function') {
            callback(willFollowing);
        }

        if (isAsync) {
            // NOTE 非实时修改状态，强制添加 450ms延时
            if (willFollowing !== executing_target_state) {
                clearTimeout(async_timer);
                executing_target_state = willFollowing;
                async_timer = setTimeout(sync_func, 450, willFollowing, callback);
            }
        } else {
            sync_func(willFollowing, callback);
        }
    }
})();

function carLike (btn, car_id_type, car_id, callback_success, callback_error) {
    var $btn = $(btn),
        media_like_stat = $btn.attr("data-action"),
        url = "/pgc/" + media_like_stat + "/",
        data = $.extend({
            "car_id_type": car_id_type,
            "car_id": car_id
        }, {}),
        is_unlike = media_like_stat == "unlike";


    // NOTE iOS5.7.2版本前，无网状态下点击按钮，客户端不会回调。所以需要web做一个点击
    //      超时的兼容。
    subscribeTimeoutTimer = setTimeout(change_car_following_state, 1e4, is_unlike, true);

    ToutiaoJSBridge.call(is_unlike ? 'do_car_unlike' : 'do_car_like', {
        car_id_type: car_id_type,
        car_id: car_id
    }, function(event) {
        clearTimeout(subscribeTimeoutTimer);
        // NOTE iOS 5.7.2版本以前，由于对回调处理有bug导致event.code恒为0。按
        //      钮状态生效实际是因为page_state_change方法的监听。这样导致了当
        //      网络状况差时，由于很快就返回了0去掉了disabled，转圈出现很短时间就
        //      消失了（也就是闪了一下）。而过段时间请求回来，通过psc同步状态，
        //      此时才会切换状态（也就是感觉慢）。故针对旧版本，忽略对code0的处理。
        if (event.code == 1) {
            change_car_following_state(!is_unlike, true, function(is_unlike) {});
        } else {
            change_car_following_state(is_unlike, true);
        }
    });
}
function followActionHandler() {
    var t = $(this), e = t.data("userId"), a = t.data("mediaId"), i = t.hasClass("following"), n = t.attr("data-concerntype") || "", o = Page.article.type, r = "" === n, s = Page.hasExtraSpace && r;
    t.hasClass("disabled") || ($(".subscribe-button").addClass("disabled"), $("header").addClass("canmoving"),
        "pgc" === o ? (doFollowMedia(e, a, i, n), s && (i ? $("header").attr("sugstate", "no") : "")) : "wenda" === o ? doFollowUser(e, a, i) : "forum" === o && doFollowUser(e, a, i));
}

function mediasugArrowAction() {
    var t = $("header"), e = "close" === t.attr("sugstate");
    t.attr("sugstate", e ? "open" : "close"), send_umeng_event("detail", e ? "click_arrow_down" : "click_arrow_up", {
        extra: {
            source: "article_detail"
        }
    }), e && ($("#mediasug-list").get(0).scrollLeft = 0);
}

function mediasugCardClickHandler(t) {
    if (!$(t.target).is(".ms-subs")) {
        var e = $(this).attr("it-is-user-id");
        send_umeng_event("detail", "sub_rec_click", {
            value: e,
            extra: {
                source: "article_detail"
            }
        }), window.location.href = "sslocal://profile?uid=" + e;
    }
}

function mediasugFollowAction() {
    var t = $(this), e = null != t.attr("isfollowing"), a = t.closest(".ms-item").attr("it-is-user-id"), i = t.attr("reason");
    t.attr("disabled", !0), ToutiaoJSBridge.call("user_follow_action", {
        id: a,
        action: e ? "unfollow" : "dofollow",
        reason: i
    }, function(i) {
        t.attr("disabled", null), "object" == typeof i && 1 == i.code && (send_umeng_event("detail", e ? "sub_rec_unsubscribe" : "sub_rec_subscribe", {
            value: a,
            extra: {
                source: "article_detail"
            }
        }), t.attr("isfollowing", e ? null : ""), doRecommendUsers(Page.author.userId, function(t) {
            if (Array.isArray(t)) for (var i = t.length, n = 0; i > n; n++) t[n].user_id == a && (t[n].is_following = !e);
        }, function() {}));
    });
}

function domPrepare() {
    $("#mediasug-list").on("touchstart touchmove", function() {
        sendBytedanceRequest("disable_swipe");
    }).on("touchend touchcancel", function() {
        sendBytedanceRequest("enable_swipe");
    });
    var t = document.querySelector(".mediasug-outer-container"), e = document.querySelector(".mediasug-inner-container");
    if (t && e) {
        t.addEventListener("transitionend", function(t) {
            0 == t.target.offsetHeight && (e.style.display = "none");
        }, !1);
        var a = window.MutationObserver || window.WebKitMutationObserver;
        if (a) {
            var i = new a(function(t) {
                t.forEach(function(t) {
                    var a = t.attributeName;
                    if ("sugstate" === a) {
                        var i = t.target.getAttribute(a);
                        "open" === i ? (e.style.display = "block", console.info("SUG-OEPN"), mediasugScroll.handler(),
                            $(document).on("scroll", mediasugScroll.pagescroll)) : (console.info("SUG-HIDE"),
                            $(document).off("scroll", mediasugScroll.pagescroll), mediasugScroll.pushimpr());
                    }
                });
            });
            i.observe(document.getElementsByTagName("header")[0], {
                attributes: !0
            });
        }
    }
}

function recommendUsersSuccess(list) {
    domPrepare(), list.forEach(function(t) {
        if (t.user_auth_info && "string" == typeof t.user_auth_info) try {
            t.user_auth_info = JSON.parse(t.user_auth_info);
        } catch (e) {
            t.user_auth_info = {};
        }
    }), mediasugScroll.init(list);
    var MediasugTemplateFunction = function(obj) {
        var __t, __p = "";
        with (Array.prototype.join, obj || {}) {
            __p += "";
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                __p += '<div class="ms-item" it-is-user-id="' + (null == (__t = item.user_id) ? "" : __t) + '"><div class="ms-avatar"><div class="ms-avatar-wrap"><img class="ms-avatar-image" src="' + (null == (__t = item.avatar_url) ? "" : __t) + '"></div>',
                useServerV && item.user_verified && item.user_auth_info && item.user_auth_info.auth_type && (__p += "" + (null == (__t = buildServerVIcon2(item.user_auth_info.auth_type, "avatar_icon")) ? "" : __t)),
                    __p += '</div><div class="ms-name-wrap"><div class="ms-name ' + (null == (__t = !useServerV && item.user_verified ? " verified" : "") ? "" : __t) + '">' + (null == (__t = item.name) ? "" : __t) + '</div></div><div class="ms-desc">' + (null == (__t = item.reason_description) ? "" : __t) + '</div><button reason="' + (null == (__t = item.reason) ? "" : __t) + '" class="ms-subs" ' + (null == (__t = item.is_following ? " isfollowing " : "") ? "" : __t) + " " + (null == (__t = item.is_followed ? " isfollowed " : "") ? "" : __t) + ' ><span class="focus-icon">&nbsp;</span></button></div>';
            }
            __p += "";
        }
        return __p;
    }, MediasugTemplateString = MediasugTemplateFunction({
        data: list,
        useServerV: Page.useServerV
    });
    $("#mediasug-list-html").html(MediasugTemplateString).css("width", 148 * list.length + 6 + 10 + "px"),
        $("header").attr("sugstate", "open");
}

function doFollowUser(t, e, a, i) {
    subscribeTimeoutTimer = setTimeout(change_following_state, 1e4, a, !0), ToutiaoJSBridge.call("user_follow_action", {
        id: t,
        action: a ? "unfollow" : "dofollow",
        reason: i
    }, function(t) {
        clearTimeout(subscribeTimeoutTimer), t && "object" == typeof t && 1 == t.code ? change_following_state(!!t.status, !0) : change_following_state(a, !0);
    });
}

function doFollowMedia(t, e, a, i) {
    var n = "" === i, o = Page.hasExtraSpace && n;
    subscribeTimeoutTimer = setTimeout(change_following_state, 1e4, a, !0), ToutiaoJSBridge.call(a ? "do_media_unlike" : "do_media_like", {
        id: e,
        uid: t,
        concern_type: i
    }, function(t) {
        clearTimeout(subscribeTimeoutTimer), 1 == t.code ? change_following_state(!a, !0, function(e) {
            e ? (send_umeng_event("preview", "preview_click_sub"), "showToast" in t && !t.showToast || o || ToutiaoJSBridge.call("toast", {
                text: "将增加推荐此头条号内容",
                icon_type: "icon_success"
            })) : send_umeng_event("preview", "preview_click_cancel_sub");
        }) : client.isAndroid || client.isNewsArticleVersionNoLessThan("5.7.2") ? change_following_state(a, !0) : change_following_state(a, !0);
    });
}

function encodeHTML(t) {
    return t.replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function decodeHTML(t) {
    return t.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

function getBrPosition(t) {
    var e = decodeHTML(t), a = 0, i = e.split("<br>");
    return i.map(function(t) {
        var e = t.length + a;
        return a += t.length, {
            isBR: !0,
            pos: e
        };
    }).slice(0, i.length - 1);
}

function processThreadRepostContent() {
    $("p[data-rich-span]").each(function(t, e) {
        var a, i = 0, n = e.textContent, o = e.innerHTML, r = "";
        try {
            a = JSON.parse(e.dataset.richSpan).links;
            var s = [], l = {};
            a.forEach(function(t) {
                s.push(t.start), l[t.start] = t;
            });
            var c = getBrPosition(o);
            c.forEach(function(t) {
                l[t.pos] ? l[t.pos] = [ t, l[t.pos] ] : (s.push(t.pos), l[t.pos] = t);
            }), a = [], s.sort(function(t, e) {
                return t - e;
            }).forEach(function(t) {
                a.push(l[t]);
            });
        } catch (d) {}
        Array.isArray(a) && 0 !== a.length && (a.forEach(function(t) {
            Array.isArray(t) ? (r += encodeHTML(n.substring(i, t[0].pos)), r += "<br>", r += '<a href="' + t[1].link + '">',
                r += encodeHTML(n.substr(t[1].start, t[1].length)), r += "</a>", i = t[1].start + t[1].length) : t.isBR ? (r += encodeHTML(n.substring(i, t.pos)),
                r += "<br>", i = t.pos) : (r += encodeHTML(n.substring(i, t.start)), r += '<a href="' + t.link + '">',
                r += encodeHTML(n.substr(t.start, t.length)), r += "</a>", i = t.start + t.length);
        }), r += encodeHTML(n.substr(i)), fastdom.mutate(function() {
            e.innerHTML = r;
        }));
    });
}

function processRepostThread() {
    $(".tt-repost-thread").each(function(t, e) {
        var a = e.dataset, i = '<a class="originuser" href="' + a.userSchema + '">@' + _.escape(a.userName) + "</a>：";
        Page.forum_extra.origin_forum_info && (i += '<a href="' + Page.forum_extra.origin_forum_info.schema + '">#' + _.escape(Page.forum_extra.origin_forum_info.name) + "#</a>"),
        a.title && (i += "【" + _.escape(a.title) + "】");
        var n = 0;
        /\d+/.test(a.userSchema) && (n = a.userSchema.match(/\d+/)[0]), ToutiaoJSBridge.call("appInfo", {}, function(t) {
            "object" == typeof t ? t.user_id : -1, fastdom.mutate(function() {
                if (0 == a.showOrigin) $(e).html(a.showTips || "原内容已经删除").removeClass("tt-repost-thread").addClass("tt-repost-delete"); else {
                    var t = $(e).find("p[data-rich-span]");
                    0 === t.length ? $(e).prepend('<p class="first-forum-p">' + i + "</p>") : t.prepend(i).addClass("first-forum-p"),
                        $(e).on("click", function(t) {
                            0 === $(t.target).closest(".image").length && 0 === $(t.target).closest(".originuser").length && (location.href = a.openUrl);
                        });
                }
                e.style.visibility = "visible";
            });
        });
    });
}

function processRepostArticle() {
    var ArticleLinkTemplateFunction = function(obj) {
        var __t, __p = "";
        with (Array.prototype.join, obj || {}) __p += "", __p += 0 == data.showOrigin ? '<div class="tt-repost-delete">' + (null == (__t = data.showTips) ? "" : __t) + "</div>" : '<a class="tt-repost-article" href="' + (null == (__t = data.openUrl) ? "" : __t) + '"><div class="coverwrap"><div class="cover" image="' + (null == (__t = data.cover) ? "" : __t) + '" type="' + (null == (__t = data.articleType) ? "" : __t) + '" style="background-image: url(' + (null == (__t = data.cover) ? "" : __t) + ');"></div></div><div class="titlewrap"><div class="title">' + (null == (__t = data.author) ? "" : _.escape(__t)) + "：" + (null == (__t = data.title) ? "" : _.escape(__t)) + "</div></div></a>",
            __p += "";
        return __p;
    };
    $("tt-repost-article").each(function(t, e) {
        var a = $(ArticleLinkTemplateFunction({
            data: e.dataset
        }));
        fastdom.mutate(function() {
            $(e).replaceWith(a);
        });
    });
}

function processFilm() {
    if (window.forum_extra && "publish_score" in window.forum_extra) {
        var t = window.forum_extra.publish_score, e = Math.ceil(t), a = '<div class="film-star-score-wrapper"><span class="iconfont film-star-score" data-score="' + e + '">' + t + "</span></div>";
        fastdom.mutate(function() {
            $("p").eq(0).append(a);
        });
    }
}

function processRepostUgcVideo() {
    $(".tt-repost-ugcvideo").each(function(t, e) {
        var a = e.dataset;
        fastdom.mutate(function() {
            var t = $(e).find(".cover"), i = t.find("img"), n = t.attr("height"), o = t.attr("width");
            i.attr("maxdisplay", n > o ? "width" : "height"), $(e).on("click", function(t) {
                0 === $(t.target).closest(".cover").length && 0 === $(t.target).closest(".originuser").length && (location.href = a.openUrl);
            }), e.style.visibility = "visible";
        });
    });
}

function getAudioSourceById(t, e, a) {
    $.ajax({
        type: "GET",
        dataType: "jsonp",
        url: "http://i.snssdk.com/audio/urls/1/toutiao/mp4/" + t,
        error: a,
        success: function(t) {
            try {
                e(atob(t.data.audio_list.audio_1.main_url.replace(/\n/gi, "")));
            } catch (i) {
                a();
            }
        }
    });
}

function sendAudioEvent(t, e) {
    send_umeng_event(t, e, {
        value: Page.statistics.item_id,
        extra: {
            sound_id: this.audioId,
            percent: this.currentTime / this.duration,
            duration: this.duration,
            current_time: this.currentTime
        }
    });
}

function processAudio() {
    var MusicTemplateFunction = function(obj) {
        var __t, __p = "";
        with (Array.prototype.join, obj || {}) __p += '<div class="musicplayer" play-state="not-playing"><!-- <div class="iconfont music-status"></div> --><div class="music-state"><div class="music-info"><span class="music-name">' + (null == (__t = music.name) ? "" : _.escape(__t)) + '</span><span class="music-time">' + (null == (__t = music.time) ? "" : _.escape(__t)) + '</span></div><div class="music-musician">' + (null == (__t = music.musician) ? "" : _.escape(__t)) + '</div></div><div class="progressbar"></div><audio preload="none" duration="' + (null == (__t = music.duration) ? "" : _.escape(__t)) + '" audioId="' + (null == (__t = music.audioId) ? "" : _.escape(__t)) + '"></audio></div>';
        return __p;
    };
    $("tt-audio").each(function(t, e) {
        function a(t, e) {
            e && (sendAudioEvent.call(e, "sound_over_others", "stop_play"), e.pause()), t.play(),
                send_umeng_event("sound", "detail_play", {
                    value: Page.statistics.item_id,
                    extra: {
                        sound_id: t.audioId
                    }
                });
        }
        var i = {
            audioId: e.getAttribute("data-id"),
            name: e.getAttribute("title"),
            duration: +e.getAttribute("time"),
            time: formatDuration(+e.getAttribute("time")),
            musician: e.getAttribute("content")
        }, n = $(MusicTemplateFunction({
            music: i
        }));
        $(e).replaceWith(n), getAudioSourceById(i.audioId, function(t) {
            n.find("audio").attr("src", t);
        }, function() {}), n.on("click", function() {
            var t = $(this), e = t.find("audio").get(0), n = $('[play-state="playing"]').find("audio").get(0);
            e.audioId = i.audioId, e.src ? e.paused ? a(e, n) : (sendAudioEvent.call(e, "sound", "stop_play"),
                e.pause()) : getAudioSourceById(e.audioId, function(t) {
                e.setAttribute("src", t), setTimeout(function() {
                    a(e, n);
                }, 500);
            }, function() {
                ToutiaoJSBridge.call("toast", {
                    text: "音频获取失败，请重试",
                    icon_type: "icon_error"
                });
            });
        });
        var o = n.find("audio");
        o.on("timeupdate", function() {
            this.currentTime >= this.duration ? this.pause() : n.find(".progressbar").css("width", this.currentTime / this.duration * 100 + "%");
        }).on("durationchange", function() {
            $(this).closest(".musicplayer").find(".music-time").text(formatDuration(this.duration));
        }).on("playing", function() {
            $(this).closest(".musicplayer").attr("play-state", "playing");
        }).on("pause", function() {
            this.duration - this.currentTime < .3 && sendAudioEvent.call(this, "sound_over", "end_play"),
                this.currentTime = 0, $(this).closest(".musicplayer").attr("play-state", "not-playing");
        }), needCleanDoms.push(o);
    });
}

function processPhoneGroup() {
    $("tt-phone-group").each(function(t, e) {
        var a = $(e), i = 0, n = !1, o = !1, r = a.attr("book-url"), s = a.attr("contact-phone"), l = $('<div class="cpg-container">');
        l.attr("book-url", r).attr("contact-phone", s), s && a.attr("contact-name") && (n = !0,
            i++, l.append('<a class="cpg-button cpg-call" href="tel:' + s + '">' + a.attr("contact-name") + "</a>"),
            l.attr("button-count", i)), r && a.attr("book-name") && (o = !0, i++, l.append('<a class="cpg-button cpg-link" href="sslocal://webview?url=' + encodeURIComponent(r) + '">' + a.attr("book-name") + "</a>"),
            l.attr("button-count", i)), l.on("click", ".cpg-button", function() {
            var t = $(this).hasClass("cpg-call");
            send_umeng_event("embeded_button_ad", "click", {
                value: Page.statistics.item_id,
                extra: {
                    action_type: t ? "call" : "url",
                    button_value: a.attr(t ? "contact-phone" : "book-url"),
                    action_time: new Date().getTime()
                }
            });
        }), needCleanDoms.push(l), a.replaceWith(l), setTimeout(function() {
            send_exposure_event_once(l.get(0), function() {
                o && send_umeng_event("embeded_button_ad", "show", {
                    value: Page.statistics.item_id,
                    extra: {
                        action_type: "url",
                        button_value: a.attr("book-url"),
                        action_time: new Date().getTime()
                    }
                }), n && send_umeng_event("embeded_button_ad", "show", {
                    value: Page.statistics.item_id,
                    extra: {
                        action_type: "call",
                        button_value: a.attr("contact-phone"),
                        action_time: new Date().getTime()
                    }
                });
            }, !0);
        }, 200);
    });
}

function processProHref() {
    $("[pro-href]").each(function(t, e) {
        var a = $(e), i = a.attr("starhref");
        if (i) {
            if (Page.useServerV) try {
                var n = JSON.parse(a.attr("user-auth-info")).auth_type;
                a.addClass("new-v").append(buildServerVIcon(n, "label_icon"));
            } catch (o) {}
            a.attr("href", i);
            var r = i.match(/\d+/i);
            r = r ? +r[0] : 0, a.attr("uid", r), sendUmengWhenTargetShown(e, "star_words", "show", {
                value: r
            }, !0);
        } else a.attr("href", a.attr("pro-href")), sendUmengWhenTargetShown(e, "highlight_words", "show", {
            value: Page.statistics.group_id,
            extra: {
                highword: encodeURIComponent(a.text())
            }
        }, !0);
    });
}

function processTable() {
    client.isAndroid ? $("table").each(function(t, e) {
        $(e).addClass("border").wrap('<div class="table-wrap horizontal_scroll_android"/>');
    }) : client.isIOS && $("table").each(function(t, e) {
            var a = $(e);
            if (a.addClass("border").wrap('<div class="table-wrap horizontal_scroll"/>'), a.width() > innerWidth - 30) {
                var i = a.parent(), n = $('<div class="swipe_tip">左滑查看更多</div>');
                i.append(n), i.on("touchstart", function() {
                    n.css("opacity", "0");
                }).on("scroll touchend", function() {
                    0 === this.scrollLeft && n.css("opacity", "1");
                }), needCleanDoms.push(i);
            }
        });
}

function appendVideoImg() {
    var t = this.parentNode;
    t && (t.style.background = "black");
}

function errorVideoImg() {
    var t = this.parentNode;
    t && t.removeChild(this);
}

function processCustomVideo() {
    $(".custom-video").each(function(t, e) {
        var a = $(e), i = e.dataset, n = i.width, o = i.height, r = 75, s = 0, l = r, c = "";
        if (n && o && (s = (100 * o / n).toFixed(2), r >= s ? l = s : c = "height: 100%; width: auto;"),
                a.css("padding-bottom", l + "%"), i.wendaSource && "object" == typeof window.wenda_extra) {
            var d = formatDuration(i.duration);
            if (a.html('<img src="' + i.poster + '" style="' + c + '" onload="appendVideoImg.call(this)" onerror="errorVideoImg.call(this)" /><i class="custom-video-trigger"></i><i class="custom-video-duration">' + d + "</i>"),
                "pgc" === i.wendaSource) {
                var _ = $('<a class="cv-wd-info-wrapper" href="' + i.openUrl + '"><span class="cv-wd-info-name" ' + (Boolean(Number(i.isVerify)) ? "is-verify" : "") + ">" + i.mediaName + '</span><span class="cv-wd-info-pc">' + i.playCount + "次播放</span></a>");
                _.on("click", function() {
                    ToutiaoJSBridge.call("pauseVideo"), send_umeng_event("answer_detail", "click_video_detail", {
                        value: wenda_extra.ansid,
                        extra: {
                            video_id: i.vid,
                            enter_from: wenda_extra.enter_from || "",
                            ansid: wenda_extra.ansid,
                            qid: wenda_extra.qid,
                            parent_enterfrom: wenda_extra.parent_enterfrom || ""
                        }
                    });
                }), needCleanDoms.push(_), a.after(_);
            }
            sendUmengWhenTargetShown(e, "video_show", "click_question_and_answer", {
                value: wenda_extra.ansid,
                extra: {
                    position: "detail",
                    video_id: i.vid,
                    enter_from: wenda_extra.enter_from || "",
                    ansid: wenda_extra.ansid,
                    qid: wenda_extra.qid,
                    parent_enterfrom: wenda_extra.parent_enterfrom || ""
                }
            }, !0);
        } else a.html('<img src="' + i.poster + '" style="' + c + '" onload="appendVideoImg.call(this)" onerror="errorVideoImg.call(this)" /><i class="custom-video-trigger"></i>');
        Page.hasExtraSpace = !1;
    });
}

function checkDisplayedFactory(t, e) {
    return lastBottom = {}, function() {
        var a = document.querySelector(t);
        if (a) {
            var i = a.getBoundingClientRect();
            i.bottom < 0 && lastBottom[t] >= 0 ? ToutiaoJSBridge.call(e, {
                show: !0
            }) : i.bottom >= 0 && lastBottom[t] < 0 && ToutiaoJSBridge.call(e, {
                    show: !1
                }), lastBottom[t] = i.bottom;
        }
    };
}

function processPageStateChangeEvent(t) {
    switch (t.type) {
        case "pgc_action":
            console.info("pgc_action", t), subscribeTimeoutTimer && clearTimeout(subscribeTimeoutTimer);
            var e = $(".subscribe-button"), a = e.data("mediaId");
            t.id == a && "status" in t && change_following_state(!!t.status, !0);
            break;

        case "user_action":
            console.info("user_action", t), subscribeTimeoutTimer && clearTimeout(subscribeTimeoutTimer);
            var e = $(".subscribe-button"), i = e.data("userId");
            if (t.id == i && "status" in t) change_following_state(!!t.status, !0); else {
                var n = $('[it-is-user-id="' + t.id + '"]');
                n.length > 0 && "status" in t && (n.find(".ms-subs").attr("isfollowing", t.status ? "" : null),
                    doRecommendUsers(Page.author.userId, function(e) {
                        if (Array.isArray(e)) for (var a = e.length, i = 0; a > i; i++) e[i].user_id == t.id && (e[i].is_following = !!t.status);
                    }, function() {}));
            }
            break;

        case "wenda_digg":
            var o = $("#digg").attr("data-answerid");
            if (t.id == o && "digged" !== $("#digg").attr("wenda-state")) {
                $("#digg").attr("wenda-state", "digged");
                var r = +$("#digg").find(".digg-count").attr("realnum");
                formatCount(".digg-count", r + 1, "赞"), formatCount(".digg-count-special", r + 1, "0");
            }
            break;

        case "wenda_bury":
            var o = $("#bury").attr("data-answerid");
            if (t.id == o && "buryed" !== $("#bury").attr("wenda-state")) {
                $("#bury").attr("wenda-state", "buryed");
                var s = +$("#bury").find(".bury-count").attr("realnum");
                formatCount(".bury-count", s + 1, "踩");
            }
            break;

        case "forum_action":
            var l = $(".pcard.fiction").find(".button"), c = l.attr("forum-id");
            t.id == c && l.attr("is-concerned", Boolean(t.status)).html(t.status ? "已关注" : "关注");
            break;

        case "concern_action":
            var l = $(".pcard.fiction").find(".button"), d = l.attr("concern-id");
            t.id == d && l.attr("is-concerned", Boolean(t.status)).html(t.status ? "已关注" : "关注");
            break;

        case "carousel_image_switch":
            "function" == typeof onCarouselImageSwitch && (Page.forum_extra && Page.forum_extra.thread_id == t.id ? onCarouselImageSwitch(t.status) : Page.wenda_extra && Page.wenda_extra.ansid == t.id ? onCarouselImageSwitch(t.status) : Page.statistics.group_id == t.id && onCarouselImageSwitch(t.status));
            break;

        case "block_action":
            if (console.info(t), 1 == t.status) {
                var e = $(".subscribe-button"), i = e.data("userId");
                if (t.id == i) change_following_state(!1, !0); else {
                    var n = $('[it-is-user-id="' + t.id + '"]');
                    n.length > 0 && n.find(".ms-subs").attr("isfollowing", null);
                }
            }
    }
}

function processParagraph() {
    var t = /[\u2e80-\u2eff\u3000-\u303f\u3200-\u9fff\uf900-\ufaff\ufe30-\ufe4f]/, e = /[a-z0-9_:\-\/.%]{26,}/gi, a = /huawei/.test(navigator.userAgent.toLowerCase());
    a && document.body.classList.add("huawei"), $("article p").each(function(a, i) {
        if (!(i.classList.contains("pgc-img-caption") || !i.textContent || $(i).find(".image").length > 0)) if (t.test(i.textContent)) {
            if (e.test(i.textContent)) {
                var n = i.textContent.match(e);
                n.forEach(function(t) {
                    i.innerHTML = i.innerHTML.replace(t, function(t) {
                        return '<br class="sysbr">' + t;
                    });
                });
            }
        } else i.style.textAlign = "left";
    });
}

function processGameDownloader() {
    $("tt-game").each(function(t, e) {
        var a = $.extend({}, e.dataset);
        a.source = "pgc", a.tag = "article_card_app_ad", gc = new GameCard(a, e), window.articleAlreadyHadGame = !0;
    });
}

function GameCard(t, e) {
    GameCard.startListen(), this.prepareData(t, e);
}

function setContent(t) {
    if (startTimestamp = Date.now(), null !== t) {
        var e = t.indexOf("<article>"), a = t.indexOf("</article>"), i = t.substring(e + 9, a);
        globalContent = i || t;
    }
}

function setExtra(t) {
    void 0 === t ? globalExtras = window : "object" == typeof t.h5_extra ? globalExtras = t : client.isIOS ? globalExtras.h5_extra = t : client.isAndroid && (globalExtras.h5_extra = $.extend(!0, globalExtras.h5_extra, t)),
        window.Page = buildPage(globalExtras), window.OldPage ? _.isEqual(window.OldPage, window.Page) || (window.OldPage = window.Page,
            buildHeader(window.Page)) : (window.sendTTCustomizeLog && window.sendTTCustomizeLog("start_build_article", +new Date() - startTimestamp),
        window.OldPage = window.Page, TouTiao.setDayMode(Page.pageSettings.is_daymode ? 1 : 0),
        TouTiao.setFontSize(Page.pageSettings.font_size), buildHeader(window.Page), buildArticle(globalContent),
        buildFooter(window.Page), functionName());
}

function functionName() {
    sendBytedanceRequest("domReady"), window.sendTTCustomizeLog && window.sendTTCustomizeLog("start_process_article", +new Date() - startTimestamp),
        ToutiaoJSBridge.on("page_state_change", processPageStateChangeEvent), processArticle(),
    window.sendTTCustomizeLog && window.sendTTCustomizeLog("end_process_article", +new Date() - startTimestamp),
    null !== globalCachedContext && contextRenderer(globalCachedContext), canSetContext = !0;
}

function insertDiv(t) {
    window.sendTTCustomizeLog && window.sendTTCustomizeLog("start_insert_div", +new Date() - startTimestamp),
        canSetContext ? contextRenderer(t) : globalCachedContext = t;
}

function onQuit() {
    Page = {}, OldPage = null, globalContent = void 0, canSetContext = !1, needCleanDoms.forEach(function(t) {
        t.off();
    }), needCleanDoms = [], imprProcessQueue = [], flushErrors(!0), $("header").replaceWith("<header>"),
        $("article").empty(), $("footer").empty(), $(document).off("scroll"), "onGetSeriesLinkPositionTimer" in window && clearInterval(onGetSeriesLinkPositionTimer);
}

function bindStatisticsEvents() {
    document.addEventListener("scroll", function() {
        imprProcessQueue.length > 0 && imprProcessQueue.forEach(function(t, e, a) {
            t && isElementInViewportY(t[0], t[4]) && (send_umeng_event(t[1], t[2], t[3]), a[e] = void 0);
        });
    }, !1);
    var t = $(document.body);
    t.on("click", ".pgc-link", function() {
        "forum" === Page.article.type ? send_umeng_event("talk_detail", "click_ugc_header", Page.forumStatisticsParams) : "pgc" === Page.article.type && send_umeng_event("detail", "click_pgc_header", {
                value: Page.author.mediaId,
                extra: {
                    item_id: Page.statistics.item_id
                }
            });
    }), t.on("click", "#prev_serial_link", function() {
        send_umeng_event("detail", "click_pre_group", {
            value: Page.statistics.group_id,
            extra: {
                item_id: Page.statistics.item_id
            }
        });
    }).on("click", "#next_serial_link", function() {
        send_umeng_event("detail", "click_next_group", {
            value: Page.statistics.group_id,
            extra: {
                item_id: Page.statistics.item_id
            }
        });
    }).on("click", "#index_serial_link", function() {
        send_umeng_event("detail", "click_catalog", {
            value: Page.statistics.group_id,
            extra: {
                item_id: Page.statistics.item_id
            }
        });
    }), t.on("click", ".custom-video", function() {
        playVideo(this, 0);
    }), t.on("click", "[pro-href]", function() {
        $(this).attr("starhref") ? send_umeng_event("star_words", "click", {
            value: $(this).attr("uid")
        }) : send_umeng_event("highlight_words", "click", {
            value: Page.statistics.group_id,
            extra: {
                highword: encodeURIComponent($(this).text())
            }
        });
    }), t.on("click", "#digg", function() {
        "digged" === $(this).attr("wenda-state") ? ToutiaoJSBridge.call("toast", {
            text: "你已经赞过",
            icon_type: "icon_error"
        }) : "buryed" === $("#bury").attr("wenda-state") ? ToutiaoJSBridge.call("toast", {
            text: "你已经踩过",
            icon_type: "icon_error"
        }) : ToutiaoJSBridge.call("page_state_change", {
            type: "wenda_digg",
            id: $(this).attr("data-answerid"),
            status: 1
        });
    }), t.on("click", "#bury", function() {
        "buryed" === $(this).attr("wenda-state") ? ToutiaoJSBridge.call("toast", {
            text: "你已经踩过",
            icon_type: "icon_error"
        }) : "digged" === $("#digg").attr("wenda-state") ? ToutiaoJSBridge.call("toast", {
            text: "你已经赞过",
            icon_type: "icon_error"
        }) : ToutiaoJSBridge.call("page_state_change", {
            type: "wenda_bury",
            id: $(this).attr("data-answerid"),
            status: 1
        });
    });
}

function playVideo(t, e) {
    var a = t.getBoundingClientRect(), i = {
        sp: t.getAttribute("data-sp"),
        vid: t.getAttribute("data-vid"),
        frame: [ a.left, t.offsetTop, a.width, a.height ],
        status: e
    };
    "object" == typeof window.wenda_extra && (i.extra = {
        video_id: t.getAttribute("data-vid"),
        category_id: "question_and_answer",
        qid: wenda_extra.qid,
        ansid: wenda_extra.ansid,
        value: wenda_extra.ansid,
        enter_from: wenda_extra.enter_from,
        position: "detail",
        parent_enterfrom: wenda_extra.parent_enterfrom || ""
    }), window.ToutiaoJSBridge.call("playNativeVideo", i, null);
}

function onCarouselImageSwitch(t) {
    console.info("onCarouselImageSwitch", t), threadGGSwitch ? 1 !== IOSImageProcessor.holders_len && ToutiaoJSBridge.call("loadDetailImage", {
            type: "thumb_image",
            index: t
        }) : ToutiaoJSBridge.call("loadDetailImage", {
        type: "origin_image",
        index: t
    });
}

function _processArticle() {
    switch (window.iH = window.innerHeight, window.aW = window.innerWidth - 30, 0 >= aW || 0 >= iH ? setTimeout(function() {
        window.iH = window.innerHeight, window.aW = window.innerWidth - 30, window.threadGGSwitch = "forum" === Page.article.type && Page.forum_extra.use_9_layout,
            IOSImageProcessor.image_type = Page.pageSettings.image_type, IOSImageProcessor.lazy_load = Page.pageSettings.use_lazyload,
            IOSImageProcessor.start();
    }, 500) : (window.threadGGSwitch = "forum" === Page.article.type && Page.forum_extra.use_9_layout,
        IOSImageProcessor.image_type = Page.pageSettings.image_type, IOSImageProcessor.lazy_load = Page.pageSettings.use_lazyload,
        IOSImageProcessor.start()), processParagraph(), Page.article.type) {
        case "forum":
            processThreadRepostContent(), processRepostThread(), processRepostArticle(), processFilm(),
                processRepostUgcVideo();
            break;

        case "pgc":
            processTable(), processAudio(), processProHref(), processPhoneGroup(), processCustomVideo(),
                processGameDownloader();
            break;

        case "wenda":
            processTable(), processCustomVideo();
    }
    $("#mediasug-list").on("scroll", mediasugScroll.handler), needCleanDoms.push($("#mediasug-list"));
}

function processArticle() {
    _processArticle(), setTimeout(function() {
        document.body.classList.remove("opacity");
    }, 0);
}

APP_VERSION = "v55", CLIENT_VERSION = "ios", window.client = {
    isAndroid: /android/i.test(navigator.userAgent),
    isIOS: /iphone/i.test(navigator.userAgent),
    newsArticleVersion: _getNewsArticleVersion()
}, client.osVersion = client.isAndroid ? _getAndroidVersion() : client.isIOS ? _getIOSVersion() : "",
    client.isSeniorAndroid = client.isAndroid ? parseFloat(client.osVersion) >= 4.4 : !0,
    client.isNewsArticleVersionNoLessThan = _isNewsArticleVersionNoLessThan;

var hash = function() {
    var t = location.hash.substr(1), e = {};
    return t && t.split("&").forEach(function(t) {
        t = t.split("=");
        var a = t[0], i = t[1];
        a && (e[a] = i);
    }), function(t, a) {
        var i = {};
        return void 0 === t && void 0 === a ? location.hash : void 0 === a && "string" == typeof t ? e[t] : ("string" == typeof t && "string" == typeof a ? i[t] = a : void 0 === a && "object" == typeof t && (i = t),
            $.extend(e, i), void (location.hash = hash2string(e)));
    };
}(), getMeta = function() {
    for (var t = document.getElementsByTagName("meta"), e = {}, a = 0, i = t.length; i > a; a++) {
        var n = t[a].name.toLowerCase(), o = t[a].getAttribute("content");
        n && o && (e[n] = o);
    }
    return function(t) {
        return e[t];
    };
}(), event_type = client.isAndroid ? "log_event" : "custom_event", sendBytedanceRequest = function() {
    var t = "SEND-BYTE--DANCE-REQUEST", e = document.getElementById(t);
    return e || (e = document.createElement("iframe"), e.id = t, e.style.display = "none",
        document.body.appendChild(e)), function(t) {
        e.src = "bytedance://" + t;
    };
}();

!function() {
    var t = {};
    window.PressState = function(t) {
        var e = {
            holder: "body",
            bindSelector: "",
            exceptSelector: "",
            pressedClass: "pressed",
            triggerLatency: 100,
            removeLatency: 100
        };
        this.settings = $.extend({}, e, t), this._init();
    }, PressState.prototype = {
        _init: function() {
            "" != this.settings.bindSelector && (this._appendClass(), this._bindEvent());
        },
        _appendClass: function() {
            if ("pressed" == this.settings.pressedClass) {
                var t = "<style type='text/css'>.pressed{background-color: #e0e0e0 !important;} .night .pressed{background-color: #1b1b1b !important;}</style>";
                $("body").append(t);
            }
        },
        _bindEvent: function() {
            var e = this.settings.holder, a = "" == this.settings.exceptSelector ? this.settings.bindSelector : [ this.settings.bindSelector, this.settings.exceptSelector ].join(","), i = this.settings.exceptSelector, n = this.settings.pressedClass, o = parseInt(this.settings.triggerLatency), r = parseInt(this.settings.removeLatency);
            $(e).on("touchstart", a, function(e) {
                if (!$(this).is(i)) {
                    var a = $(this);
                    t.mytimer = setTimeout(function() {
                        a.addClass(n);
                    }, o), t.tar = e.target;
                }
            }), $(e).on("touchmove", a, function() {
                $(this).is(i) || (clearTimeout(t.mytimer), $(this).removeClass(n), t.tar = null);
            }), $(e).on("touchend touchcancel", a, function(e) {
                if (!$(this).is(i) && t.tar === e.target) {
                    clearTimeout(t.mytimer), $(this).hasClass(n) || $(this).addClass(n);
                    var a = $(this);
                    setTimeout(function() {
                        a.removeClass(n);
                    }, r);
                }
            });
        }
    };
}();

var renderHeader = function(obj) {
    var __t, __p = "";
    with (Array.prototype.join, obj || {}) {
        if (__p += '<header topbutton-type="' + (null == (__t = data.topbuttonType) ? "" : __t) + '" sugstate="no" ' + (null == (__t = data.hasExtraSpace ? "" : "no-extra-space") ? "" : __t) + ">",
                __p += "", data.h5_settings.pgc_over_head || (__p += '<div class="tt-title">' + (null == (__t = data.article.title) ? "" : __t) + "</div>"),
                __p += "", __p += "", "zhuanma" == data.article.type) __p += '<div class="zhuanma-wrapper"><span class="zm-time">' + (null == (__t = data.article.publishTime) ? "" : __t) + '</span><span class="zm-author">' + (null == (__t = data.author.name) ? "" : __t) + "</span>",
        data.article.originalLink && (__p += '/<a class="original-link" href="' + (null == (__t = data.article.originalLink) ? "" : __t) + '">查看原文</a>'),
            __p += "</div>"; else {
            if (__p += '<div class="authorbar ' + (null == (__t = data.article.type) ? "" : __t) + '" id="profile">',
                    __p += '<a class="author-avatar-link pgc-link" href="' + (null == (__t = data.author.link) ? "" : __t) + '"><div class="author-avatar"><img class="author-avatar-img" src="' + (null == (__t = data.author.avatar) ? "" : __t) + '"></div>',
                data.useServerV && data.author.auth_info && (__p += "" + (null == (__t = buildServerVIcon2(data.author.auth_type, "avatar_icon")) ? "" : __t)),
                    __p += "</a>", __p += "", "wenda" === data.article.type ? __p += '<div class="wenda-info" style="display: ' + (null == (__t = data.author.isAuthorSelf ? "block" : "none") ? "" : __t) + ';"><span class="read-info brow-count"></span><span class="like-info digg-count-special"></span></div>' : "forum" === data.article.type && (__p += '<div class="wenda-info" style="display: ' + (null == (__t = data.author.isAuthorSelf ? "block" : "none") ? "" : __t) + ';"><span></span></div>'),
                    __p += "", __p += '<div class="author-function-buttons"><div class="mediasug-arrow-button iconfont"></div><a class="subscribe-button follow-button ' + (null == (__t = "followState" in data.author ? data.author.followState : "disabled") ? "" : __t) + '"data-user-id="' + (null == (__t = data.author.userId) ? "" : __t) + '"data-media-id="' + (null == (__t = data.author.mediaId) ? "" : __t) + '"href="javascript:;"style="display: ' + (null == (__t = data.author.isAuthorSelf || "wenda" === data.article.type && data.h5_settings.is_liteapp || "forum" === data.article.type && "following" === data.author.followState || data.hideFollowButton ? "none" : "block") ? "" : __t) + ';"id="subscribe"><i class="iconfont focusicon">&nbsp;</i></a></div>',
                    __p += '<div class="author-bar"><div class="name-link-w ' + (null == (__t = "wenda" === data.article.type && "" === data.author.intro && 0 === data.tags.length ? "no-intro" : "") ? "" : __t) + '"><a class="author-name-link pgc-link" href="' + (null == (__t = data.author.link) ? "" : __t) + '">' + (null == (__t = data.author.name) ? "" : __t) + "</a>",
                data.useServerV || (__p += "", "" != data.author.verifiedContent && (__p += '<div class="iconfont verified-icon">&#xe600;</div>'),
                    __p += ""), __p += '</div><a class="sub-title-w" href="' + (null == (__t = data.author.link) ? "" : __t) + '"><div class="article-tags">',
                data.tags.length > 0) {
                __p += "";
                for (var tag in data.tags) __p += "", __p += "原创" == data.tags[tag] ? '<div class="article-tag-original"></div>' : '<div class="article-tag">' + (null == (__t = data.tags[tag]) ? "" : __t) + "</div>",
                    __p += "";
                __p += "";
            }
            __p += "</div>", __p += "pgc" === data.article.type ? '<span class="sub-title">' + (null == (__t = data.article.publishTime) ? "" : __t) + "</span>" : "forum" === data.article.type ? '<span class="sub-title">' + (null == (__t = data.article.publishTime) ? "" : __t) + (null == (__t = data.author.intro && data.article.publishTime ? "&nbsp;&middot;&nbsp;" : "") ? "" : __t) + (null == (__t = data.author.intro) ? "" : __t) + "</span>" : '<span class="sub-title">' + (null == (__t = data.author.intro) ? "" : __t) + "</span>",
                __p += "</a></div></div>", __p += '<div class="mediasug-outer-container"><div class="mediasug-inner-container"><div class="ms-pointer"></div><div class="ms-title">相关推荐</div><div class="ms-list" id="mediasug-list"><div class="ms-list-scroller" id="mediasug-list-html"></div></div></div></div>',
                __p += '<div class="concern-guide-picture" id="concern-guide-picture" show="' + (null == (__t = data.h5_settings.is_show_concern_guide_picture && "following" !== data.author.followState && !data.author.isAuthorSelf ? "true" : "false") ? "" : __t) + '"></div>',
                __p += '<div class="copy-authorbar" id="copy-authorbar" style="display: none;" topbutton-type="' + (null == (__t = data.topbuttonType) ? "" : __t) + '"><a class="authorbar ' + (null == (__t = data.article.type) ? "" : __t) + '" id="profile-copy" href="' + (null == (__t = data.author.link) ? "" : __t) + '">',
                __p += '<div class="author-avatar-link pgc-link"><div class="author-avatar"><img class="author-avatar-img" src="' + (null == (__t = data.author.avatar) ? "" : __t) + '"></div>',
            data.useServerV && data.author.auth_info && (__p += "" + (null == (__t = buildServerVIcon2(data.author.auth_type, "avatar_icon")) ? "" : __t)),
                __p += "</div>", __p += '<div class="subscribe-button follow-button ' + (null == (__t = "followState" in data.author ? data.author.followState : "disabled") ? "" : __t) + '"data-user-id="' + (null == (__t = data.author.userId) ? "" : __t) + '"data-media-id="' + (null == (__t = data.author.mediaId) ? "" : __t) + '"style="display: ' + (null == (__t = data.author.isAuthorSelf ? "none" : "block") ? "" : __t) + ';"data-concerntype="detail_card"><i class="iconfont focusicon">&nbsp;</i></div><div class="author-bar"><div class="name-link-w ' + (null == (__t = "" === data.author.intro ? "no-intro" : "") ? "" : __t) + '"><span class="author-name-link pgc-link">' + (null == (__t = data.author.name) ? "" : __t) + "</span>",
            data.useServerV || (__p += "", "" != data.author.verifiedContent && (__p += '<div class="iconfont verified-icon">&#xe600;</div>'),
                __p += ""), __p += '</div><div class="sub-title-w"><span class="sub-title">' + (null == (__t = data.author.intro) ? "" : __t) + "</span></div></div></a></div>";
        }
        __p += "", __p += "", data.h5_settings.pgc_over_head && (__p += '<div class="tt-title pgc-over-head">' + (null == (__t = data.article.title) ? "" : __t) + "</div>"),
            __p += "</header>";
    }
    return __p;
}, renderFooter = function(obj) {
    var __t, __p = "";
    with (Array.prototype.join, obj || {}) __p += "<footer>", data.original && (__p += '<div class="carbon-copy"><span class="cc-text">转自头条号：</span><a class="cc-who" href="' + (null == (__t = data.original.link) ? "" : __t) + '">' + (null == (__t = data.original.name) ? "" : __t) + "</a></div>"),
        __p += "", data.wenda_extra && (__p += "", data.wenda_extra.wd_version >= 3 ? (__p += '<div class="wd-footer"><div class="publish-datetime">' + (null == (__t = data.article.publishTime) ? "" : __t) + "</div>",
        __p += data.wenda_extra.wd_version >= 6 ? '<a class="report" style="display:none" onclick="ToutiaoJSBridge.call(\'report\')">举报</a><span style="display:none" class="sep for-report" style="font-size:12px;">|</span><a class="editor-edit-answer no-icon" style="display:none">编辑</a><div class="dislike-and-report no-icon" style="display:none;"  onclick="var that = this;ToutiaoJSBridge.call(\'dislike\', {options: 0x11},function(r){if(r.err_no==0){that.style.color=\'#999\';that.innerHTML=\'已反对\'}});">反对</div>' : '<a class="editor-edit-answer" style="display:none">编辑</a><div class="dislike-and-report" onclick="ToutiaoJSBridge.call(\'dislike\', {options: 0x11});">不喜欢</div>',
        __p += "</div>") : __p += '<div class="wenda-bottom clearfix"><div class="create-time">' + (null == (__t = data.article.publishTime) ? "" : __t) + '</div></div><div class="bottom-buttons only-one"><div id="digg" data-answerid="' + (null == (__t = data.wenda_extra.ansid) ? "" : __t) + '" class="ib like" wenda-state="" aniok="' + (null == (__t = data.wenda_extra.aniok) ? "" : __t) + '"><span class="ibinner"><i class="iconfont iconb">&nbsp;</i><span class="b digg-count" realnum="0">赞</span></span></div><div id="bury" data-answerid="' + (null == (__t = data.wenda_extra.ansid) ? "" : __t) + '" class="ib unlike" wenda-state="" aniok="' + (null == (__t = data.wenda_extra.aniok) ? "" : __t) + '" style="display: none;"><span class="ibinner"><i class="iconfont iconb">&nbsp;</i><span class="b bury-count" realnum="0">踩</span></span></div></div>',
        __p += ""), __p += "", data.novel_data ? (__p += '<div class="serial">', __p += data.novel_data.pre_group_url ? '<a class="prev" id="prev_serial_link" href="' + (null == (__t = data.novel_data.pre_group_url) ? "" : __t) + '">上一章</a>' : '<span class="prev disabled">上一章</span>',
        __p += "", __p += data.novel_data.next_group_url ? '<a class="next" id="next_serial_link" href="' + (null == (__t = data.novel_data.next_group_url) ? "" : __t) + '">下一章</a>' : '<span class="next disabled">下一章</span>',
        __p += '<div class="index-wrap"><a class="index" id="index_serial_link" href="' + (null == (__t = data.novel_data.url) ? "" : __t) + '">目录（共' + (null == (__t = data.novel_data.serial_count) ? "" : __t) + "章）</a></div></div>") : data.wenda_extra && data.wenda_extra.wd_version >= 1 && data.wenda_extra.wd_version < 3 && (__p += '<div class="serial" style="display: ' + (null == (__t = data.wenda_extra.wd_version >= 2 ? "block" : "none") ? "" : __t) + ';"><a class="prev" id="wenda_index_link"><span id="total-answer-count-index"></span></a><a class="next" id="next_answer_link" onclick="ToutiaoJSBridge.call(\'tellClientRetryPrefetch\');">下一个回答</a></div>'),
        __p += "</footer>";
    return __p;
}, globalWendaStates = {}, TouTiao = {
    setFontSize: setFontSize,
    setDayMode: setDayMode
};

window.autoplayed = !1;

var contextRenderer = function(context) {
    "object" == typeof context && (wendaConetxtRender(context), function() {
        var cardTemplateFunctions = {
            movie: function(obj) {
                var __t, __p = "";
                with (Array.prototype.join, obj || {}) __p += '<a class="pcard movie" href="' + (null == (__t = url) ? "" : _.escape(__t)) + '"><div class="pcard-container pcard-vertical-border"><div class="pcard-clearfix"><div class="pcard-pull-left" style="position: relative;"><div class="iconfont playicon"><i></i></div><img class="movie-image" src="' + (null == (__t = poster) ? "" : _.escape(__t)) + '"/></div><div class="movie-right"><button type="button" class="button pcard-button pcard-pull-right">进入</button><div class=""><div class="pcard-h16 pcard-w1 pcard-bold mb11">' + (null == (__t = name) ? "" : __t),
                "" !== tag && (__p += '<span class="pcard-ry icon-ry"></span>'), __p += "</div>",
                "string" == typeof actor_name && (__p += '<div class="pcard-h12 pcard-w1" style="margin-bottom: 5px;">' + (null == (__t = actor_name) ? "" : __t) + "</div>"),
                    __p += '<div class="pcard-h12 pcard-w3 mb8">' + (null == (__t = desc) ? "" : __t) + "/" + (null == (__t = sub_title) ? "" : __t) + "</div>",
                    __p += "number" == typeof score ? '<div class="pcard-h12 iconfont film-star-score" data-score="' + (null == (__t = Math.ceil(score)) ? "" : __t) + '">' + (null == (__t = score.toFixed(1)) ? "" : __t) + "</div>" : '<div class="pcard-h12 pcard-w1">暂无评分</div>',
                    __p += "</div></div></div></div></a>";
                return __p;
            },
            fiction: function(obj) {
                var __t, __p = "";
                with (Array.prototype.join, obj || {}) __p += '<a class="pcard fiction" href="' + (null == (__t = url) ? "" : _.escape(__t)) + '"><div class="pcard-container pcard-vertical-border"><div class="pcard-clearfix"><div class="pcard-pull-left "><img class="movie-image" src="' + (null == (__t = poster) ? "" : _.escape(__t)) + '"></div><div class="movie-right"><button class="button pcard-button pcard-pull-right" action="concern" is-concerned="' + (null == (__t = Boolean(is_concerned)) ? "" : _.escape(__t)) + '" concern-id="' + (null == (__t = concern_id) ? "" : _.escape(__t)) + '" forum-id="' + (null == (__t = forum_id) ? "" : _.escape(__t)) + '">' + (null == (__t = is_concerned ? "已关注" : "关注") ? "" : _.escape(__t)) + '</button><div class="pcard-h16 pcard-w1 pcard-o1 mb12">' + (null == (__t = name) ? "" : _.escape(__t)) + '</div><div class="pcard-h12 pcard-w1 pcard-o2 mb6">' + (null == (__t = abstract) ? "" : _.escape(__t)) + '</div><div class="pcard-h12 pcard-w3">' + (null == (__t = category) ? "" : _.escape(__t)) + " &nbsp; " + (null == (__t = note) ? "" : _.escape(__t)) + "</div></div></div></div></a>";
                return __p;
            },
            auto: function(obj) {
                var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
                with(obj||{}){
                    __p+='<div class="pcard"><div class="p-autocard pcard-container pcard-vertical-border" data-content="content"><div class="pcard-item"><a href="'+
                        ((__t=( data.open_url ))==null?'':__t)+
                        '"><div class="auto-image" style="background-image: url('+
                        ((__t=( data.cover_url ))==null?'':__t)+
                        ');"></div></a><a class="series-info" href="'+
                        ((__t=( data.open_url ))==null?'':__t)+
                        '"><div class="pcard-h16 pcard-w1" style="margin-bottom: 8px;">'+
                        ((__t=( data.car_series))==null?'':__t)+
                        '</div><div class="pcard-h14 pcard-w1"> <span class="pcard-w4">'+
                        ((__t=( data.price ))==null?'':__t)+
                        '</span></div></a><a class="btn border" id="car-subscribe-btn" data-type="entity" data-action="'+
                        ((__t=( data.like_status ? 'unlike' : 'like' ))==null?'':__t)+
                        '" onclick="carLike(this,\'5\',\''+
                        ((__t=( data.cid ))==null?'':__t)+
                        '\'); return false">'+
                        ((__t=( data.like_status ? '已关注' : '关注' ))==null?'':__t)+
                        '</a></div></div></div>';
                }
                return __p;
            },
            game: function(obj) {
                var __p = "";
                with (Array.prototype.join, obj || {}) __p += '<div class="pcard game"><div class="pcard-caption"><span class="pcard-h14 pcard-w1">相关游戏</span></div><div class="pcard-container pcard-border game-body"></div></div>';
                return __p;
            },
            stock: function(obj) {
                var __t, __p = "";
                with (Array.prototype.join, obj || {}) {
                    __p += '<div class="pcard op-stock">', __p += data.length > 3 ? '<div class="pcard-container pcard-vertical-border opstock-body">' : '<div class="pcard-container pcard-vertical-border">',
                        __p += "";
                    for (var i in data) {
                        var _tempStock = data[i];
                        __p += '<div class="pcard-h16-large opstock-item"><span class="pcard-w1" style="width:64px;">' + (null == (__t = _tempStock.name) ? "" : __t) + "</span>",
                            __p += 2 == _tempStock.rise ? '<span class="opstock-txt-up ml15">' + (null == (__t = _tempStock.price) ? "" : __t) + '</span><span class="opstock-txt-up ml15">' + (null == (__t = _tempStock.rate) ? "" : __t) + "</span>" : 3 == _tempStock.rise ? '<span class="opstock-txt-down ml15">' + (null == (__t = _tempStock.price) ? "" : __t) + '</span><span class="opstock-txt-down ml15">' + (null == (__t = _tempStock.rate) ? "" : __t) + "</span>" : '<span class="opstock-txt-stop ml15">' + (null == (__t = _tempStock.price) ? "" : __t) + '</span><span class="opstock-txt-stop ml15">' + (null == (__t = _tempStock.rate) ? "" : __t) + "</span>",
                            __p += "", __p += 0 == _tempStock.selected ? '<a class="button pcard-pull-right pcard-w1 opstock-button" data-stock="' + (null == (__t = _tempStock.code) ? "" : __t) + '" action="addStock"><span><i class="pcard-icon opstock-iconfont icon-plus"></i></span>自选股</a>' : '<a class="pcard-pull-right pcard-w3"><span><i class="pcard-icon opstock-iconfont icon-done"></i></span>已添加</a>',
                            __p += "</div>";
                    }
                    __p += '</div><a class="pcard-w1 pcard-h14 pcard-footer" href="sslocal://webview?hide_bar=1&bounce_disable=1&url=http%3A%2F%2Fic.snssdk.com%2Fstock%2Fget_quota%2F%23tab%3Dportfolio" data-label="card_selected">进入我的自选股<span><i class="pcard-icon opstock-iconfont icon-rarrow"></i></span></a></div>';
                }
                return __p;
            }
        };
        "cards" in context && Array.isArray(context.cards) && context.cards.forEach(function(t) {
            var e = t.type, a = {
                value: Page.statistics.group_id,
                extra: {
                    item_id: Page.statistics.item_id,
                    card_type: t.type,
                    card_id: t.id
                }
            };
            if (e in cardTemplateFunctions) {
                if ("auto" === e) {
                    if (!Array.isArray(t.jump_url) || 0 == t.jump_url.length) return;
                    var i = $(cardTemplateFunctions[e]({
                        data: t
                    }));
                } else if ("game" === e) {
                    if (!Array.isArray(t.games) || 0 == t.games.length) return;
                    if (window.articleAlreadyHadGame) return;
                    var i = $(cardTemplateFunctions[e]({
                        data: t
                    }));
                    t.games.forEach(function(e) {
                        e.card_type = t.games.length + 2 + "", e.source = "recommend", e.tag = "article_match_app_ad";
                        var a = new GameCard(e);
                        i.find(".pcard-container").append(a.$card);
                    });
                } else if ("stock" == e) {
                    var n = [];
                    for (var o in t.stocks) {
                        var r = t.stocks[o];
                        try {
                            r = JSON.parse(r);
                        } catch (s) {}
                        n.push(r);
                    }
                    if (0 == n.length) return;
                    send_umeng_event("stock", "article_with_card", a);
                    var l = [];
                    if (l = n.filter(function(t) {
                            return 0 == t.selected;
                        }), 0 == l.length) return;
                    n.map(function(t) {
                        1 == t.selected && l.push(t);
                    });
                    var i = $(cardTemplateFunctions[e]({
                        data: l
                    }));
                } else var i = $(cardTemplateFunctions[e](t));
                i.on("click", ".button", function(e) {
                    e.stopPropagation(), send_umeng_event("detail", "click_card_button", a);
                    var i = $(this), n = i.attr("action");
                    "concern" === n ? dealNovelButton(e, t, i, a) : "addStock" == n && dealOptionalStockButton(e, i, t, l, a);
                }), "auto" === e ? (i.find("[data-label]").on("click", function(t) {
                    t.stopPropagation(), send_umeng_event("detail", "click_" + this.dataset.label, a);
                }), i.find('[type="button"]').on("click", function(t) {
                    t.stopPropagation(), location.href = this.dataset.href, send_umeng_event("detail", "click_card_button", a);
                })) : "stock" === e ? i.find('[data-label="card_selected"]').on("click", function(t) {
                    t.stopPropagation(), send_umeng_event("stock", "article_into_mystock", a);
                }) : i.on("click", function() {
                    send_umeng_event("detail", "click_card_content", a);
                }), needCleanDoms.push(i), $("footer").prepend(i), sendUmengWhenTargetShown(i.get(0), "detail", "card_show", a, !0);
                send_exposure_event_once(i.get(0), function () {
                    ToutiaoJSBridge.call("tracker",{
                        event: "show_event",
                        data:{obj_id: "page_detail_card",page_id: "page_detail",extra_params:{group_id:Page.statistics.group_id, "card_type":"artical_single"}}}, function(){})
                }, false);
            }
        });
    }(), function() {
        if (context.is_show_author_card && "pgc" === Page.article.type) {
            var t = $("#copy-authorbar"), e = {
                value: Page.statistics.group_id,
                extra: {
                    item_id: Page.statistics.item_id,
                    card_type: "pgc_author_card",
                    card_id: Page.author.userId,
                    card_mid: Page.author.mediaId
                }
            }, a = t.find(".authorbar");
            a.on("click", function() {
                send_umeng_event("detail", "click_card_content", e);
            }), needCleanDoms.push(a);
            var i = t.find(".subscribe-button");
            i.on("click", function(t) {
                t.preventDefault(), send_umeng_event("detail", "click_card_button", $.extend(!0, {}, e, {
                    extra: {
                        status: $(this).hasClass("following") ? 1 : 0
                    }
                }));
            }), needCleanDoms.push(i), new PressState({
                holder: "#copy-authorbar",
                bindSelector: ".authorbar",
                exceptSelector: ".subscribe-button",
                removeLatency: 500
            }), t.prependTo("footer").show(), needCleanDoms.push(t), sendUmengWhenTargetShown(t.get(0), "detail", "card_show", e, !0);

        }
    }(), function() {
        if ("know_more_url" in context) {
            var t = $('<p><a href="sslocal://webview?url=' + encodeURIComponent(context.know_more_url) + '&title=%E7%BD%91%E9%A1%B5%E6%B5%8F%E8%A7%88">了解更多</a></p>');
            $("article").append(t), t.on("click", function() {
                send_umeng_event("detail", "click_landingpage", {
                    value: Page.author.mediaId,
                    extra: {
                        item_id: Page.statistics.item_id
                    }
                });
            }), needCleanDoms.push(t);
        }
    }(), globalCachedContext = null, canSetContext = !1, window.sendTTCustomizeLog && window.sendTTCustomizeLog("end_context_render", +new Date() - startTimestamp));
}, change_following_state = function() {
    function t(t) {
        var e = $("header"), i = $(".subscribe-button");
        a = void 0, t ? (i.addClass("following").removeClass("disabled"), e.attr("fbs", "following")) : (i.removeClass("following disabled"),
            e.attr("fbs", ""));
    }
    var e, a;
    return function(i, n, o) {
        "function" == typeof o && o(i), n ? i !== a && (clearTimeout(e), a = i, e = setTimeout(t, 450, i, o)) : t(i, o);
    };
}(), doRecommendUsers = function() {
    var t = !1, e = {};
    return function(a, i, n) {
        return "function" == typeof i && "function" == typeof n ? e[a] ? void i(e[a]) : void $.ajax({
            dataType: "jsonp",
            url: "http://ic.snssdk.com/2/relation/follow_recommends",
            data: {
                to_user_id: a,
                page: 34
            },
            timeout: 1e4,
            beforeSend: function() {
                return t ? !1 : void (t = !0);
            },
            success: function(t, o, r) {
                "success" === t.message && "object" == typeof t.data && Array.isArray(t.data.recommend_users) && t.data.recommend_users.length >= 3 ? (e[a] = t.data.recommend_users,
                    i(t.data.recommend_users)) : n(t, o, r);
            },
            error: function(t, e, a) {
                n(a, e, t);
            },
            complete: function() {
                t = !1;
            }
        }) : void 0;
    };
}(), mediasugScroll = function() {
    var t = innerWidth, e = 148, a = {}, i = 0, n = !1, o = [], r = "in";
    return {
        init: function(t) {
            n || (n = !0, a = t, i = t.length, this.imprcache = {}, this.imprlog = []);
        },
        range: function(a) {
            var n = Math.floor(a / e);
            n = Math.max(n, 0), a += t;
            var o = Math.ceil(a / e);
            o = Math.min(o, i) - 1;
            for (var r = []; o >= n; ) r[r.length] = n++;
            return r;
        },
        pushimpr: function() {
            if (n) {
                if (Object.keys(this.imprcache).length > 0) {
                    for (var t in this.imprcache) {
                        var e = this.imprcache[t];
                        this.imprlog.push({
                            uid: t,
                            time: e,
                            duration: new Date().getTime() - e
                        }), console.info("leave", t);
                    }
                    this.imprcache = {};
                }
                console.info("pushimpr", this.imprlog), this.imprlog.length > 0 && (send_umeng_event("detail", "sub_reco_impression_v2", {
                    value: Page.author.userId,
                    extra: {
                        group_id: Page.statistics.group_id,
                        impression: client.isIOS ? encodeURIComponent(JSON.stringify(mediasugScroll.imprlog)) : mediasugScroll.imprlog,
                        need_decode: client.isIOS ? 1 : 0
                    }
                }), this.imprlog = []);
            }
        },
        dealimpr: function(t, e) {
            var i = this;
            t.forEach(function(t) {
                var e = a[t].user_id;
                if (e in i.imprcache) {
                    var n = i.imprcache[e];
                    i.imprlog.push({
                        uid: e,
                        time: n,
                        duration: new Date().getTime() - n
                    }), delete i.imprcache[e], console.info("leave", e);
                }
            }), e.forEach(function(t) {
                var e = a[t].user_id;
                i.imprcache[e] = new Date().getTime(), console.info("enter", e);
            });
        },
        handler: function() {
            if (n) {
                for (var t = mediasugScroll.range(this.scrollLeft || 0), e = [], a = {}, i = 0; i < o.length; i++) a[o[i]] = !0;
                for (i = 0; i < t.length; i++) t[i] in a ? delete a[t[i]] : e.push(t[i]);
                var r = Object.keys(a);
                mediasugScroll.dealimpr(r, e), o = t;
            }
        },
        pagescroll: function() {
            if (n) {
                var t = $("#mediasug-list").get(0), e = "in", a = t.getBoundingClientRect();
                (a.bottom <= 0 || a.top > (window.innerHeight || document.body.clientHeight)) && (e = "out"),
                    "in" === e && "out" === r ? (console.info("IN"), mediasugScroll.dealimpr([], o)) : "out" === e && "in" === r && (console.info("OUT"),
                            mediasugScroll.pushimpr()), r = e;
            }
        }
    };
}(), subscribeTimeoutTimer, checkHeaderDisplayed = checkDisplayedFactory("#profile", "showTitleBarPgcLayout"), checkWendanextDisplayed = checkDisplayedFactory(".serial", "showWendaNextLayout"), checkWendaABHeaderLayout = checkDisplayedFactory(".wenda-title", "showWendaABHeaderLayout");

GameCard.globalEventsList = {}, GameCard.startListen = function() {
    GameCard.listenStartted || (ToutiaoJSBridge.on("app_ad_event", function(t) {
        console.info("app_ad_event", t), t = t || {};
        var e = t.appad || {}, a = e.id;
        "function" == typeof GameCard.globalEventsList[a] ? GameCard.globalEventsList[a](t) : console.info("返回了没有注册的广告信息", t);
    }), GameCard.listenStartted = !0);
}, GameCard.noDownloaderWordsMap = {
    "1": [ "<i>&#xe689;</i>下载", "<i>&#xe653;</i>打开" ],
    "2": [ "<i>&#xe689;</i>下载", "<i>&#xe653;</i>打开" ],
    "3": [ "<i>&#xe689;</i><span>下载</span>", "<i>&#xe653;</i><span>打开</span>" ],
    "4": [ "立即下载&nbsp;&#xe689;", "立即打开&nbsp;&#xe653;" ]
}, GameCard.wordsMap = {
    "1": {
        download_active: "暂停",
        download_paused: "继续",
        download_failed: "<i>&#xe689;</i>下载",
        installed: "<i>&#xe653;</i>打开",
        download_finished: "安装",
        idle: "<i>&#xe689;</i>下载"
    },
    "2": {
        download_active: "暂停",
        download_paused: "继续",
        download_failed: "<i>&#xe689;</i>下载",
        installed: "<i>&#xe653;</i>打开",
        download_finished: "安装",
        idle: "<i>&#xe689;</i>下载"
    },
    "3": {
        download_active: '<span style="display: block; margin-top: 8px;">暂停</span>',
        download_paused: '<span style="display: block; margin-top: 8px;">继续</span>',
        download_failed: "<i>&#xe689;</i><span>下载</span>",
        installed: "<i>&#xe653;</i><span>打开</span>",
        download_finished: '<span style="display: block; margin-top: 8px;">安装</span>',
        idle: "<i>&#xe689;</i><span>下载</span>"
    },
    "4": {
        download_active: "暂停下载",
        download_paused: "继续下载",
        download_failed: "重新下载",
        installed: "立即打开&nbsp;&#xe653;",
        download_finished: "立即安装",
        idle: "立即下载&nbsp;&#xe689;"
    }
}, GameCard.prototype = {
    constructor: GameCard,
    getDownloader: function() {
        return client.isNewsArticleVersionNoLessThan("6.1.4");
    },
    getProgress: function(t, e) {
        return [ "download_active", "download_paused" ].indexOf(t) > -1 ? "1" == this.appad.card_type || "2" == this.appad.card_type ? 50 >= e ? '<div class="progress-ring"><i class="left"><i style="transform: rotate(' + (180 + 3.6 * e) + 'deg);"></i></i></div>' : '<div class="progress-ring"><i class="left"><i></i></i><i class="right"><i style="transform: rotate(' + (-360 + 3.6 * e) + 'deg);"></i></i></div>' : void 0 : "";
    },
    subscribe: function() {
        GameCard.globalEventsList[this.appad.id] = this.handler.bind(this), console.info("subscribe_app_ad", {
            data: this.appad
        }), ToutiaoJSBridge.call("subscribe_app_ad", {
            data: this.appad
        });
    },
    unsubscribe: function() {
        delete globalEventsList[this.appad.id], console.info("unsubscribe_app_ad", {
            data: this.appad
        }), ToutiaoJSBridge.call("unsubscribe_app_ad", {
            data: this.appad
        });
    },
    getInstalledState: function(t) {
        this.installed = t;
        try {
            this.$button.html(GameCard.noDownloaderWordsMap[this.appad.card_type][t]);
        } catch (e) {}
    },
    handler: function(t) {
        t.current_bytes = t.current_bytes >= 0 ? t.current_bytes : 0;
        var e = t.current_bytes / t.total_bytes;
        if (e = isNaN(e) ? 0 : Math.floor(100 * e), this.appad.card_type < 3) {
            var a = this.getProgress(t.status, e) + GameCard.wordsMap[this.appad.card_type][t.status];
            this.$button.html(a || "&nbsp;").attr("status", t.status);
        } else this.$button.html(GameCard.wordsMap[this.appad.card_type][t.status] || "&nbsp;"),
            this.$overlay.css({
                height: document.body.clientWidth < 375 ? .54 * e : .6 * e + "px"
            });
    },
    prepareData: function(t, e) {
        var a = this;
        if (t.type = "app", t.item_id = Page.statistics.item_id, t.media_id = Page.author.mediaId,
                t.log_extra = '{"rit":3,"item_id":0,"convert_id":0}', this.statisticsData = {
                value: Page.statistics.item_id,
                extra: {
                    card_type: t.card_type,
                    app_name: encodeURIComponent(t.name),
                    pkg_name: t.pkg_name,
                    app_id: t.app_id,
                    app_category: encodeURIComponent(t.game_type),
                    media_id: Page.author.mediaId
                }
            }, client.isIOS && t.download_url_for_ios) t.detail = t.download_url_for_ios, this.appad = t,
            setTimeout(function() {
                a.getInstalledState(0);
            }, 0); else {
            if (!client.isAndroid || !t.download_url_for_android) return;
            t.detail = t.detail ? "sslocal://webview?url=" + encodeURIComponent(t.detail) : t.download_url_for_android,
                this.appad = t, this.getDownloader() ? (this.appad.download_url = t.download_url_for_android,
                this.subscribe()) : ToutiaoJSBridge.call("isAppInstalled", {
                pkg_name: t.pkg_name
            }, function(t) {
                a.getInstalledState(1 == t.installed ? 1 : 0);
            });
        }
        this.buildDOM(), this.bindEvents(), e && $(e).replaceWith(this.$card);
    },
    buildDOM: function() {
        var r = function(obj) {
            var __t, __p = "";
            with (Array.prototype.join, obj || {}) __p += "", "1" == data.card_type ? __p += '<a class="game-downloader gd1" href="' + (null == (__t = data.detail) ? "" : __t) + '"><img class="gd-icon" src="' + (null == (__t = data.logo) ? "" : __t) + '"><div class="gd-button gd1-btn"></div><div class="gd1-cont"><div class="gd1-cont-name">' + (null == (__t = data.name) ? "" : __t) + '</div><div class="gd1-cont-text">' + (null == (__t = data.game_type) ? "" : __t) + '<span class="gd1-cont-split"></span>' + (null == (__t = data.size) ? "" : __t) + '</div><div class="gd1-cont-text">' + (null == (__t = data.desc) ? "" : __t) + "</div></div></a>" : "2" == data.card_type ? __p += '<a class="game-downloader gd2" href="' + (null == (__t = data.detail) ? "" : __t) + '"><img class="gd2-cover" src="' + (null == (__t = data.banner) ? "" : __t) + '"><div class="gd2-info"><div class="gd-button gd2-btn">&nbsp;</div><div class="gd2-cont"><div class="gd2-cont-name">' + (null == (__t = data.name) ? "" : __t) + '</div><div class="gd2-cont-text">' + (null == (__t = data.game_type) ? "" : __t) + '<span class="gd2-cont-split"></span>' + (null == (__t = data.size) ? "" : __t) + "</div></div></div></a>" : "3" == data.card_type ? __p += '<a class="game-downloader gd3" href="' + (null == (__t = data.detail) ? "" : __t) + '"><div class="gd-icon"><img  src="' + (null == (__t = data.logo) ? "" : __t) + '"  style="border-radius: 5px;"><div class="gd-overlay"></div></div><div class="gd-button gd3-btn"><i>&nbsp;</i><span>&nbsp;</span></div><div class="gd3-cont"><div class="gd3-cont-name pcard-h16 pcard-w1 pcard-bold">' + (null == (__t = data.name) ? "" : __t) + '</div><div class="gd3-cont-text pcard-h12 pcard-w1">' + (null == (__t = data.desc) ? "" : __t) + '</div><div class="gd3-cont-text pcard-h12 pcard-w3">' + (null == (__t = data.game_type) ? "" : __t) + "&nbsp;|&nbsp;" + (null == (__t = data.size) ? "" : __t) + "</div></div></a>" : "4" == data.card_type && (__p += '<a class="game-downloader gd4" href="' + (null == (__t = data.detail) ? "" : __t) + '"><div class="gd-icon"><img src="' + (null == (__t = data.logo) ? "" : __t) + '"  style="border-radius: 5px;"><div class="gd-overlay"></div></div><div class="gd4-cont"><div class="gd4-cont-name pcard-h16 pcard-w1 pcard-bold">' + (null == (__t = data.name) ? "" : __t) + '</div><div class="gd4-cont-text pcard-h12 pcard-w3">' + (null == (__t = data.game_type) ? "" : __t) + "&nbsp;" + (null == (__t = data.size) ? "" : __t) + '</div><div class="gd-button gd4-btn pcard-h12">&nbsp;</div></div></a>'),
                __p += "";
            return __p;
        };
        this.$card = $(r({
            data: this.appad
        })), this.$button = this.$card.find(".gd-button"), this.$overlay = this.$card.find(".gd-overlay");
    },
    bindEvents: function() {
        var t = this, e = this.statisticsData;
        this.$card.on("click", function() {
            send_umeng_event(t.appad.tag, "click_detail", e);
        }), needCleanDoms.push(this.$card), this.$button.on("click", function(a) {
            client.isAndroid && t.getDownloader() ? (a.stopPropagation(), a.preventDefault(),
                ToutiaoJSBridge.call("download_app_ad", {
                    data: t.appad
                })) : 1 == t.installed ? (a.stopPropagation(), a.preventDefault(), send_umeng_event(t.appad.tag, "click_open", e),
                ToutiaoJSBridge.call("openThirdApp", {
                    pkg_name: t.appad.pkg_name
                }, function(t) {
                    console.info("openThirdApp", t), 0 == t.code && ToutiaoJSBridge.call("toast", {
                        text: "打开应用失败，请稍后尝试"
                    });
                })) : client.isAndroid && (a.stopPropagation(), a.preventDefault(), location.href = t.appad.download_url_for_android,
                    send_umeng_event(t.appad.tag, "click_download", e));
        }), needCleanDoms.push(this.$button), sendUmengWhenTargetShown(this.$card.get(0), t.appad.tag, "show", e, !0);
    }
};

var canSetContext = !1, globalContent, globalCachedContext = null, needCleanDoms = [], imprProcessQueue = [];

window.Page = {}, window.OldPage = null, window.globalExtras = {};

var IOSImageProcessor = {
    _inView: function(t) {
        var e = t.getBoundingClientRect();
        return e.top < 0 ? !0 : (e.top >= 0 && e.left >= 0 && e.top) <= 2 * window.iH;
    },
    addGifLabel: function(t) {
        threadGGSwitch || 0 === t.find(".gif_play").length && t.append('<i class="gif_play"></i>');
    },
    removeGifLabel: function(t) {
        t.find(".gif_play").remove();
    },
    addLoadingSpinner: function(t, e) {
        var a = $('<i class="spinner rotate"/>');
        e || (t.addClass("bg_logo"), a.addClass("spinner_bg")), t.append(a);
    },
    removeLoadingSpinner: function(t) {
        t.removeClass("bg_logo").find(".spinner").remove();
    },
    getThreadImageWidth: function() {
        var t = this.$holders, e = t.length, a = window.aW, i = 4;
        1 === e ? ($("body").attr("images", 1), this.threadImageWidth = a) : 2 === e || 4 === e ? ($("body").attr("images", 4),
            this.threadImageWidth = Math.floor((a - i) / 2)) : ($("body").attr("images", 9),
            this.threadImageWidth = Math.floor((a - 2 * i) / 3)), $("body").attr("newimage", "true");
    },
    _pollImages: function() {
        clearTimeout(IOSImageProcessor._pollImagesTimer), IOSImageProcessor._pollImagesTimer = setTimeout(IOSImageProcessor._pollImagesHandler, 100);
    },
    _pollImagesHandler: function() {
        var t = IOSImageProcessor.$holders.filter('[loaded="0"]'), e = IOSImageProcessor.image_type + "_image";
        if (t.length <= 0) return console.info("poll done"), void $(document).off("scroll", IOSImageProcessor._pollImages);
        console.info("_pollImages...");
        for (var a = 0; a < t.length; a++) {
            var i = t[a];
            if (!IOSImageProcessor._inView(i)) break;
            ToutiaoJSBridge.call("loadDetailImage", {
                type: e,
                index: i.getAttribute("index")
            });
        }
    },
    show_holder: function(t, e, a) {
        var i = this.$holders || $();
        "number" == typeof a && (i = this.$holders.eq(a));
        for (var n = 0, o = i.length; o > n; n++) {
            var r = i.eq(n), s = 0, l = 0;
            if (t && (e = r.attr("state")), threadGGSwitch) {
                var c = r.attr("width"), d = r.attr("height");
                l = s = IOSImageProcessor.threadImageWidth, 1 === IOSImageProcessor.holders_len && (s = d * l / c),
                    "gif" === r.attr("type") || "2" === r.attr("type") ? r.append('<i class="forum-image-subscript">GIF</i>') : (c > 3 * d || d > 3 * c) && 1 !== IOSImageProcessor.holders_len && r.append('<i class="forum-image-subscript">长图</i>');
            } else if ("thumb" === e) l = r.attr("thumb_width") || 200, s = r.attr("thumb_height") || 200; else {
                var _ = l = r.attr("width") || 200;
                _ > .5 * window.aW && (l = window.aW), s = parseInt(l * r.attr("height") / _) || 200,
                "none" === e && (s = Math.min(s, .8 * window.aW));
            }
            if (r.css({
                    width: l + "px",
                    height: s + "px"
                }), t) return;
            threadGGSwitch || "gif" !== r.attr("type") && "2" !== r.attr("type") || ("origin" === e ? this.removeGifLabel(r) : this.addGifLabel(r)),
                "undefined" == typeof a ? r.attr("index", n).addClass(e).attr("loaded", 0) : r.removeClass("origin thumb none").addClass(e),
                r.attr("state", e);
        }
    },
    start: function() {
        if (this.$holders = $(".image"), this.holders_len = this.$holders.length, this.loaded_origin = 0,
            0 !== this.holders_len) {
            if (threadGGSwitch && ("none" === this.image_type ? this.lazy_load = !0 : 1 === this.holders_len ? this.image_type = "origin" : (this.image_type = "thumb",
                    this.lazy_load = !0), this.getThreadImageWidth()), threadGGSwitch || this.$holders.each(function(t, e) {
                    var a = $(e), i = a.parent();
                    i.is("p") ? "" !== i.text() ? (console.info("[" + t + "]所在段落有文本，应当分割"), a.wrap('<span class="image-wrap">')) : i.find(".image").length > 0 ? (console.info("[" + t + "]所在段落有其他图片，应当分割"),
                        a.wrap('<span class="image-wrap">')) : (console.info("[" + t + "]正确"), i.addClass("image-wrap")) : (console.info("[" + t + "]直接加包裹"),
                        a.wrap('<p class="image-wrap">'));
                }), this.show_holder(!1, this.image_type), threadGGSwitch) ; else if ("origin" !== this.image_type) {
                var t = $('<div class="toggle-img-con"><a class="toggle-img" id="toggle-img" href="javascript:;" tt-press>显示大图</a></div>');
                this.$holders.eq(0).before(t);
            }
            !this.lazy_load && this.holders_len > 10 && "none" !== this.image_type && (this.lazy_load = !0),
                this.lazy_load && "none" !== this.image_type ? (IOSImageProcessor._pollImages(),
                    $(document).off("scroll", IOSImageProcessor._pollImages), $(document).on("scroll", IOSImageProcessor._pollImages)) : threadGGSwitch && "none" === this.image_type && this.holders_len > 1 ? ToutiaoJSBridge.call("loadDetailImage", {
                    type: "all",
                    all_cache_size: "thumb"
                }) : ToutiaoJSBridge.call("loadDetailImage", {
                    type: "all"
                });
        }
    },
    tapEventHandler: function() {
        var t = $(this), e = t.attr("state"), a = t.attr("index"), i = t.find(".spinner").length > 0, n = "gif" === t.attr("type"), o = t.find("img").length, r = /^http(s)?:\/\//i.test(t.attr("href")), s = "full";
        if (i) return IOSImageProcessor.removeLoadingSpinner(t), sendBytedanceRequest("cancel_image?index=" + a),
        n && IOSImageProcessor.addGifLabel(t), r;
        if (threadGGSwitch ? (send_umeng_event("talk_detail", "picture_click", Page.forumStatisticsParams),
            "none" === e && (1 === IOSImageProcessor.holders_len ? s = "origin" : ToutiaoJSBridge.call("loadDetailImage", {
                type: "thumb_image",
                index: a
            }))) : ("thumb" === e || "none" === e) && (s = "origin", IOSImageProcessor.addLoadingSpinner(t, o),
                    n ? IOSImageProcessor.removeGifLabel(t) : "thumb" === e && t.addClass("animation")),
                r) return r;
        if (n) parseFloat(client.osVersion) >= 8 ? (sendBytedanceRequest("full_image?index=" + a),
        "origin" === s && (IOSImageProcessor.removeLoadingSpinner(t), IOSImageProcessor.addGifLabel(t))) : "full" !== s && sendBytedanceRequest(s + "_image?index=" + a); else if ("origin" === s) sendBytedanceRequest("origin_image?index=" + a); else {
            var l = t.attr("redirect-link");
            if ("string" == typeof l && l.indexOf("sslocal") > -1) location.href = l; else {
                var c = t.offset(), d = c.width || t.attr("width"), _ = c.height || t.attr("height");
                sendBytedanceRequest(s + "_image?index=" + a + "&left=" + c.left + "&top=" + c.top + "&width=" + d + "&height=" + _);
            }
        }
        return r;
    },
    appendLocalImage: function(t, e, a) {
        var i = IOSImageProcessor.$holders.eq(t), n = i.children("img"), o = i.attr("state");
        if (n.length > 0) n.attr("src", e); else {
            var r = document.createElement("img");
            r.onload = function() {
                this.classList.remove("waitloading");
            }, r.classList.add("waitloading"), r.src = e, i.attr("loaded", 1).prepend(r);
        }
        if (IOSImageProcessor.removeLoadingSpinner(i), a !== o && IOSImageProcessor.show_holder(!1, a, t),
            "origin" === a && (IOSImageProcessor.loaded_origin++, "origin" !== IOSImageProcessor.image_type && IOSImageProcessor.loaded_origin === IOSImageProcessor.holders_len)) {
            var s = document.querySelector(".toggle-img-con");
            s && (s.style.visibility = "hidden");
        }
        IOSImageProcessor.checkSamePictures(t, e, a);
    },
    checkSamePictures: function(t, e, a) {
        var i = IOSImageProcessor.$holders.eq(t), n = i.attr("href") || "", o = n.match(/url=[^&]*/);
        o && (o = o[0], IOSImageProcessor.$holders.each(function(i, n) {
            var r = n.getAttribute("href");
            1 != n.getAttribute("loaded") && i !== t && r.indexOf(o) > -1 && appendLocalImage(i, e, a);
        }));
    },
    bindEvents: function() {
        var t = $(document.body);
        t.on("click", "#toggle-img", function() {
            $(this).parent().css("visibility", "hidden"), "none" === IOSImageProcessor.image_type && IOSImageProcessor.$holders.removeClass("none"),
                IOSImageProcessor.image_type = "origin", sendBytedanceRequest("toggle_image");
        }), t.on("click", ".image", function(t) {
            IOSImageProcessor.tapEventHandler.call(this, t);
        });
    }
};

window.appendLocalImage = IOSImageProcessor.appendLocalImage, function() {
    IOSImageProcessor.bindEvents(), bindStatisticsEvents(), bindStatisticsEvents23(),
        window.onresize = function() {
            window.aW = window.innerWidth - 30, IOSImageProcessor.show_holder(!0);
        }, ToutiaoJSBridge.on("menuItemPress", processMenuItemPressEvent);
}(), document.addEventListener("DOMContentLoaded", function() {
    document.body.getAttribute("inited") || (document.body.setAttribute("inited", !0),
        setExtra());
}, !1);


// 懂车帝车系文章处理
(function($){
    var gInfo = window.h5_extra,
        gid = gInfo.str_group_id;

    var fullSeries = {"AC Schnitzer X5":2,"ALPINA B4":3,"DS 4S":5,"DS 5":6,"DS 6":7,"YUKON":9,"SAVANA":10,"SIERRA":11,"自由客":12,"牧马人":14,"大切诺基":18,"自由侠":22,"指南者":23,"自由光":24,"X-BOW":25,"RALLY FIGHTER":26,"名爵3SW":29,"名爵3":30,"名爵6":32,"锐行":33,"名爵ZS":34,"锐腾":35,"MINI":38,"MINI CLUBMAN":39,"MINI COUNTRYMAN":42,"MINI JCW":44,"MINI JCW CLUBMAN":45,"MINI JCW COUNTRYMAN":47,"smart fortwo":49,"smart forfour":50,"SWM斯威X7":53,"SWM斯威X3":54,"WEY VV7":55,"Giulia":56,"Stelvio":59,"Rapide":61,"V8 Vantage":63,"Vanquish":64,"V12 Vantage":65,"宝斯通":70,"奥迪A1":71,"奥迪A3(进口)":72,"奥迪A3(进口)新能源":73,"奥迪S3":74,"奥迪A4":75,"奥迪A5":76,"奥迪S5":77,"奥迪A6(进口)":78,"奥迪S6":79,"奥迪A7":80,"奥迪S7":81,"奥迪A8":82,"奥迪S8":83,"奥迪Q5(进口)":85,"奥迪SQ5":86,"奥迪Q7":87,"奥迪Q7新能源":88,"奥迪TT":89,"奥迪TTS":90,"奥迪R8":91,"奥迪RS 6":93,"奥迪RS 7":94,"奥迪A3":95,"奥迪A4L":96,"奥迪A6L":99,"奥迪Q3":100,"奥迪Q5":101,"巴博斯 smart fortwo":102,"巴博斯 SLK级":107,"宝骏310":108,"宝骏330":109,"宝骏510":110,"宝骏560":111,"宝骏630":112,"宝骏610":113,"宝骏730":114,"宝马1系(进口)":115,"宝马3系(进口)":116,"宝马3系GT":117,"宝马4系":118,"宝马5系GT":119,"宝马5系(进口)":120,"宝马6系":121,"宝马7系":122,"宝马7系新能源":123,"宝马X4":125,"宝马X3":126,"宝马X6":127,"宝马X5":128,"宝马X5新能源":129,"宝马2系多功能旅行车":130,"宝马2系":131,"宝马Z4":132,"宝马i3":133,"宝马i8":134,"宝马M3":135,"宝马M4":136,"宝马M5":137,"宝马M6":138,"宝马X5 M":139,"宝马X6 M":140,"宝马M2":141,"宝马1系":143,"宝马2系旅行车":144,"宝马3系":145,"宝马5系":146,"宝马5系新能源":147,"宝马X1":148,"宝马X1新能源":149,"宝沃BX5":150,"宝沃BX7":151,"Panamera":152,"Panamera新能源":153,"Macan":154,"Cayenne":155,"Cayenne新能源":156,"保时捷911":157,"Cayman":159,"保时捷718":161,"BJ20":163,"BJ40":164,"BJ80":165,"北汽幻速S2":166,"北汽幻速S3":167,"北汽幻速S5":169,"北汽幻速S6":170,"北汽幻速H2":171,"北汽幻速H2V":172,"北汽幻速H3":173,"北汽幻速H6":175,"绅宝D20":176,"绅宝D50":177,"绅宝D70":179,"绅宝D80":180,"绅宝CC":181,"绅宝X55":182,"绅宝X25":183,"绅宝X35":184,"绅宝X65":185,"北汽威旺S50":186,"北汽威旺M50F":187,"北汽威旺306":189,"北汽威旺M20":190,"北汽威旺307":191,"北汽威旺M30":192,"北汽威旺M35":193,"EC系列":194,"EV系列":196,"EU系列":197,"EH系列":199,"EX系列":201,"BJ 212":202,"战旗":203,"勇士":205,"北京BW007":206,"越铃":210,"奔驰C级":212,"奔驰E级":214,"奔驰GLA":215,"奔驰GLC":216,"奔驰A级":218,"奔驰B级":219,"奔驰CLA级":220,"奔驰C级(进口)":221,"奔驰E级(进口)":222,"奔驰CLS级":223,"奔驰S级":224,"奔驰S级新能源":225,"奔驰GLC(进口)":226,"奔驰GLE":228,"奔驰G级":230,"奔驰GLS":233,"奔驰R级":234,"奔驰SLC":238,"奔驰SL级":242,"威霆":244,"奔驰V级":245,"凌特":246,"图雅诺":247,"奔驰A级AMG":248,"奔驰CLA级AMG":249,"奔驰C级AMG":250,"奔驰CLS级AMG":251,"奔驰S级AMG":253,"奔驰GLA AMG":254,"奔驰G级AMG":255,"奔驰GLE AMG":256,"奔驰GLS AMG":258,"AMG GT":260,"迈巴赫S级":264,"奔腾B50":265,"奔腾B30":266,"奔腾B70":267,"奔腾B90":268,"奔腾X40":269,"奔腾X80":270,"INSIGHT":271,"本田CR-Z":273,"哥瑞":274,"竞瑞":275,"思域":276,"杰德":277,"思铂睿":278,"本田XR-V":279,"本田CR-V":280,"本田UR-V":281,"艾力绅":282,"飞度":283,"锋范":286,"凌派":287,"缤智":288,"雅阁":289,"歌诗图":290,"奥德赛":291,"冠道":292,"比速T3":293,"比速M3":294,"比速T5":295,"比亚迪F0":297,"比亚迪e5":302,"比亚迪G5":303,"速锐":304,"比亚迪秦":305,"比亚迪F3":307,"比亚迪唐":311,"比亚迪元":312,"比亚迪宋":314,"宋新能源":315,"比亚迪S7":316,"比亚迪S6":317,"比亚迪M6":318,"比亚迪e6":319,"标致308":333,"标致308S":334,"标致301":335,"标致408":336,"标致508":337,"标致2008":338,"标致3008":339,"标致4008":340,"标致5008":341,"昂科雷":342,"英朗":344,"威朗":345,"VELITE 5":346,"君越":347,"君威":348,"昂科拉":351,"昂科威":352,"别克GL8":353,"慕尚":354,"飞驰":355,"添越":357,"欧陆":358,"昌河Q25":361,"昌河Q35":362,"昌河M70":363,"福瑞达K22":365,"福瑞达":366,"昌河M50":368,"成功X1":371,"成功V1":372,"成功V2":373,"甲壳虫":376,"高尔夫(进口)":377,"高尔夫(进口)新能源":378,"蔚揽":380,"辉腾":383,"Tiguan":384,"途锐":385,"夏朗":386,"迈特威":387,"凯路威":388,"尚酷":389,"POLO":391,"朗逸":393,"桑塔纳":394,"朗行":395,"朗境":396,"凌渡":397,"帕萨特":398,"辉昂":402,"途观":403,"途观L":404,"途昂":405,"途安L":407,"捷达":408,"宝来":409,"高尔夫":410,"高尔夫·嘉旅":411,"蔚领":412,"速腾":414,"迈腾":415,"一汽-大众CC":416,"酷威":420,"东风A9":422,"御风":426,"御风EV":427,"帅客":428,"锐骐皮卡":429,"锐骐多功能车":430,"俊风":431,"东风风度MX5":432,"东风风度MX6":433,"东风风光360":434,"东风风光370":435,"东风风光580":436,"东风风光330":437,"景逸S50":439,"景逸XV":440,"景逸X3":441,"景逸X5":442,"风行SX6":443,"菱智":445,"风行CM7":446,"风行S500":447,"风行F600":448,"东风风神E30":449,"东风风神A60":451,"东风风神A30":453,"东风风神L60":454,"东风风神AX3":455,"东风风神AX5":456,"东风风神AX7":457,"东风小康K01":458,"东风小康V22":460,"东风小康K02":461,"东风小康C31":462,"东风小康C32":463,"东风小康V07S":464,"东风小康V27":465,"东风小康K17":466,"东风小康K07":467,"东风小康K07II":468,"东风小康V29":469,"东风小康C37":470,"东风小康C35":471,"东风小康C36":472,"东风小康K07S":473,"东风小康K05S":474,"V3菱悦":477,"翼神":478,"V5菱致":479,"V6菱仕":480,"三菱戈蓝":483,"东南DX3":484,"东南DX7":485,"California T":491,"F12berlinetta":492,"LaFerrari":493,"法拉利488":494,"GTC4Lusso":495,"812 Superfast":503,"菲亚特500":504,"菲跃":508,"致悦":509,"菲翔":510,"普瑞维亚":524,"埃尔法":525,"丰田86":529,"HIACE":530,"YARiS L 致享":532,"YARiS L 致炫":533,"雷凌":534,"凯美瑞":535,"汉兰达":536,"逸致":537,"威驰":538,"威驰FS":539,"普锐斯":541,"卡罗拉":542,"锐志":543,"皇冠":544,"RAV4荣放":546,"普拉多":547,"兰德酷路泽":548,"柯斯达":549,"揽福":552,"小超人":553,"雄师F16":555,"雄师F22":556,"启腾V60":557,"启腾M70":558,"启腾EX80":559,"嘉年华(进口)":560,"福克斯(进口)":561,"探险者":564,"Mustang":567,"福特GT":569,"C-MAX":570,"福特F-150 raptor":571,"撼路者":572,"途睿欧":573,"新世代全顺":574,"全顺":575,"嘉年华":576,"福克斯":577,"福睿斯":578,"蒙迪欧":579,"金牛座":582,"翼搏":583,"翼虎":584,"锐界":585,"萨普":588,"风景V3":589,"风景V5":590,"福田风景":591,"蒙派克E":592,"风景G7":594,"风景G9":595,"萨瓦纳":596,"伽途im6":597,"伽途im8":598,"拓陆者":599,"伽途ix7":600,"伽途ix5":601,"观致3":602,"观致5":603,"传祺GA3":608,"传祺GA3S视界":609,"传祺GA6":612,"传祺GA8":613,"传祺GS5":614,"传祺GS5 Super":615,"传祺GS4":616,"传祺GS8":617,"E美":618,"奥轩GX5":623,"广汽吉奥GX6":624,"星朗":625,"财运500":628,"财运300":629,"财运100":630,"广汽吉奥GP150":631,"星旺":632,"星旺CL":633,"骏意":640,"民意":641,"哈飞小霸王":642,"中意V5":643,"哈弗H1":644,"哈弗H2s":645,"哈弗H2":646,"哈弗H5":648,"哈弗H6":649,"哈弗H6 Coupe":650,"哈弗H7":651,"哈弗H8":652,"哈弗H9":653,"龙威":655,"海格H5C":656,"海格H5V":658,"海格H6C":659,"福美来":662,"海马M8":666,"海马S7":668,"普力马EV":670,"海马M3":675,"海马@3":676,"海马M6":677,"海马S5 Young":678,"海马S5":679,"福仕达腾达":681,"汉腾X7":682,"途腾T1":685,"途腾T2":686,"途腾T3":687,"红旗H7":690,"红旗L5":691,"华凯皮卡":692,"华颂7":698,"路盛E70":699,"路盛E80":700,"圣达菲经典":702,"宝利格":703,"圣达菲":704,"华泰iEV230":706,"华泰XEV260":707,"旗胜V3":708,"大柴神":712,"傲骏":714,"黄海N1":715,"黄海N2":716,"远景":729,"帝豪":733,"帝豪GL":734,"博瑞":738,"帝豪GS":740,"博越":741,"远景SUV":742,"远景X1":747,"悦悦":748,"和悦A30":750,"江淮iEV":751,"和悦":757,"瑞风A60":759,"瑞风S3":760,"江淮iEV6S":761,"瑞风S2mini":762,"瑞风S2":763,"瑞风S5":765,"瑞风M3":768,"瑞风M4":769,"瑞风M5":770,"瑞铃":774,"帅铃T6":775,"瑞风":776,"星锐":777,"瑞风S7":778,"江铃E200":779,"宝典":780,"域虎":781,"骐铃T5":783,"骐铃T7":784,"骐铃T3":785,"捷豹XE":790,"捷豹XJ":794,"捷豹F-PACE":795,"捷豹F-TYPE":796,"捷豹XFL":798,"阁瑞斯":801,"金杯大海狮":802,"金杯海狮":803,"金杯快运":804,"华晨金杯750":805,"海星T22":807,"金杯T30":808,"金杯T32":809,"海星A7":812,"海星A9":813,"小海狮X30":814,"海狮X30L":815,"智尚S30":816,"智尚S35":817,"金杯S70":818,"西部牛仔":819,"金典":822,"雷龙":823,"凯歌":825,"金威":826,"凯特":827,"金旅海狮":829,"艾菲":832,"九龙A4":836,"卡威W1":841,"卡威K1":842,"卡威K150":843,"开瑞K60":844,"开瑞K50":845,"杰虎":847,"优优":848,"凯迪拉克CTS(进口)":851,"凯雷德ESCALADE":853,"凯迪拉克ATS-L":855,"凯迪拉克CT6":859,"凯迪拉克XTS":860,"凯迪拉克XT5":861,"凯翼C3R":862,"凯翼C3":863,"凯翼X3":864,"凯翼V3":865,"全球鹰K17":869,"克莱斯勒300C(进口)":875,"大捷龙(进口)":876,"Huracan":877,"Aventador":878,"幻影":882,"古思特":883,"魅影":884,"曜影":885,"雷克萨斯CT":886,"雷克萨斯IS":887,"雷克萨斯ES":888,"雷克萨斯GS":889,"雷克萨斯LS":890,"雷克萨斯NX":891,"雷克萨斯GX":893,"雷克萨斯RX":894,"雷克萨斯LX":895,"雷克萨斯RC":896,"雷克萨斯RC F":898,"科雷傲":900,"科雷嘉":901,"梅甘娜":903,"风朗":904,"纬度":906,"卡缤":908,"理念S1":911,"力帆620EV":920,"力帆820":921,"力帆X60":922,"力帆X50":923,"迈威":924,"力帆X80":925,"轩朗":926,"兴顺":929,"丰顺":930,"乐途":932,"猎豹CS9":938,"猎豹CS10":941,"黑金刚":943,"猎豹Q6":944,"猎豹CT7":949,"林肯MKZ":950,"林肯大陆":952,"林肯MKC":954,"林肯MKX":955,"领航员":957,"北斗星X5":958,"北斗星":959,"利亚纳A6":961,"浪迪":963,"速翼特":964,"凯泽西":965,"吉姆尼(进口)":966,"超级维特拉":967,"奥拓":968,"雨燕":970,"天语 SX4":971,"启悦":973,"锋驭":974,"维特拉":975,"陆风X5":977,"陆风X7":979,"陆风X8":981,"陆风X2":983,"揽胜极光(进口)":984,"揽胜星脉":989,"发现":990,"揽胜":991,"揽胜运动版":992,"揽胜极光":993,"发现神行":994,"Elise":995,"Evora":996,"Exige":997,"马自达MX-5":1003,"阿特兹":1007,"马自达CX-4":1008,"马自达3 Axela昂克赛拉":1014,"马自达3星骋":1015,"马自达CX-5":1016,"Ghibli":1017,"总裁":1018,"GranTurismo":1019,"GranCabrio":1020,"Levante":1023,"迈凯伦540C":1026,"迈凯伦570GT":1027,"迈凯伦570S":1028,"迈凯伦625C":1029,"迈凯伦650S":1030,"迈凯伦675LT":1031,"迈凯伦720S":1032,"迈凯伦P1":1033,"摩根Aero":1034,"摩根Plus 8":1035,"3 Wheeler":1039,"摩根Aero 8":1040,"锐3":1041,"纳5":1042,"优6 SUV":1043,"大7 SUV":1044,"MASTER CEO":1045,"大7 MPV":1046,"开沃D11":1047,"讴歌CDX":1048,"讴歌ILX":1049,"讴歌TLX":1050,"讴歌RLX":1052,"讴歌RDX":1054,"讴歌ZDX":1055,"讴歌MDX":1056,"讴歌NSX":1057,"Huayra":1065,"优劲":1066,"优胜2代":1068,"奇瑞QQ":1069,"风云2":1074,"奇瑞E3":1075,"奇瑞E5":1079,"艾瑞泽3":1080,"艾瑞泽5":1081,"艾瑞泽7":1082,"艾瑞泽7e":1083,"瑞虎3":1091,"瑞虎3x":1092,"瑞虎5":1093,"瑞虎7":1094,"艾瑞泽M7":1096,"奇瑞eQ":1099,"奇瑞eQ1":1101,"启辰D50":1102,"启辰R50":1103,"晨风":1104,"启辰R50X":1105,"启辰T70":1106,"启辰T70X":1107,"启辰T90":1108,"启辰M50V":1109,"福瑞迪":1114,"起亚K2":1115,"起亚K3":1116,"起亚K4":1118,"起亚K5":1119,"起亚KX3":1121,"智跑":1123,"起亚KX5":1124,"起亚KX7":1125,"凯尊":1127,"起亚K9":1129,"极睿":1131,"索兰托":1133,"霸锐":1134,"佳乐":1135,"嘉华(进口)":1137,"速迈":1138,"玛驰":1140,"骊威":1141,"骐达":1143,"轩逸":1145,"LANNIA 蓝鸟":1146,"天籁":1147,"西玛":1148,"逍客":1150,"奇骏":1151,"楼兰":1152,"途乐":1159,"贵士":1160,"日产370Z":1162,"日产GT-R":1163,"帕拉丁":1166,"日产NV200":1167,"日产D22":1169,"日产ZN厢式车":1170,"纳瓦拉":1171,"荣威e50":1172,"荣威350":1173,"荣威360":1174,"荣威550":1175,"荣威e550":1176,"荣威950":1178,"荣威e950":1179,"荣威i6":1180,"荣威ei6":1181,"荣威RX5":1182,"荣威RX5新能源":1183,"荣威W5":1184,"如虎 CTR 3":1186,"赛麟野马":1194,"劲炫ASX":1198,"欧蓝德":1199,"帕杰罗·劲畅":1200,"帕杰罗·劲畅(进口)":1205,"帕杰罗(进口)":1206,"上汽大通G10":1211,"上汽大通T60":1212,"上汽大通V80":1213,"主席":1218,"蒂维拉":1219,"柯兰多":1220,"途凌":1221,"爱腾":1222,"享御":1223,"雷斯特W":1224,"路帝":1226,"思铭":1227,"力狮":1229,"斯巴鲁XV":1230,"森林人":1231,"傲虎":1232,"斯巴鲁BRZ":1234,"晶锐":1238,"昕锐":1239,"昕动":1240,"明锐":1241,"速派":1243,"Yeti":1244,"柯迪亚克":1245,"明锐(进口)":1246,"速尊":1247,"MODEL S":1254,"MODEL X":1255,"腾势":1256,"威兹曼GT":1259,"英致G3":1261,"英致G5":1262,"英致737":1263,"英致727":1264,"蔚来EP9":1265,"沃尔沃V40":1267,"沃尔沃S60":1269,"沃尔沃V60":1270,"沃尔沃V90":1273,"沃尔沃XC90":1277,"沃尔沃S60L":1279,"沃尔沃S60L新能源":1280,"沃尔沃S90":1281,"沃尔沃XC60":1282,"乐驰":1286,"五菱荣光小卡":1288,"五菱宏光":1290,"五菱荣光":1291,"五菱之光":1292,"五菱荣光V":1293,"五菱征程":1295,"五十铃mu-X":1296,"D-MAX":1297,"瑞迈":1298,"五十铃皮卡":1300,"瑞纳":1304,"瑞奕":1305,"悦纳":1306,"悦纳RV":1307,"伊兰特":1310,"悦动":1311,"朗动":1312,"领动":1313,"名图":1314,"索纳塔九":1319,"北京现代ix25":1321,"途胜":1322,"北京现代ix35":1323,"全新胜达":1324,"康恩迪":1325,"Veloster飞思":1326,"雅尊":1327,"捷恩斯":1331,"雅科仕":1333,"格越":1337,"H-1辉翼":1339,"赛欧":1347,"乐风RV":1349,"科鲁兹":1352,"科沃兹":1353,"迈锐宝":1354,"迈锐宝XL":1355,"创酷":1357,"科帕奇":1358,"探界者":1359,"库罗德":1363,"索罗德":1364,"科迈罗":1365,"爱丽舍":1367,"世嘉":1368,"雪铁龙C4L":1369,"C4世嘉":1370,"雪铁龙C5":1374,"雪铁龙C6":1375,"雪铁龙C3-XR":1376,"雪铁龙C4 Aircross":1384,"C4 PICASSO":1385,"DS 5LS":1386,"野马T70":1391,"野马EC70":1392,"野马T80":1393,"夏利N5":1395,"威志V5":1396,"夏利N7":1397,"骏派A70":1402,"骏派D60":1403,"森雅R7":1406,"佳宝T57":1408,"佳宝T51":1409,"解放T80":1411,"佳宝V52":1413,"佳宝V80":1414,"佳宝V75":1415,"佳宝V77":1416,"坤程":1417,"依维柯得意":1418,"依维柯Power Daily":1419,"英菲尼迪Q50L":1422,"英菲尼迪QX50":1423,"英菲尼迪Q50":1426,"英菲尼迪Q70":1427,"英菲尼迪ESQ":1428,"英菲尼迪QX30":1433,"英菲尼迪QX60":1435,"英菲尼迪QX70":1436,"英菲尼迪QX80":1437,"英菲尼迪Q60":1438,"永源五星":1442,"驭胜S330":1443,"驭胜S350":1444,"奔奔":1446,"长安CX20":1450,"悦翔V3":1451,"悦翔V5":1452,"悦翔V7":1453,"逸动":1455,"逸动新能源":1456,"睿骋":1459,"CS15":1460,"CS35":1461,"CS75":1462,"CS95":1463,"凌轩":1464,"新豹MINI":1466,"跨越王":1467,"长安V5":1468,"长安V3":1469,"欧力威":1470,"长安CX70":1471,"欧尚":1472,"长安星卡":1473,"欧诺":1475,"长安之星":1476,"长安之星2":1477,"长安之星7":1478,"长安之星3":1479,"长安之星9":1480,"睿行S50":1481,"神骐T20":1482,"神骐F30":1483,"神骐F50":1484,"尊行":1485,"睿行M80":1486,"睿行M90":1487,"睿行M70":1488,"长城C30":1500,"风骏5":1503,"风骏6":1504,"之诺1E":1505,"之诺60H":1506,"知豆D1":1508,"知豆D2":1509,"中华豚":1510,"中华H220":1511,"中华H230":1512,"中华H330":1515,"中华H530":1516,"中华H3":1517,"中华V3":1523,"中华V5":1524,"中兴C3":1526,"中兴GX3":1527,"威虎":1531,"小老虎":1533,"领主":1534,"芝麻":1537,"众泰E200":1539,"云100":1540,"众泰Z300":1543,"众泰Z360":1544,"众泰Z560":1546,"众泰Z500EV":1547,"众泰Z700":1548,"众泰T600":1552,"众泰SR7":1553,"众泰SR9":1554,"大迈X5":1555,"大迈X7":1556,"众泰V10":1558,"众泰T700":1559,"骁途":1562,"MODEL 3":1563,"宝骏310W":1565,"欧尚A800":1566,"奔奔mini-e":1568,"众泰T600 Coupe":1577,"上汽大通EG10":1578,"劲客":1579,"海马爱尚EV":1583,"长城C30新能源":1585,"传祺GS7":1590,"北斗星X5E":1591,"宝骏E100":1592,"奔奔EV":1593,"哈弗M6":1594,"黄海N3":1595,"传祺GE3":1598,"长安CS55":1599,"欧力威EV":1600,"伊兰特新能源":1601,"华泰EV160R":1608,"艾瑞泽5e":1609,"众泰T300":1610,"WEY VV5":1611,"DS 7":1613,"远景X3":1614,"蔚来ES8":1616,"众泰T500":1617,"英格尼斯":1618,"荣威RX3":1619,"别克GL6":1620,"传祺GS3":1621,"领克01":1622,"领克03":1623,"宋MAX":1624,"睿骋CC":1625,"五菱宏光S3":1626,"上汽大通D90":1627,"启辰D60":1628,"汉腾X5":1629,"威途X35":1630,"野马EC30":1631,"圣达菲7":1632,"奥迪Q2":1633,"奥迪TT RS":1634,"奥迪RS 3":1635,"丰田C-HR":1636,"御风P16":1637,"景逸X6":1638,"宝马6系GT":1639,"北汽幻速S7":1640,"宝马8系":1641,"天逸 C5 AIRCROSS":1642,"Urus":1643,"Chiron":1645,"奥迪Q8":1646,"北京BJ90":1647,"道达V8":1648,"奔驰GLC AMG":1650,"摩根EV3":1651,"U5 SUV":1652,"奔驰X级":1653,"Xpander":1654,"东风风神E70":1655,"鹏飞":1659,"雪铁龙C3 AIRCROSS":1660,"KAROQ":1661,"凯翼X5":1663,"吉利S1":1671,"T-ROC":1672,"ARCFOX-1":1686,"讴歌TLX-L":1687,"北汽幻速H5":1688,"东风风神AX4":1689,"Espace":1694,"圣达菲5":1695,"KX CROSS":1697,"华骐 300E":1698}

    var isHitFooterSeries = false;
    var aritcle_id_list = [];
    //埋点需求
    function clickEvt(pic_callback_stats){
        $('a[data-type]').each(function (index, item) {
            $(item).bind("click", function (event) {
                var position = event.currentTarget.getAttribute("data-type");
                var obj_id = "detail_" + position + "_series_tag";
                var extra_params = {group_id: window.h5_extra.gid, group_type:"text"}
                if(position == "bottom"){
                    extra_params.pic_callback_stats = pic_callback_stats;
                }
                extra_params = JSON.stringify(extra_params);
                ToutiaoJSBridge.call("tracker",{
                    event: "clk_event",
                    data:{
                        obj_id: obj_id,
                        page_id: "page_detail",
                        extra_params:extra_params
                    }
                }, function(){

                });
            })
        })
    }
    function showEvt(position, pic_callback_stats) {
        var obj_id = "detail_" + position + "_series_tag";
        var extra_params = {group_id: window.h5_extra.gid, group_type:"text"}
        if(position == "bottom"){
            extra_params.pic_callback_stats = pic_callback_stats;
        }
        extra_params = JSON.stringify(extra_params);
        ToutiaoJSBridge.call("tracker",{
            event: "show_event",
            data:{
                obj_id: obj_id,
                page_id: "page_detail",
                extra_params:extra_params
            }
        }, function(){

        });
    }
    // 文章顶部导航(motor_titlebar_car)
    function TitlebarHandler(header){
        var style = document.createElement("style");
        style.innerHTML = '.series-nav{margin:15px 15px 0px;display:none;font-size:0.9em}\
        .series-name{background-position:0 center;background-size:30px;background-repeat:no-repeat;padding-left:30px}\
        .series-name > span{margin-left:3px}\
        .series-nav a{color:#666;font-size: 14px;}\
        .series-nav img{vertical-align:middle;width:20px;height:20px;margin-right:4px}\
        .series-links{float:right}\
        .series-links a{display:inline-block;}\
        .series-links a span{border-right: 1px solid #E6E6E6;padding: 0px 10px;}\
        .series-links a:last-child span{border-right:none;padding-right:0px}\
         @media screen and (device-aspect-ratio: 40/71){.series-links a span{padding: 0px 7px;}}'

        document.querySelector("head").appendChild(style);
        this.header = header;
    }
    TitlebarHandler.prototype = {
        init: function(series, abtest){
            var header = this.header;
            this.nav = document.createElement("nav");
            this.nav.className = "series-nav";
            // if(abtest == 3) return;
            // if(abtest == 2){
            header.insertBefore(this.nav, header.children[1]);
            // }else{
            //   header.insertBefore(this.nav, header.firstChild);
            //}
            var car = $.isArray(series) ? series[0] : series;
            car = car || {};
            if(!car.series_id) return;
            var picURL = encodeURIComponent("https://i.snssdk.com/motor/car_page/v1/get_picture/?series_id=" +car.series_id);
            var canshu = encodeURIComponent("http://i.snssdk.com/motor/car_page/v1/series_config/?series_id="+car.series_id + "&gd_label=new_car_entity");
            this.nav.innerHTML = '<a class="series-name" href="'+ car.open_url +'&pre_page_position=top_series_tag" data-type="top" style="background-image:url('+resizeImg(car.cover)+')"><span>'+car.series_name+'</span></a>\
            <div class="series-links">\
            <a href="sslocal://concern?cid='+car.series_id+'&pre_page_position=top_series_tag" data-type="top"><span>详情</span></a>\
            <a href="sslocal://concern?cid='+car.series_id+'&no_sales=0&pre_page_position=text_series_tag&tab_sname=synthesis&need_scroll=1" data-type="top"><span>价格</span></a>\
            <a href="sslocal://webview?url='+picURL+'&hide_bar=1&disable_swipe=1" data-type="top"><span>图片</span></a>\
            <a href="sslocal://webview?url='+canshu+'&hide_bar=1&disable_swipe=1" data-type="top"><span>参数</span></a>\
            </div>';
            this.nav.style.display = "block";
        }
    }

    // 正文链接替换
    var cnNums = '零一二三四五六七八九'.split('');
    var cnReg = new RegExp(cnNums.join('|'), 'g');
    function ContentHandler(wrap){
        this.wrap = wrap;
    }
    ContentHandler.prototype = {
        regName: function(name){
            // 允许全角、中文数字
            return name.replace(/\(/g, '(\\(|（)').replace(/\)/g, '(\\)|）)')
                .replace(/\d/g, function(n){
                    return '('+n+'|'+cnNums[n]+')'
                });
        },
        fixName: function(name){
            return name.replace(/（/g, '(').replace(/）/g, ')').replace(cnReg, function(cn){
                return cnNums.indexOf(cn);
            }).toLowerCase();
        },
        init: function(){
            var wrap = this.wrap;
            var that = this;

            var seriesNames = Object.keys(fullSeries).sort(function(a, b){
                return a.length > b.length ? -1 : 1;
            });
            $("p", wrap).each(function(){
                var hits = 0;
                var content = this.innerHTML,
                    _content = that.fixName(content);
                var doSearch = function(name, start){
                    var idx = _content.indexOf(name.toLowerCase(), start || 0);
                    if(idx != -1){
                        aritcle_id_list.push(fullSeries[name]);
                        if(content.substr(idx-1, 1) == '>' || /^\w+$/.test(content.substr(idx-2, 2))){
                            // 不对已有链接做替换
                            idx = _content.indexOf('>', idx + name.length);
                            if(idx != -1){
                                doSearch(name, idx+1);
                            }
                            return;
                        }
                        hits ++;
                        content = content.substr(0, idx) + '<a href="sslocal://concern?cid=' + fullSeries[name] + '&pre_page_position=text_series_tag" data-type="text">' + name + '</a>' + content.substr(idx+name.length);
                        _content = that.fixName(content);
                        seriesNames.splice(seriesNames.indexOf(name), 1);
                    }
                }
                seriesNames.forEach(function(name){
                    doSearch(name);
                });
                if(hits){
                    this.innerHTML = content;
                    send_exposure_event_once(this, function () {
                        showEvt("text");
                    })

                }
            });
        }
    }

    function RecommendHandler(wrap) {
        var style = document.createElement("style");
        style.innerHTML = '.pcard{display:none !important}\
                           .card{background:#fff; margin:15px 0px;border: 1px solid #e6e6e6;border-left:none;border-right:none;padding:4px 0;}\
                           .card::after{content:"";border:0;}\
                           .card-3 {display: block;border:0;}\
                           .card-title {text-align: center;color:#999;font-size:12px;margin-bottom:13px;display:flex;align-items: center;}\
                           .card-list ul {display: flex;align-items: flex-start;}\
                           .card-item {flex: 1;overflow:hidden;text-align:center;}\
                           .card-item img{width:86%;}\
                           .card-item h5{color:#333;font-size:14px;font-weight:normal}\
                           .card-item p{color:#f85959;font-size:12px;}\
                           .card-1 .card-cover{flex:1;overflow:hidden;}\
                           .card-1 .card-cover img{width:100%}\
                           .card-1 .card-info{flex:2;padding-left:15px;box-sizing:border-box;}\
                           .card-1 .card-info h5{color:#333;font-size:16px;}\
                           .card-1 .card-info p{color:#f85959;font-size:12px;margin-top:3px}\
                           .card-1 .card-more{background:url("data:img/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAABGdBTUEAALGPC/xhBQAAAJZQTFRFmpqam5ubm5ubmpqamZmZmZmZmZmZmZmZmpqanZ2dmZmZmpqamZmZmpqamZmZmpqampqamZmZmpqa\
        mpqampqamZmZmpqamZmZmZmZmZmZmpqampqaoqKimpqaoaGhmpqampqan5+fmpqampqan5+fpaWlmZmZqqqqnZ2dv7+/mpqampqa////mpqamZmZm5ubAAAAmZmZiQQfzAAAADF0Uk5T6jMc8kHhIx69Gtzl1+D4UegyYvyNLfSA7I/Wfha4E7XAJSuzCBHIDCcEp9ECmr4XAP751QIAAAB/SURBVDjL7ZPb\
        FoFgEEb/ECEkKhUhp3T+3v/lvMK+zWqu91oz354Z08MyI/h34L3tGHhR9ULg2dX7g2ZcruQ8UZjF\
        Ro8vSj1fq6yRnsJTwzwGJ8VM+D5UhEBfSgm4O+hIWs+2LIw1ZXoKw4RPbLVkhVkCj+JKzyy/deNf\
        Dwr8AUQiJy7gAjhIAAAAAElFTkSuQmCC");width: 25px;height: 25px;background-size: 25px;}\
                           .connection-line{height: 1px;display: inline-block;background: #E6E6E6; width: 100%;margin: 0 10px; -webkit-box-flex: 1px; -webkit-flex: 1px;flex: 1px;}\
                           .card .card-link{display:block}\
                           .cardnew{position:relative;background:#fff;margin-bottom:5px}\
                           .cardnew:after{pointer-events:none;content:"";box-sizing:border-box;position:absolute;left:0;top:0;width:100%;height:100%;-webkit-transform-origin:0 0;transform-origin:0 0;border:1px solid #e6e6e6;}\
                           @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 2dppx) {.cardnew:after{width:200%;height:200%;-webkit-transform:scale(.5);transform: scale(.5);}}\
                           @media (-webkit-min-device-pixel-ratio: 3), (min-resolution: 3dppx) {.cardnew:after{width: 300%;height: 300%;-webkit-transform: scale(.333333);transform: scale(.333333);}}\
                           .cardnew .cardnew-head{display:-webkit-box;display:-webkit-flex;display:flex;box-sizing:border-box;border-radius:0;-webkit-box-align:center;-webkit-align-items:center;align-items:center;overflow:hidden;-webkit-user-select:none;user-select:none;padding: 11px 15px 12px 7px;}\
                           .cardnew-head .cover{width:46%;overflow:hidden;}\
                           .cardnew-head .cover img{width: 100%;}\
                           .cardnew-head .info{flex:1;padding-left:10px;box-sizing:border-box;line-height:1.4em;}\
                           .cardnew .info .series{color:#333;font-size:18px;font-weight:bold;white-space:nowrap}\
                           .cardnew .info .price{color:#ff5f00;font-size:14px;font-weight:bold;white-space:nowrap}\
                           .cardnew .info .config{color:#999;font-size:14px;white-space:nowrap}\
                           .cardnew .cardnew-list{padding:0 15px;}\
                           .cardnew .cardnew-list li{position:relative;line-height:1em;list-style:none;font-size:14px;}\
                           .cardnew .cardnew-list li:before{pointer-events:none;content:"";box-sizing:border-box;position:absolute;left:0;top:0;width:100%;height:100%;-webkit-transform-origin:0 0;transform-origin:0 0;border-width:1px 0 0;border-style:solid;border-color:#e6e6e6;border-radius:0;}\
                           @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 2dppx) {.cardnew .cardnew-list li:before{width:200%;height:200%;-webkit-transform:scale(.5);transform: scale(.5);}}\
                           @media (-webkit-min-device-pixel-ratio: 3), (min-resolution: 3dppx) {.cardnew .cardnew-list li:before{width: 300%;height: 300%;-webkit-transform: scale(.333333);transform: scale(.333333);}}\
                           .cardnew .cardnew-list li a{display:block;overflow:hidden;}\
                           .cardnew .cardnew-list li .series{float:left;max-width:70%;padding:16px 0;color:#333;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}\
                           .cardnew .cardnew-list li .series-all{position:relative;padding-right:22px;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABCCAYAAADjVADoAAAAAXNSR0IArs4c6QAAASZJREFUeAHt2OEJg0AMhmGvHcM1HMDNajfrAM7hGtavIBTpDwte8tm+gcM/cpc8XMDYNAQCCCCAAAIIIIAAAggggAACCCCAAAJ/IdB13aDlWuw1IjEBzPN8W87q27Yt0zQ9Is795ozqEG8Ia16WGJc1u8inbodbm1S/EWoDtcMC3W+wrW5GdQgVfwaMEIgzYIRBuGOEQjhjhEO4YqRAOGKkQbhhpEI4YaRDuGBYQDhgpMwaKtwtNANYxIcp9ZVXKeU+juNQO0kLiGwEIadDOCCkQ7ggpEI4IaRBuCGkQDgihEO4IoRCOCOEQbgjhECcAUEQKbNG1GezCtwb1afP7a98R4S9WIe8pxbROmQzNkEAAQQQQAABBBBAAAEEEEAAAQQQQODnBJ75t9Wok/Au4QAAAABJRU5ErkJggg==) right center no-repeat;background-size: 22px;}\
                           .cardnew .cardnew-list li .price{float:right;max-width:30%;padding:16px 0;color:#ff5f00;font-weight:bold;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}';
        document.querySelector("head").appendChild(style);
        this.wrap = wrap;
    }

    RecommendHandler.prototype = {
        init: function(recommend) {
            var that = this;
            var title = '';
            var list = [];
            var strhtml = '';
            recommend.forEach(function(item) {

                if(item.type === 1027) {
                    title = item.info.title;
                    list = item.info.list;
                    strhtml = that.template(3, list, title);
                    isHitFooterSeries = true;
                } else if(item.type === 1026){
                    list = item.info.list;
                    strhtml = that.template(1, list);
                    isHitFooterSeries = true;
                }else if(item.type === 1028 && !threadGGSwitch && IOSImageProcessor.image_type != "thumb"){
                    that.appendPicDesc(item.info.the_dict);
                }
                that.wrap.innerHTML = strhtml;
                if(item.type == 1027 || item.type == 1026){
                    send_exposure_event_once(that.wrap, function () {
                        showEvt("bottom", item.info.pic_callback_stats);
                    })
                }
            });
            if(!isHitFooterSeries){
                var device_id = getUrlParameter('device_id');
                $.ajax({
                    url:'http://i.snssdk.com/motor/info/api/2/article/information/get_car_info/v1/',
                    dataType:'jsonp',
                    data: {
                        device_id: device_id || 0,
                        series_ids: aritcle_id_list.join(",")
                    },
                    success: function (json) {
                        if(json.status !== 'success' || json.data.info.length == 0)  return;
                        var list = json.data.info;
                        var title = json.data.title;
                        strhtml = that.template(3, list, title);
                        that.wrap.innerHTML = strhtml;
                        send_exposure_event_once(that.wrap, function () {
                            showEvt("bottom", "fail_more_pic");
                        })
                    }
                })
            }
        },
        appendPicDesc: function(data){
            var $images = $(".image");
            var dedup_data = {};
            var picMap = [];
          /*  for(var p in data){
                if(picMap.indexOf(data[p].series_id) == -1){
                    picMap.push(data[p].series_id);
                    dedup_data[p] = data[p];
                }
            }*/
            dedup_data = data;
            for(var i = 0; i < $images.length; i++){
                var $holder = $images[i];
                var image_key = window.decodeURIComponent($images[i].href).split("&index")[0].split("/large/")[1];
                if(dedup_data[image_key]){
                    var card = dedup_data[image_key];
                    var descWrapper = $(' <a class="image-desc" data-type="pic" href="'+ card.open_url +'&pre_page_position=pic_series_tag">\
                                     <span class="desc-wrapper"><span class="title">'+ card.series_name +'</span>\
                                      <span class="price">' + card.price + '</span>\
                                      </span><span class="know-more">了解更多</span></a>');
                    $($holder).parent().append(descWrapper[0]);
                    send_exposure_event_once(descWrapper.get(0), function () {
                        showEvt("pic");
                    }, false);
                }
            }
        },
        template: function(type, data, title) {
            var html = '';
            if(type == 3) {
                html = '<div class="card card-3">';
                if(title) html += '<div class="card-title"><span class="connection-line"></span><span>'+title+'</span><span class="connection-line"></span></div>';
                html += '<div class="card-list"><ul>';
                data.forEach(function(card) {
                    html += '<li class="card-item"><a class="card-link" href="'+card.open_url+'&pre_page_position=bottom_series_tag" data-type="bottom">\
                             <img src="'+card.cover+'">\
                             <h5>'+card.series_name+'</h5>\
                             <p>'+card.price+'</p>\
                             </a></li>';
                });
                html += '</ul></div></div>';
            } else if(type == 1) {
                html = '<div class="cardnew">\
                        <a class="cardnew-head" href="'+data[0].open_url+'&pre_page_position=bottom_series_tag" data-type="bottom">\
                        <div class="cover"><img src="'+data[0].cover+'" /></div>\
                        <div class="info">\
                        <h5 class="series">'+data[0].series_name+'</h5>\
                        <p class="price">'+data[0].price+'</p>\
                        <p class="config"><span>级别：</span><span>'+(data[0].series_class||'')+'</span></p>';
                if(data[0].is_electrical == 1) {
                    html += '<p class="config"><span>续航里程：</span><span>'+(data[0].mileage||'')+'</span></p></div></a>';
                } else {
                    html += '<p class="config"><span>排量：</span><span>'+(data[0].displacement||'')+'</span></p></div></a>';
                }
                if(data[0].car_models_count > 0) {
                    html += '<ul class="cardnew-list">';
                    data[0].car_models_list && data[0].car_models_list.forEach(function(item) {
                        html += '<li><a href="'+item.open_url+'">\
                                <div class="series">'+item.year+'款 '+item.car_name+'</div>\
                                <div class="price">'+item.price+'</div></a></li>';
                    });
                    html += '<li><a data-type="style_list" href="'+data[0].open_url+'"><div class="series series-all">查看全部'+data[0].car_models_count+'款车</div></a></li>';
                    html += '</ul>';
                }
                html += '</div>';
            }
            return html;
        }
    }

    //## 标签不跳转
    function resolveTag() {
        var href_chengdu = $(".first-forum-p a");
        href_chengdu.each(function (index, item) {
            if(/^#(.*)#$/g.test(item.innerHTML)){
                $(item).replaceWith('<span>'+ item.innerHTML +'</span>');
            }
        })
    }

    function resizeImg(url) {
        if(/\/large\/w\d+\//.test(url)) {
            return url.replace(/\/large\/w\d+\//, '/list/126x82/');
        }
        return url;
    }

    function getUrlParameter(name) {
        var match = RegExp('[?&#]' + name + '=([^&]*)').exec(window.location.search||window.location.hash);
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    }
    document.addEventListener("DOMContentLoaded", function() {
        /* var titlebarHandler = new TitlebarHandler(document.querySelector("header")); */
        var contentHandler = new ContentHandler(document.querySelector("article"));
        var recommendHandler = new RecommendHandler(document.querySelector("footer"));

        contentHandler.init();
        resolveTag();

        window.processAutoArticle = function(data) {
            if(typeof data === 'undefined') return;
            if(typeof data === 'string') {
                data = data.replace(/\+/g, '%20');
                data = window.decodeURIComponent(data);
                try {
                    data = JSON.parse(data);
                } catch(e) {
                    data = data.replace(/\\\"/g, '\\\\"');
                    data = JSON.parse(data);
                }
            }
            /*
             if(data.motor_titlebar_car){
             titlebarHandler.init(data.motor_titlebar_car, data.car_series_navi_abtest);
             showEvt("top");
             }
             */
            if(data.motor_material_car_info){
                recommendHandler.init(data.motor_material_car_info);
                data.motor_material_car_info[0] && clickEvt(data.motor_material_car_info[0].info.pic_callback_stats);
            }
        }

    }, false);

})(Zepto);
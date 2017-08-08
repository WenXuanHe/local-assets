/**
 * 系统常用js函数
 */

/**
 * 
 * 改变某条记录 包括启用 停用 删除等操作
 * 参数说明： type:请求类型 url:请求地址 id:记录id
 * ajax请求成功后回调函数change_end();
 */
var KF5 = {};
KF5.alert = function(content){
	new Dialog({
		operation: false,
        overlay: true,
        title: '提示信息',
        content: content
	});
};
KF5.loading = '<div class="content_loading"></div>';
KF5.remove_loading = function()
{
	$(".content_loading").remove();
}
KF5.password_strength = function (pwd) {   
    if (pwd.length < 6) return 0;   
    var ls = 0;   
    if (pwd.match(/[a-z]/ig)) ls++;   
    if (pwd.match(/[0-9]/ig)) ls++;   
    if (pwd.match(/(.[^a-z0-9])/ig)) ls++;   
    if (pwd.length < 6 && ls > 0) ls--;   
    return ls;   
};
function desk_change(type,url,id)
{
	$.post(url, {type: type, id: id },
		function(data){
			change_end(type,data);
		}
	);
}
function errorSummary()
{
	if($(".errorSummary").length > 0){
		new Dialog({
	        overlay: true,
	        operation: false,
	        title: '提示信息',
	        content: $(".errorSummary").parent().html()
		});
	}
		//$(".errorSummary").dialog({title:"提示信息：",resizable: false, minHeight: 0});
//		$.dialog({
//			//icon:"warning",
//			title:"提示信息",
//			content:$(".errorSummary").parent().html(),
//			cancelVal: '确定',
//			cancel: true
//		});
}
/**
 * 显示提示信息，通常用于ajax提示
 * 例子：showNotice("请求已处理成功",true);
 */
function showNotice(message,type)
{	
	$(".alert_bar.frame").remove();
	if(type!=false) type = true;
	var alert_type = type ? "alert_success" : "alert_error" ;
	$(".frame-alert").append("<div class='alert_bar frame alert "+alert_type+"'><div class='alert_inner'><div class='alert_icon'></div><p>"+message+"</p></div><a class='alert_close' onclick=\"$(this).parent('.alert_bar').hide();\"></a></div>");
}
function apply_macro(key){
	if(key){
		$.post(apply_macro_url, { "id": key,"type":"get_macro"},
			function(data){
				eval(data);
				for(var i=0;i<actions.length;i++){
					
					switch (actions[i].key){
						case "public":
							if(actions[i].value == 1) $("#TicketForm_"+actions[i].key).attr("checked","checked");
							else $("#TicketForm_"+actions[i].key).removeAttr("checked");
							continue;
							break;
						case "group_id":
							$("#TicketForm_"+actions[i].key).val(actions[i].value);
							$("#TicketForm_"+actions[i].key).change();
							break;
						case "assignee_id":
							postvalues.assignee_id = actions[i].value;
						  	break;
						case "content":
							ueditor.setContent(actions[i].value,true);	//ueditor赋值
							//var content = $("#TicketForm_"+actions[i].key).val();
							//$("#TicketForm_"+actions[i].key).val(content+actions[i].value);
							break;
						case "tags":
							$("#TicketForm_tag").val("");	//清空tag输入框
							var tags = new Array();
							tags = actions[i].value.split(",");
							for (var g=0;g<tags.length ;g++ ){    
								add_tag(tags[g]);
						    }
							break;
						default:
							$("#TicketForm_"+actions[i].key).val(actions[i].value);
					}
					//不能给editor设置样式
					if(actions[i].key=='content') continue;
					
					$("#TicketForm_"+actions[i].key).attr("style","color: green");
				}
				cascade_macro();	//级联字段js
				$("#macro_items").hide("fast");
		});
	}
}
function update_assignee_id(){
	if(typeof(postvalues) != "undefined" && $("#TicketForm_assignee_id").val() != postvalues.assignee_id){
		setTimeout(function(){
			$("#TicketForm_assignee_id").val(postvalues.assignee_id);
		},500);
	}
};

//图片ajax预览
function attachment_preview(img_id){
	var xw=900; 
    var xl=500;
    var width =0;
    var height = 0;
    var bili,a,b;
    var content = '';
	$.getJSON("/attachments/ajax",{id:img_id},function(data){
	if(data){
		    bili = data.width/data.height;         
		    a = xw/data.width; 
		    b = xl/data.height; 
		    if(a<1 || b<1){ 
		        if(a<=b){
		        	width=xw; 
		        	height=xw/bili; 
		        }else{ 
		        	width=xl*bili; 
		            height=xl; 
		        } 
		    }else{
		    	width = data.width;
		    	height = data.height;
		    }
		    content = KF5.loading+'<img class="kf5-preview-img" width="'+width+'" height="'+height+'" src="'+data.src+'"/>';
            
            var dialog = new Dialog({
                overlay: true,
                operation: false,
                title: '预览',
                content: content,
                contentClass: 'popup-image'
            });

            dialog.$element.find('img.kf5-preview-img').on('load', function()
            {
                dialog.$element.find(".content_loading").remove();
                dialog.initPosition();
            });
		}else{
			KF5.alert("预览失败！图片不存在或者已被删除.");
		}
	}).fail(function()
    {
        KF5.alert("预览失败！图片不存在或者已被删除.");
    });
}
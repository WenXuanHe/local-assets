Display = function(options){
	this._settings = {
		action: 'content.php',			
		selector: '.photo',
		left: ''
	};
	for (var i in options) {
		this._settings[i] = options[i];
	}
	this.process();
}
Display.prototype = {
	process : function(){
		var option = this._settings;
		$(option.selector).mouseover(function(){
			if($(this).find(".display_layer_box").length==0){
				if($(this).find(".display_layer_wrap").length==0)
					$(this).append("<div class=\"display_layer_wrap\"></div>");
				var wrap = $(this).find(".display_layer_wrap");
				var img= $(this).find("img");
				img.appendTo(wrap);
				wrap.append("<div class=\"display_layer_box\" style=\"left:"+option.left+";\">"+KF5.loading+"</div>");
				$.get(option.action,{id:$(this).attr("data-uid")},function(data){
						wrap.find(".display_layer_box").html(data);
						wrap.find(".display_layer_box").bind("mouseleave",function(){
							$(".display_layer_box").hide();
						});
						wrap.find(".display_layer_box").show();
				});
			}else{
				$(this).find(".display_layer_box").show();
			}
		});
		$(option.selector).mouseout(function(){
			$(this).find(".display_layer_box").hide();
		});
	}
}
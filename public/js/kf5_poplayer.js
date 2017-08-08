var Kf5_PopLayer = {};
Kf5_PopLayer.render = function(selector,title){
	var dom = $(selector);
	dom.addClass("popup-layer");
	dom.wrapInner('<div class="popup-scrim"><div class="popup-inner"><div class="popup-wrapper"></div></div></div>');
	dom.prepend('<div class="popup-overlay"></div>');
	$(".popup-scrim").prepend('<a class="popup-close layer_close"></a>');
	$(selector+" .popup-inner").prepend('<div class="popup-title">'+title+'</div>');
	
	$(".popup-scrim").draggable({
		handle: '.popup-title', 
		cursor: 'move'
	});
	$(selector+" .popup-close").click(function(){
		$(selector).hide();
	});
};
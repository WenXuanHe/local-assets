

function question_pop() {
    var answer_btn = $(".answer");
    answer_btn.click(function(event) {
        $(this).parents(".question-comment-item-bottom").toggleClass("show");
    });
}
question_pop();




function js_select() {
	var select = $(".js-select");
    var title = $(".js-select").find(".title");
    var box = $(".js-select").find("ul");
    var item = box.find('a');
    title.click(function() {
    	box.not($(this).siblings('ul')).hide();
        $(this).next("ul").fadeToggle(200);
    })
    item.click(function(event) {
        var option = $(this).html();
        $(this).parents("li").addClass("active").siblings().removeClass('active')
        $(this).parents(".js-select").find('.title').html(option);
        $(this).parents("ul").fadeOut(200);
    });
}
js_select();



//tooltip

/*冒泡提示*/
function tip() {
    var js_tip = $(".tooltip");
    js_tip.hover(function() {
        var text = $(this).attr("title");
        var w = $(this).innerWidth();
        var h = $(this).innerHeight();
        var x = $(this).offset().left;
        var y = $(this).offset().top;
        $(this).attr("title", "");
        var $tip_main = $("<div class='tip-main'></div>").appendTo("body").html("<i></i>" + text);
        var t_w = $tip_main.innerWidth();
        $tip_main.fadeIn(400).css({
            left: x - (t_w / 2) + (w / 2),
            top: h + y + 10
        });
    }, function() {
        var text = $(".tip-main:last").text(); //注意是最后一个对象的原因
        $(this).attr("title", text);
        $(".tip-main").fadeOut(100, function() {
            $(this).remove();
        });
    });
}
tip()

//scrolltofixed


$(document).ready(function() {
  $('.js-scroll-fixed').scrollToFixed({ marginTop: 10});
});


//adjust textarea height
//autosize($('textarea'));



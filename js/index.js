(function($){
	var Base = {
		init : function(){
			var that = this;
			$(".content").css("height",$(document).height()-200);
			this.btns();
			this.initPage();
			if (history.pushState) {
			    window.addEventListener("popstate", function() {
			        that.reloadPage();
			    });
			}
		},
		page : {
			changTitle : function(title){
				document.title = title;
				$(".navgater label").html("用户体验监控 &gt; "+title);
			},
			getQueryString : function(name){
			     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
			     var r = window.location.search.substr(1).match(reg);
			     if(r!=null)return  unescape(r[2]); return null;
			}
		},
		reloadPage : function(){
			var action = this.page.getQueryString("action");
			//有返回BUG
			if(action!=null){
				$(".J_menu > li").each(function(){
						var url = $(this).find("a").attr("data-url");
						if(action==url){
							$(this).trigger("click",["call"]);

							return false;
						}
				});
			}
		},
		loading : function(){
			$(".content").html("<div class=\"spinner\"></div>");
		},
		initPage : function(){
			var that = this,
				flag = false,
				action = that.page.getQueryString("action");
			if(action !== null){
				//history.replaceState(null,"","");
				$(".J_menu > li").each(function(){
					var url = $(this).find("a").attr("data-url");
					
					if(url==action){
						flag = true;
						$(this).trigger("click");
						return false;
					}
				});
				if(!flag){
					$(".J_menu > li").eq(0).trigger("click");
					history.replaceState(null,document.title,"index.html");
					that.page.changTitle($(".J_menu > li:eq(0)").text());
					//that.loadHtml("index");
				}
			}else{
				that.page.changTitle($(".J_menu > li:eq(0)").text());
				$(".J_menu > li").eq(0).trigger("click");
			}
			
		},
		loadHtml : function(url){
			this.loading();
			$.get("page/"+url+".html",{r:new Date().getTime()},function(msg){
				$(".content").unbind().empty().append(msg);
			},"html");
		},
		btns : function(){
			var that = this;
			$(".J_menu > li").on("click",function(e,_call){
				var $this = $(this),
					url = $this.find("a").attr("data-url"),
					$li = $this;
				
				if(!$li.hasClass("li-current")){
					$li.siblings().removeClass("li-current") ;
					$li.addClass("li-current");
					that.page.changTitle($li.text());
					if(_call!="call"){
						history.pushState({title:document.title},document.title,"?action="+url);
					}
					that.loadHtml(url);
				}
			});
		}
	}
	$(function(){
		Base.init();
	});
})(jQuery);
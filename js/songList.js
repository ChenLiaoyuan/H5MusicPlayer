var songLists = [];

$(document).ready(function() {
	window.addEventListener("message", function(e) {
		//直接把歌单数据合并
		//Array.prototype.push.apply(songLists,e.data);

		//先置空，再指向新的歌单列表数据
		songLists = [];
		songLists = e.data;
		$("#userName").text("用户名：" + songLists[0].userName);
		$("ol").empty();
		for(var i = 0; i < songLists.length; i++) {
			$("#songList").append("<li>" + songLists[i].listName + "</li>");
		}
		var lis = $("ol li");
		for(var i = 0; i < lis.length; i++) {
			lis[i].index = i;
			lis[i].onclick = function() {
				//alert(this.index);
				//postMessage需要同源才可以传送，如协议、域名、端口相同，
				//因此只有主页的window才可以传送到window的message监听程序中
				//iframe的window.parent则就是主页的window
				window.parent.postMessage(songLists[this.index].listID, "/");
			}
		}
	}, false);

});

function mouseOver(t, e, data) {
	//参数含义  
	//t:指当前对象，即用户名的li元素
	//e:event事件
	//data:要显示的内容
	
	var ulli = document.getElementById("userName"); 
	//li元素的右下角相对于窗口的位置
	var tooltipLeft =  ulli.getBoundingClientRect().right; //左边
	var tooltipTop = ulli.getBoundingClientRect().bottom;  //上边
	
	if(e.target == t) {
		var tooltipHtml = "<div id='tooltip' class='tooltip'>" + data + "</div>";
		$(t).append(tooltipHtml); //添加到页面中  
		$("#tooltip").css({
			"top": tooltipTop + "px",
			"left": "100px",
		});//设置提示框的坐标
		$("#tooltip").show("fast"); 
	}
}

function mouseOut() {
	$("#tooltip").remove();
}

function switchUser() {
	window.parent.postMessage("switchUser", "/");
}
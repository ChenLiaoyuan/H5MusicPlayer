$(document).ready(function() {
	var musicInfo = [];
	window.addEventListener("message", function(e) {
		$(".loader2").css("display", "block");
		//先把之前的数据置空
		musicInfo = [];
		musicInfo = e.data;
		$("#songListName").text("歌单：" + musicInfo[0].songListName);
		$("ol").empty();
		for(var i = 0; i < musicInfo.length; i++) {
			$("#musicList").append("<li>" + musicInfo[i].songName + "</li>");
		}
		var lis = $("ol li");
		for(var i = 0; i < lis.length; i++) {
			lis[i].index = i;
			lis[i].onclick = function() {
				//alert(this.index);
				//postMessage需要同源才可以传送，如协议、域名、端口相同，
				//因此只有主页的window才可以传送到window的message监听程序中
				//iframe的window.parent则就是主页的window
				window.parent.postMessage(this.index, "/");
			}
		}
		$(".loader2").css("display", "none");
	}, false);

});

function mouseOver(t, e, data) {
	//参数含义  
	//t:指当前对象，即用户名的li元素
	//e:event事件
	//data:要显示的内容
	
	var ulli = document.getElementById("songListName"); 
	//li元素的右下角相对于窗口的位置
	var tooltipLeft =  ulli.getBoundingClientRect().right; //左边
	var tooltipTop = ulli.getBoundingClientRect().bottom;  //上边
	
	if(e.target.id == "songListName") {
		var tooltipHtml = "<div id='tooltip' class='tooltip'>" + data + "</div>";
		$(t).append(tooltipHtml); //添加到页面中  
		$("#tooltip").css({
			"top": tooltipTop + "px",
			"left": "100px",
		}).show("fast"); //设置提示框的坐标，并显示 
	}
}

function mouseOut() {
	$("#tooltip").remove();
}

function switchSongList() {
	window.parent.postMessage("switchSongList", "/");
}
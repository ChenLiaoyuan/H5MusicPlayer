var searchMusicLists = [];

$(document).ready(function() {
	window.addEventListener("message", function(e) {
		searchMusicLists = [];
		searchMusicLists = e.data;
		$("ol").empty();
		for(var i = 0; i < searchMusicLists.length; i++) {
			$("#searchResult").append("<li>" + searchMusicLists[i].songName + "</li>");
		}
		var lis = $("ol li");
		for(var i = 0; i < lis.length; i++) {
			lis[i].index = searchMusicLists[i].index;
			lis[i].onclick = function() {
				window.parent.postMessage(this.index, "/");
			}
		}
	}, false);

});
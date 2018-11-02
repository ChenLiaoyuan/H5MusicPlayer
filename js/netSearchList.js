var songSearchResults = [];

$(document).ready(function() {
	window.addEventListener("message", function(e) {
		songSearchResults = [];
		songSearchResults = e.data;
		$("ol").empty();
		for(var i = 0; i < songSearchResults.length; i++) {
			$("#searchResult").append("<li>" + songSearchResults[i].songName + "   -"+songSearchResults[i].artist+"</li>");
		}
		var lis = $("ol li");
		for(var i = 0; i < lis.length; i++) {
			lis[i].index = songSearchResults[i].index;
			lis[i].onclick = function() {
				window.parent.postMessage(this.index, "/");
			}
		}
	}, false);

});
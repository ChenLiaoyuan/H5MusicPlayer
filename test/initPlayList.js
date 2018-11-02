//用来存储音乐信息的对象数组
var musicInfos = [];
var urls = "";
//			{
//				songID = "";
//				songName: "",
//				artist: "",
//				albumPic: "",
//				totalTime: "",
//				mp3Url: ""
//			};

//网易云获取歌曲下载地址接口
//接口详细信息参考CeuiLiSA的知乎文章链接：https://zhuanlan.zhihu.com/p/30246788
//其中type=song指定该接口时获取歌曲信息
//id是歌曲的id，可以在网易云分享歌曲链接中看到
//br为歌曲波特率，可以为128k，或者320k
var songUrl = "https://api.imjad.cn/cloudmusic/?type=song&id=862101001&br=128000";

//其中id为某个歌单的id，比如“我的喜欢”歌单，同样在分享链接中可以找到
var playlistUrl = "https://api.imjad.cn/cloudmusic/?type=playlist&id=2419112903";

//通过jquery异步get方法获取接口的json数据
//			$.get(url,function(data,status){
//				if(status == "success"){
//					console.log(data.data[0].url);
//				}else if(status == "error"){
//					alert("获取歌曲信息失败，请确认网络是否正常。");
//				}
//			},'json');


function init(){
	//通过ajax异步请求数据，如果网络异常则给出提示
	$.ajax({
		url: playlistUrl,
		type: "post",
		dataType: 'JSON',
		async: true,
		success: getSongId,
		error: function(xhr, status, error) {
			alert("获取歌曲信息失败，请确认网络是否正常。");
			//					console.log(status);
			//					console.log(error);
		}
	});
	
	postMessage(musicInfos);
}

init();

function getSongId(data) {
	var tracks = data.playlist.tracks;
	for(var i = 0; i < tracks.length; i++) {
		var musicInfo = new Object();
		musicInfo.songID = tracks[i].id;
		musicInfo.songName = tracks[i].name;
		//为了简洁，只获取第一个歌手的名
		musicInfo.artist = tracks[i].ar[0].name;
		musicInfo.albumPic = tracks[i].al.picUrl;
		musicInfo.totalTime = tracks[i].dt;
		musicInfo.mp3Url = "";
		musicInfos.push(musicInfo);
	}
	getMp3Url(musicInfos);
	//				console.log(data.playlist.tracks[0].name);
}

function getMp3Url(musicInfos) {
	for(var i = 0; i < 1; i++) {
		var songUrl = "https://api.imjad.cn/cloudmusic/?type=song&id=" + musicInfos[i].songID + "&br=128000";
		$.ajax({
			url: songUrl,
			type: "get",
			dataType: 'JSON',
			async: true,
			success: function(data) {
				console.log(data.data[0].url);
				musicInfos[i].mp3Url = data.data[0].url;
			},
			error: function(xhr, status, error) {
				alert("获取歌曲信息失败，请确认网络是否正常。");
			}
		});
		//					$.get(songUrl,function(data){
		//						musicInfos[i].mp3Url = data.data[0].url;
		//					},'json');
	}
}
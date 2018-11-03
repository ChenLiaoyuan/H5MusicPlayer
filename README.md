## 前言
 - 这是我第一个GitHub项目，之前一直想在GitHub写点东西，近期又在学前端，刚好学到audio标签，平常时也比较喜欢听音乐写代码，因此就萌生了自己写一个音乐播放器的想法。利用了下班和周末的空闲时间，用了两周时间终于写出来了。当用代码一个个地把自己的想法实现出来，那种兴奋和成就感是无与伦比的。甚至周末的时候一码就码到通宵，还不觉得累哈哈。因为我也是初学，用GitHub把自己的注释和思路写出来，可以提供给跟我一样的伙伴来练手。
 - 首先要感谢两位大神的知识分享：
 	- 王乐平：[CSDN博客](https://me.csdn.net/lecepin)
	 - CeuiLiSA：[GitHub首页](https://github.com/CeuiLiSA)
	该音乐播放器是基于王乐平的基础上修改的，借鉴了他的思路进行完善和添加功能。该博客的链接为[一步一步实战HTML音乐播放器](https://blog.csdn.net/lecepin/article/details/54744009)。实现的思路写得非常清晰，让我对写播放器摸着了门路。而CeuiLiSA则详细地分享了网易云最新的接口[网易云音乐API](https://zhuanlan.zhihu.com/p/30246788)，可以利用这些接口获得歌单、歌曲、歌词、专辑图片等，让播放器的功能更加完善。
## 音乐播放器效果
	
 - 我把音乐播放器放到了腾讯云服务器了，可以直接点击下面链接查看效果，音乐播放器具备的功能基本都实现了。如当前歌单音乐列表、输入网易云用户名获取歌单进行切换、音乐列表歌名搜索、网络音乐搜索、电脑本地音乐添加播放、歌词滚动显示、歌曲播放进度等。
 - [H5MusicPlayer在线播放](http://119.29.174.67:8080/H5MusicPlayer/index.html)
 - 音乐播放器的整个界面效果：
 ![音乐播放器界面效果](https://github.com/ChenLiaoyuan/H5MusicPlayer/blob/master/img/H5MusicPlayer.png)
 
 - 从上到下的布局分为“音乐列表”“您的歌单”button按钮、专辑图片、歌名、歌手、歌词、播放控制按钮、歌曲时长、当前时间、播放进度条。
 ## 页面代码布局
 

```
<div class="player">
		<!--播放器顶部，用来装载各种菜单button-->
		<div class="header">
			<button id="musicBtn" class="button" onclick="showList()">音乐列表</button>
			<button id="back" class="button" onclick="goBack()" style="display: none;">返回</button>
			<button id="local" class="localButton" onclick="getLocalFiles()" style="display: none;">本地音乐</button>
			<button id="switch" class="localButton" onclick="myPrompt('绿水青山jv')">您的歌单</button>
			<button id="search" class="searchButton" onclick="promptSearch()" style="display: none;">搜索</button>
			<span id="title" style="display: block;" onmouseover="showShortcut(this,event)" onmouseout="showShortcutOut()">音乐播放器</span>
		</div>
		<div>
			<!--音乐专辑图片-->
			<div class="albumPic"></div>
			<!--音乐列表-->
			<div id="musicList" class="musicList">
				<iframe style="width: 100%;" src="music.html"></iframe>
			</div>
			<!--歌单列表-->
			<div id="songList" class="musicList">
				<iframe style="width: 100%;" src="songList.html"></iframe>
			</div>
			<!--本地音乐搜索列表-->
			<div id="searchMusicList" class="musicList">
				<iframe style="width: 100%;" src="searchMusicList.html"></iframe>
			</div>
			<!--网络音乐搜索列表-->
			<div id="netSearchList" class="musicList">
				<iframe style="width: 100%;" src="netSearchList.html"></iframe>
			</div>
			<!--本地文件夹音乐列表-->
			<div id="localMusicList" class="musicList">
				<iframe style="width: 100%;" src="localMusicList.html"></iframe>
			</div>
			<!--歌词背景-->
			<div id="lyricDiv" class="musicList" 
				style="width:320px;
				background-image: linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.2) ),url(img/clouds.jpeg);
				background-repeat: no-repeat; border: none;padding: 0px;
				text-align: center;
    			font-size: 20px;
    			color: #cbc7c7;
    			overflow: hidden;
    			position: relative;">
				<ul>
					<li>歌词</li>
				</ul>
			</div>
		</div>
		<!--音乐信息，歌名、歌手-->
		<div class="trackInfo">
			<div class="name"><p></p></div>
			<div class="artist"></div>
			<div class="album"></div>
		</div>
		<!--歌词-->
		<div class="lyric">
			<p id="lyric" onclick="showFullLyric()" 
				onmouseover="lyricTip(this,event)" 
				onmouseout="tipOut()">
				歌词
			</p>
		</div>
		<!--播放控制按钮，上一首下一首-->
		<div class="controls">
			<div class="play">
				<i class="icon-play"></i>
			</div>
			<div class="previous">
				<i class="icon-previous"></i>
			</div>
			<div class="next">
				<i class="icon-next"></i>
			</div>
		</div>
		<!--显示歌曲时间信息，当前播放时间、歌曲总时长-->
		<div class="time">
			<div class="current"></div>
			<div class="total"></div>
		</div>
		<!--使用渐变颜色显示歌曲时间进度条-->
		<div class="progress"></div>
		<!--加载动画，正在使用网络加载音乐文件时则显示出来，完成则隐藏-->
		<div class="loader"></div>
		<div class="loader2"></div>
		<!--audio标签装载当前播放的音乐文件-->
		<audio id="audio" preload="auto"><source src=""></audio>
	</div>
	<!--装载用户之前输入的网易云用户名，帮助用户快捷输入-->
	<datalist id="nameLists"></datalist>
	<!--装载用户之前搜索输入的歌曲名，帮助用户快捷输入-->
	<datalist id="songLists"></datalist>
```

 - 除了主页面显示的元素，还隐藏着下面的元素：
 ![隐藏元素](https://github.com/ChenLiaoyuan/H5MusicPlayer/blob/master/img/H5MusicPlayer2.png)
 - 这些元素会在按钮点击的情况触发显示，元素的隐藏和显示主要利用display的block或者none来控制。音乐列表的内容主要用iframe标签内嵌页面来显示。
 ## 播放器实现的逻辑思路
 - 首先音乐播放器有三个重要的对象：
 	1、当前播放音乐：currentPlaySong
 	2、当前播放音乐列表：musicInfos
 	3、当前播放状态：playStatus
 - currentPlaySong的属性为：
```
	{	
		songListName: "";  //所属的歌单名称 
		songID:"";  //歌曲ID，网易云音乐每首歌都有固定的ID，通过ID可以获得歌曲的播放链接
		songName: "";//歌名
		artist: "";//歌手
		albumPic: "";//专辑图片url
		totalTime: "";//歌曲总时长
		mp3Url: "";//该url的格式是http://music.163.com/song/media/outer/url?id=3986241
        	mp3Url2: "";//该url的格式是"https://m7.music.126.net/20181016104636/965ff036084dc30ec291460d1f4f85e3/ymusic/8827/447f/9ef4/3f399b1fd6d919555b55691e6632366d.mp3"
        上面两个是不同的链接格式，第一个链接我公司的网络设置了禁止访问网易云音乐163网站，所以无法播放，但一般的网络都可以访问。
        第二个链接则是通过网易云api接口获取到的，公司的网络没有禁止，可以访问，当然一般的网络也可以访问。
        两个链接都同时添加到audio下的source下，一个链接失效了，另一个链接可以使用。
		connectTimes: ""; //记录从网易云api接口获取了多少次mp3Url链接，超过一定的次数则停止获取，避免ID失效，死循环获取
		index: "" //是在歌曲列表中的第几首歌
	};
```
 - musicInfos就是一个数组，存储列表中的所有音乐对象。
 - playStatus的属性为：
```
{
	currentTrackLen: 0； //当前播放列表总的歌曲数 
	currentTrackIndex: 0;  //当前播放的是列表中的第几首歌
	currentTime: 0;  //当前播放的时长
	currentTotalTime: 0;  //当前播放歌曲的总时长
	playTimes: 0;  //点击上一首下一首的总次数，当达到10次就更新网易云接口获取的mp3Url链接，因为这个链接网易云设置了失效，30分钟左右就会失效
	_playStatus: false;  //使用下划线前缀表示这是受保护的对象，即protected
};
```
 - 主要的流程为：
 - ![加载流程](https://github.com/ChenLiaoyuan/H5MusicPlayer/blob/master/img/%E6%92%AD%E6%94%BE%E6%B5%81%E7%A8%8B.png)
### 异步获取歌单列表的代码为：

```
//获取歌单的所有歌曲信息
function initSongs(url) {
	var connectUrl = "";
	if(url) {
		connectUrl = url;
	} else {
		connectUrl = playlistUrl + playListID;
	}
	//通过ajax同步请求数据，如果网络异常则给出提示
	$.ajax({
		url: connectUrl,
		type: "post",
		dataType: 'JSON',
		async: false,
		cache: true,
		success: getSongId,
		error: function(xhr, status, error) {
			//alert("抱歉，服务器故障了。\n你可以播放默认歌曲和本地音乐。");
			//如果网络问题或者服务器挂了，则加载预先下载好的歌单信息
			getSongId(playListTest);
		}
	});
}

//根据网易云接口返回的信息初始化歌曲列表
function getSongId(data) {
	var tracks = data.playlist.tracks;
	//刷新歌曲之前，先把之前的歌曲置空
	musicInfos = [];
	for(var i = 0; i < tracks.length; i++) {
		var musicInfo = new Object();
		//只在第一个对象中存储歌单名称
		if(i == 0) {
			musicInfo.songListName = data.playlist.name;
		}
		musicInfo.songID = tracks[i].id;
		musicInfo.songName = tracks[i].name;
		//为了简洁，只获取第一个歌手的名
		musicInfo.artist = tracks[i].ar[0].name;
		musicInfo.albumPic = tracks[i].al.picUrl + '?param=270y270';
		musicInfo.totalTime = tracks[i].dt;
		musicInfo.mp3Url = "http://music.163.com/song/media/outer/url?id=" + tracks[i].id + ".mp3";
		musicInfo.mp3Url2 = ""; //第二个链接先置空，后面利用空闲时间异步获取，保证应用性能
		//connetTimes记录当前歌曲从接口获取mp3Url连接的次数，
		//超过5次则停止获取，
		//避免歌曲ID失效，网易云接口传过来的是空url，造成浪费资源多次获取
		musicInfo.connectTimes = 0;
		musicInfo.index = i;
		musicInfos.push(musicInfo);
	}

	//初始完成之后主要把赋值给正在播放的列表
	currentPlayList = musicInfos;
	currentPlayListIndex = 0;

	//现在有了新的解决mp3Url的方法，就是获取到歌曲ID后直接
	//在该链接后面加上ID的值http://music.163.com/song/media/outer/url?id= + id.mp3，
	//这为获取url链接提供了极大的方便，
	//既不用担心url链接失效，也不用担心获取url的接口失效或者IP被禁，
	//也避免了多次耗费资源循环地更新url链接

	//先同步获取第一首歌曲的第二个mp3Url2链接，
	//后面才异步获取当前播放歌曲的前10首和后10首。
	//由于网易云接口获取的url有时间限制，超过大概半个小时后url链接就会失效，
	//所以用户点击上一首或下一首共10次之后或者半个小时之后就会更新链接
	getMp3Url(musicInfos, 0, 1, 0, false);
}

//var errorCount = 0;
//initList当前需要获取url链接的数组，为musicInfos或者songSearchResults
function getMp3Url(initList, startindex, endIndex, goalIndex, isAsync, isCached) {

	for(var i = startindex; i < endIndex; i++) {
		var songUrl = "";
		if(goalIndex) {
			songUrl = "https://api.imjad.cn/cloudmusic/?type=song&id=" + initList[goalIndex].songID + "&br=128000";
		} else {
			songUrl = "https://api.imjad.cn/cloudmusic/?type=song&id=" + initList[i].songID + "&br=128000";
		}
		$.ajax({
			url: songUrl,
			type: "get",
			dataType: 'JSON',
			crossDomain: true,
			async: isAsync,
			cache: isCached ? isCached : isAsync,
			success: function(data) {
				if(isAsync) {
					var times = 0;
					while(times < initList.length) {
						//为防止异步加载数据顺序错乱，只有songID对应时才添加mp3Url链接
						if(initList[startindex].songID != data.data[0].id) {
							startindex = (startindex + 1) % initList.length;
							times++;
						} else {
							initList[startindex].mp3Url2 = data.data[0].url;
							startindex = (startindex + 1) % initList.length;
							break;
						}
					}
				} else {
					initList[goalIndex].mp3Url2 = data.data[0].url;
				}
			},
			error: function(xhr, status, error) {
				console.log(xhr.status);
				//errorCount++;
			}
		});
	}
}
```
### 初始化播放状态的代码为：
```
//当前播放器状态
var playStatus = {
	currentTrackLen: 0,
	currentTrackIndex: 0,
	currentTime: 0,
	currentTotalTime: 0,
	playTimes: 0, //点击上一首下一首的次数
	//使用下划线前缀表示这是受保护的对象，即protected
	_playStatus: false,
};

function initPlayStatus() {
	if(currentPlayList) {
		playStatus.currentTrackLen = currentPlayList.length;
	} else {
		playStatus.currentTrackLen = 0;
	}
	playStatus.currentTrackIndex = 0;
	playStatus.currentTime = 0;
	//因为timgTask会不断读取音乐的currentTime，
	//当点击本地文件夹音乐列表调用initPlayStatus()时,timgTask还会继续读取，
	//导致currentTime > currentTotalTime,误以为当前歌曲已经播放完成，
	//从而不断地播放一下首，导致bug
	playStatus.currentTotalTime = 10000000;
	playStatus.playTimes = 0;
	playStatus._playStatus = false;
}
```
### 初始化前端界面代码为：

```
//播放器控制方法
	playerControls = {
		//歌曲基本信息
		trackInfo: function(args) {
			//保存现在正在播放的歌曲
			currentPlaySong = args;

			//先添加audio元素
			$('#audio').remove();
			$('.player').append('<audio id="audio" preload="auto"><source  id="source1" src=""><source id="source2" src=""></source></audio>');
			$('#source1').attr('src', args.mp3Url2);
			$('#source2').attr('src', args.mp3Url);

			//加载audio音频
			$("#audio")[0].load();

			if(args.isLocal) {
				//如果是本地文件夹的歌曲，则在audio音频元素加载完成时进行读取音频时长
				$("#audio")[0].onloadedmetadata = function() {
					//音频时长单位为秒
					var totalTime = $("#audio")[0].duration;
					$('.player .time .total').text(timeConvert(totalTime));
					playStatus.currentTotalTime = totalTime - 1;
					args.totalTime = totalTime;
				}
			} else {
				//网易云接口返回的音频时长单位为毫秒
				//显示这首歌的时长，
				$('.player .time .total').text(timeConvert(args.totalTime / 1000));
				//减1是为了避免计算误差，无法自动下一首
				playStatus.currentTotalTime = Math.floor(args.totalTime / 1000) - 1;
			}

			//根据歌名长度设置字体大小，避免歌名太长超出边框
			$('.player .trackInfo .name p').text(args.songName);
			if(args.songName.length >= 40) {
				$('.player .trackInfo .name').css("font-size", "18px");
			} else if(args.songName.length > 30) {
				$('.player .trackInfo .name').css("font-size", "22px");
			} else {
				$('.player .trackInfo .name').css("font-size", "26px");
			}
			//歌手名称
			$('.player .trackInfo .artist').text(args.artist);
			//歌曲图片
			if(args.isLocal) {
				$('.player .albumPic').css('background', 'url(img/artist.jpg)');
			} else {
				$('.player .albumPic').css('background', 'url(' + args.albumPic + ')');
			}

			//获取歌词
			getLyric();
		}
	}	
```
### 播放音乐代码为：
*（主要是做了很多网络加载资源出错或mp3链接失效的处理）*
```
//播放、暂停状态处理
playStatus: function() {
	$('.player .controls .play i').attr('class', 'icon-' + (playStatus.playStatus ? 'pause' : 'play'));

	if(playStatus.playStatus) {
		//networkState = 3则说明音乐mp3URl链接失效，找不到资源，需要重新获取歌曲url链接
		//networkState = 0则说明该音乐的mp3Url为空
		if($("#audio")[0].networkState != 3 && $("#audio")[0].networkState != 0) {

			$("#audio")[0].play();

			//如果5秒后还是没有任何资源(reayState=0)而且网络仍然在加载(networkState=2)
			//则重新加载刷新歌曲，重新加载次数不超过3次，仍然失败则是网络问题
			setTimeout(function() {
				console.log("readyState:" + $("#audio")[0].readyState);
				console.log("networkState:" + $("#audio")[0].networkState);
				console.log("error:" + $("#audio")[0].error);
				if($("#audio")[0].readyState == 0 &&
					$("#audio")[0].networkState == 2) {
					//重新刷新的歌曲信息
					playerControls.trackInfo(currentPlaySong);
					$("#audio")[0].load();
					loadTimes++;
					//playStatus.playStatus = false;
					//先停顿0.1秒，让程序先加载音乐资源,否则networkState属性会为3，意为找不到资源
					if(loadTimes <= 4) {
						setTimeout(function() {
							playerControls.playStatus();
						}, 300);
					} else {
						loadTimes = 0;
						playStatus.playStatus = false;
						alert("加载歌曲失败，请检查网络。");
					}
				} else if($("#audio")[0].networkState == 3) {
					//如果5秒后该音乐的网络状态为3，则说明请求资源失效
					loadTimes = 0;
					invalidTimes++; //歌曲失效次数增加，超过3次刷新url链接
					playerControls.trackInfo(currentPlaySong);
					$("#audio")[0].load();
					//调用播放方法去刷新链接
					playerControls.playStatus();
				}
			}, 5000);

			//当点击下一首上一首的次数超过8次，对url进行更新
			//因为指定了ajax使用cached，已经加载url的不用重新连接网易云接口
			if(playStatus.playTimes >= 8 && currentPlayListIndex != 2) {
				init20Songs();
				playStatus.playTimes = 0;
			}

			//显示第一句歌词
			if(lyricResult.length <= 0) {
				$("#lyric").text("纯音乐，请欣赏。");
			} else {
				$("#lyric").text(lyricResult[0][1]);
			}

		} else {
			//先判断是否已经获取了3次
			if(currentPlaySong.connectTimes < 3) {
				//同步获取当前失效歌曲的url链接
				if(currentPlayListIndex == 1) {
					//如果是网络搜索结果则更新songSearchResults
					getMp3Url(songSearchResults, 0, 1, playStatus.currentTrackIndex, false);
					songSearchResults[currentPlaySong.index].connectTimes++;
					playStatus.playStatus = false;
					//重新加载失效的歌曲信息
					playerControls.trackInfo(songSearchResults[currentPlaySong.index]);
				} else if(currentPlayListIndex == 0) {
					//否则更新musicInfos
					getMp3Url(musicInfos, 0, 1, playStatus.currentTrackIndex, false);
					musicInfos[playStatus.currentTrackIndex].connectTimes++;
					playStatus.playStatus = false;
					//重新加载失效的歌曲信息
					playerControls.trackInfo(musicInfos[playStatus.currentTrackIndex]);
				}
				$("#audio")[0].load();
				//先停顿0.1秒，让程序先加载音乐资源,否则networkState属性会为3，意为找不到资源
				setTimeout(function() {
					playerControls.playStatus();
				}, 300);
				alert("歌曲链接失效，请重新点击播放键。");
			} else {
				playStatus.playStatus = false;
				alert("抱歉，该歌曲获取失败，请换下一首歌。");
			}

			//失效次数超过3次则说明缓存的url链接几乎都失效了，需要重新获取，刷新缓存
			invalidTimes++;
			if(invalidTimes >= 3 && currentPlayListIndex != 2) {
				init20Songs(false, false);
				invalidTimes = 0;
			}
		}
	} else {
		if($("#audio")[0].played) {
			$('#audio')[0].pause();
			//恢复歌词字样
			if(lyricResult.length <= 0){
				$("#lyric").text("纯音乐，请欣赏。");
			}else{
				$("#lyric").text("歌词");
			}

		}
	}
}
```
### 播放进度条和加载动画的代码为：
```
var timeOut;
//启动定时任务，加载时间进度条和显示加载动画
function timingTask() {
	//因为interval会有累积效应，比如alert一个窗口，用户很久都还没点击，
	//这时线程因为alert而堵塞，但interval仍然会计算时间，
	//将到时间但还没执行的操作添加到队列中。
	//当用户点击后，累积的interval就会一次性按顺序执行，
	//此时一个clearInterval便无法把所有的interval停止了。
	//因此会造成性能问题。
	//因此时间间隔比较小的尽量使用内嵌setTimeOut来代替。
	//注意：setTimeOut也会累积
	playStatus.currentTime = $('#audio')[0].currentTime;
	playerControls.playTime();

	if(playStatus.currentTime >= playStatus.currentTotalTime) {
		$('.player .controls .next').click();
	}

	//根据网络状态显示加载动画
	//readyState == 0 表示have-nothing，还没开始加载资源
	//readyState == 2 表示已经有当前数据，但是还没有下面播放的数据
	//readyState == 4 表示已经有足够的数据
	//networkState == 2 表示请求网络资源正在加载中
	//networkState == 1 表示已经请求到网络资源，可以播放了
	if(($("#audio")[0].readyState != 4) &&
		$("#audio")[0].networkState != 1) {
		if($(".loader:first").css("display") == "none") {
			$(".loader:first").css("display", "block");
		}
	} else {
		if($(".loader:first").css("display") == "block") {
			$(".loader:first").css("display", "none");
		}
	}

	//如果playStatus为true则循环调用自己，
	//否则将自己停止
	if(playStatus.playStatus) {
		timeOut = setTimeout(timingTask, 300);
	} else {
		clearTimeout(timeOut);
		//如果加载动画还在加载，则停止加载
		if($(".loader:first").css("display") == "block") {
			$(".loader:first").css("display", "none");
		}
		//刷新播放按钮状态
		$('.player .controls .play i').attr('class', 'icon-' + (playStatus.playStatus ? 'pause' : 'play'));
	}
}

//使用definedProperty方法监听playStatus属性，当为true的时候才进行定时任务
Object.defineProperty(playStatus, 'playStatus', {
	get: function() {
		return this._playStatus;
	},
	set: function(value) {
		this._playStatus = value;
		if(value == true) {
			//开启定时任务
			timingTask();
		} else {
			//按了停止键，则停止定时任务
			clearTimeout(timeOut);
			//如果加载动画还在加载，则停止加载
			if($(".loader:first").css("display") == "block") {
				$(".loader:first").css("display", "none");
			}
			//刷新播放按钮状态
			$('.player .controls .play i').attr('class', 'icon-' + (playStatus.playStatus ? 'pause' : 'play'));
		}
	}
});
```
### 播放电脑本地音乐的代码为：

```
function getLocalFiles() {
	//如果本地音乐列表不存在,则进行选择音乐文件
	if(localMusicFiles.length <= 0 || $("#localMusicList").css("display") == "block") {
		if($("#localMusic").length != 0) {
			$("#localMusic").fadeIn(200);
		} else {
			$("body").append('<div id="localMusic">' +
				'<div id="music_top">请选择您的音乐文件：' +
				'<div class="music_cross"><span class="icon-cross3"></span></div>' +
				'<br /> <span style="font-size:14px">（可以一次性选多首音乐）</span>' +
				'</div>' +
				'<div id="music_cont"><input id="musicFiles" class="musicInput"  type="file" accept="audio/*" multiple/></div>' +
				'<div class="music_confirm" id="music_confirm"><span class="icon-checkmark"></span></div>' +
				'</div>');      
		}

		$(".icon-cross3").unbind("click").click(function() {
			$("#localMusic").fadeOut(200);
		});

		$("#music_confirm").unbind("click").click(function() {
			var musicFiles = document.getElementById("musicFiles");
			//value属性保存的是文件的绝对路径,如果为空则说明没有选到文件
			if(musicFiles.value) {
				$("#localMusic").fadeOut(200);
				var files = musicFiles.files;
				var hasNotEmpty = true;
				var isMp3 = false;

				for(var i = 0; i < files.length; i++) {
					//如果选择的文件是音频文件才进行添加
					if(/audio\/\w+/g.test(files[i].type)) {

						//存在音频文件才把上次选择的本地音乐清空,再进行添加
						if(hasNotEmpty) {
							localMusicFiles = [];
							hasNotEmpty = false;
							isMp3 = true;
						}

						var musicInfo = new Object();

						musicInfo.songID = -1;
						musicInfo.songName = files[i].name;
						musicInfo.artist = "本地歌曲";
						musicInfo.albumPic = "";
						//本地歌曲时长时间还需要获取数据处理
						musicInfo.totalTime = 210000;
						musicInfo.mp3Url = "";
						musicInfo.mp3Url2 = "";
						musicInfo.connectTimes = 0;
						musicInfo.index = i;
						//先将本地音乐文件的files对象保存,等到用户点击歌曲的时候才进行加载播放
						musicInfo.musicData = files[i];
						//标志该歌曲是本地歌曲
						musicInfo.isLocal = true;
						localMusicFiles.push(musicInfo);
					}
				}

				//如果选择的所有文件都不是音频文件则进行提醒
				if(!isMp3) {
					alert("请选择音频文件");
					$("#localMusic").fadeIn(0);
				} else {
					//将本地音乐数据传送到本地音乐列表页面
					window.frames[4].postMessage(localMusicFiles, "/");
					$("#musicList").css("display", "none");
					$("#songList").css("display", "none");
					$("#searchMusicList").css("display", "none");
					$("#netSearchList").css("display", "none");
					$("#localMusicList").css("display", "block");
				}
			} else {
				alert("请选择音乐文件");
			}
		});
	} else {
		//如果本地音乐文件列表已经存在,则直接显示出来
		listButtonShow(true);
		$(".musicList").css("display", "none");
		$("#title").css("display", "none");
		$("#search").css("display", "block");
		$("#local").css("display", "block");
		$("#localMusicList").css("display", "block");
	}
}

```
### 解析歌词的代码为：

```
//调用trackInfo方法加载音乐信息的时候,也进行加载歌词,并进行解析
function getLyric() {
	if(currentPlaySong.isLocal) {
		//如果是本地音乐,则把歌词隐藏
		$(".lyric").css("display", "none");
	} else {
		//如果是网络音乐,则把歌词显示
		$(".lyric").css("display", "block");
		//通过ajax异步获取歌词信息，如果网络异常则给出提示
		$.ajax({
			url: lyricApi + currentPlaySong.songID,
			type: "get",
			dataType: 'JSON',
			async: true,
			cache: true,
			success: processLyric,
			error: function(xhr, status, error) {
				alert("抱歉,获取歌词失败，服务器出故障了。");
			}
		});
	}
}

//解析歌词
function processLyric(lyricData) {
	//正则表达式,匹配[00:59.40]这是时间格式
	var pattern = /\[\d{2}:\d{2}.\d+\]/g;
	
	//如果标志没有歌词或者歌词内容不匹配时间格式,则归为纯音乐
	if(lyricData.nolyric == true || !pattern.test(lyricData.lrc.lyric)) {
		lyricResult = [];
		lyricArtistMessage = [];
		$("#lyricDiv").empty();
		$("#lyricDiv").append("<ul><li>纯音乐,请欣赏。</li></ul>")
		$("#lyric").text("纯音乐，请欣赏。");
		return;
	}

	var lyricInfo = lyricData.lrc.lyric;
	var lines = lyricInfo.split("\n");

	//用来存储解析出来的歌词,格式如下[[time,lyricString],[time,lyricString],.....]
	lyricResult = [];
	lyricArtistMessage = [];

	//有一些歌词前面时歌手的介绍,没有歌词的,需要把它去掉
	//直到匹配到有时间的歌词才会停止循环
	var artistPattern = /\[\w+:/g;
	
	//需要注意,正则表达式使用g模式的话,下一次匹配会从lastIndex开始匹配,
	//因为上面使用了pattern进行了匹配,有可能lastIndex不为0,所以需要重置为0
	
	pattern.lastIndex  = 0;
	
	while(!pattern.test(lines[0])) {
		//先把歌手信息保存下来,因为全屏歌词的时候需要显示
		var lyricMessage = lines[0].replace(artistPattern, "").slice(0, -1);
		lyricMessage.length > 0 ? lyricArtistMessage.push(lyricMessage) : 0;

		//去掉第一个元素并返回剩下元素
		lines = lines.splice(1);
	}

	//lines最后一行是空的话把它去除掉
	lines[lines.length - 1].length == 0 && lines.pop();

	lines.forEach(function(value, index, array) {
		//返回匹配的时间
		var time = value.match(pattern);
		//将时间置换成空格,返回歌词字符串内容
		var lyricString = value.replace(pattern, "");
		//由于一行歌词会有多个时间, 如[03:33.65][03:35.39],所以需要进一步分离
		time.forEach(function(value2, index2, array2) {
			//去掉前后的[]
			var t = value2.slice(1, -1).split(":");
			//用秒数表示当前歌词的时间
			var seconds = parseInt(t[0]) * 60 + parseFloat(t[1]);
			//将时间和歌词以数组的形式压进lyriclyricResult中
			lyricResult.push([seconds, lyricString]);
		});
	});

	//将结果按照时间排序,保证歌词正确有序输出
	lyricResult.sort(function(a, b) {
		//如果想要a在b前面,则返回一个负数,否则a想排在b后面,则返回一个正数
		//所以想要元素按照升序排序,则返回a与b的差值就行
		return a[0] - b[0];
	});

	addLyric();
	//把歌词位置置为初始化
	lyricIndex = 1;
	showLyric();
}

function addLyric() {
	$("#lyricDiv").empty();
	var ul = $("<ul></ul>");
	//歌手信息
	for(var i = 0; i < lyricArtistMessage.length; i++) {
		ul.append("<li>" + lyricArtistMessage[i] + "</li>")
	}
	//歌词信息
	for(var i = 0; i < lyricResult.length; i++) {
		ul.append("<li>" + lyricResult[i][1] + "</li>")
	}
	$("#lyricDiv").append(ul);
}

//监听audio的timeUpdate事件,
//第一句歌词会在点击播放按钮时显示出来,
//如果当前时间已经大于第一句歌词的时间,则说明第一句唱完了,
//则把第一句隐藏,更改歌词内容,显示第二句歌词.
//再把当前时间跟第三句歌词时间进行比较,依次循环.

var lyricIndex = 1; //记录当前是第几条歌词
function showLyric() {

	//因为歌词头部还有歌手信息,因此高亮的歌词从j开始
	var j = lyricArtistMessage.length;
	$("#lyricDiv ul li").get(j).style.color = "#ff6666";

	//检测第第三句歌词,如果是中文,则歌词大小改为18px
	if(lyricResult.length > 3) {
		for(var i = 0; i < lyricResult[2][1].length; i++) {
			//因为歌词英文的分号为’,所以也要排除这个
			if(lyricResult[2][1].charCodeAt(i) > 127 && lyricResult[2][1].charAt(i) != '’') {
				$("#lyricDiv ul").css("font-size", "19px");
				$("#lyric").css("font-size", "19px");
			}
		}
	}

	$("#audio")[0].ontimeupdate = function(e) {

		if(lyricResult.length > 0 && this.currentTime > lyricResult[lyricIndex][0]) {
			//如果大屏歌词没有打开,则小框进行显示
			if($("#lyricDiv").css("display") == "none") {
				$("#lyric").fadeOut(0);
				$("#lyric").text(lyricResult[lyricIndex][1]);
				$("#lyric").fadeIn();
			} else {
				$("#lyric").text("歌词");

				//把上一条歌词颜色进行恢复
				$("#lyricDiv ul li").css("color", "#cbc7c7");
				//把现在这条歌词高亮显示
				$("#lyricDiv ul li").get(lyricIndex + j).style.color = "#ff6666";

				//初始歌词的高度是80,所以将80-叠加的高度则得出歌词需要滑动的高度
				$("#lyricDiv ul").animate({
					"top": 80 - lyricHeight[lyricIndex - 1] + "px"
				}, 1000);
			}

			//把歌词的索引移到下一条
			lyricIndex++;
		}
	}
}

function showFullLyric() {
	$(".header button").css("display", "none");
	$("#back").css("display", "block");
	$(".musicList").css("display", "none");
	$(".albumPic").css("display", "none");
	$("#lyricDiv").css("display", "block");

	//把所有歌词的高度保存,因为设为none之后该值也会丢失
	//为了方面后面设置高度,保存的值是叠加高度的值
	lyricHeight = [];
	for(var i = 0; i < $("#lyricDiv ul li").length; i++) {
		var last = i == 0 ? 0 : lyricHeight[i - 1];
		lyricHeight.push(last + $("#lyricDiv ul li")[i].offsetHeight);
	}

	$("#lyric").text("歌词");

	//迅速滑到当前播放的歌词
	//初始歌词的高度是80,所以将80-叠加的高度则得出歌词需要滑动的高度
	if(lyricIndex >= 2){
		$("#lyricDiv ul").animate({
			"top": 80 - lyricHeight[lyricIndex - 1] + "px"
		}, 1000);
	}
}

function lyricTip(t, e) {

	var lyric = document.getElementsByClassName("lyric")[0];
	var tooltipTop = lyric.offsetTop;

	if(e.target.id == "lyric") {
		var tooltipHtml = "<div id='tooltip' class='tooltip'>点击查看全部歌词 </div>";
		$(t).append(tooltipHtml); //添加到页面中  
		$("#tooltip").css({
			"top": tooltipTop + 30 + "px",
			"left": "210px",
		}).show("fast"); //设置提示框的坐标，并显示 
	}
}
```
### 画星空背景的代码为：

```
//画星空背景
function drawStars() {
	var canvas = document.getElementById('canvas'),
		ctx = canvas.getContext('2d'),
		w = canvas.width = window.innerWidth,
		h = canvas.height = window.innerHeight,

		hue = 217, //色调色彩
		stars = [], //保存所有星星
		count = 0,  //用于计算星星
		maxStars = 1300; //星星数量
	
	//canvas2是用来创建星星的源图像，即母版，
	//根据星星自身属性的大小来设置
	var canvas2 = document.createElement('canvas'),
		ctx2 = canvas2.getContext('2d');
	canvas2.width = 100;
	canvas2.height = 100;
	//创建径向渐变，从坐标(half，half)半径为0的圆开始，
	//到坐标为(half,half)半径为half的圆结束
	var half = canvas2.width / 2,
		gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);
	gradient2.addColorStop(0.025, '#CCC');
	//hsl是另一种颜色的表示方式，
	//h->hue,代表色调色彩，0为red，120为green，240为blue
	//s->saturation，代表饱和度，0%-100%
	//l->lightness，代表亮度，0%为black，100%位white
	gradient2.addColorStop(0.1, 'hsl(' + hue + ', 61%, 33%)');
	gradient2.addColorStop(0.25, 'hsl(' + hue + ', 64%, 6%)');
	gradient2.addColorStop(1, 'transparent');

	ctx2.fillStyle = gradient2;
	ctx2.beginPath();
	ctx2.arc(half, half, half, 0, Math.PI * 2);
	ctx2.fill();

	// End cache
	function random(min, max) {
		if(arguments.length < 2) {
			max = min;
			min = 0;
		}

		if(min > max) {
			var hold = max;
			max = min;
			min = hold;
		}
		
		//返回min和max之间的一个随机值
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function maxOrbit(x, y) {
		var max = Math.max(x, y),
			diameter = Math.round(Math.sqrt(max * max + max * max));
		//星星移动范围，值越大范围越小，
		return diameter / 2;
	}

	var Star = function() {
		//星星移动的半径
		this.orbitRadius = random(maxOrbit(w, h));
		//星星大小，半径越小，星星也越小，即外面的星星会比较大
		this.radius = random(60, this.orbitRadius) / 8;
		//所有星星都是以屏幕的中心为圆心
		this.orbitX = w / 2;
		this.orbitY = h / 2;
		//星星在旋转圆圈位置的角度,每次增加speed值的角度
		//利用正弦余弦算出真正的x、y位置
		this.timePassed = random(0, maxStars);
		//星星移动速度
		this.speed = random(this.orbitRadius) / 50000;
		//星星图像的透明度
		this.alpha = random(2, 10) / 10;

		count++;
		stars[count] = this;
	}

	Star.prototype.draw = function() {
		//星星围绕在以屏幕中心为圆心，半径为orbitRadius的圆旋转
		var x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX,
			y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY,
			twinkle = random(10);
		
		//星星每次移动会有1/10的几率变亮或者变暗
		if(twinkle === 1 && this.alpha > 0) {
			//透明度降低，变暗
			this.alpha -= 0.05;
		} else if(twinkle === 2 && this.alpha < 1) {
			//透明度升高，变亮
			this.alpha += 0.05;
		}

		ctx.globalAlpha = this.alpha;
		//使用canvas2作为源图像来创建星星，
		//位置在x - this.radius / 2, y - this.radius / 2
		//大小为 this.radius
		ctx.drawImage(canvas2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);
		//没旋转一次，角度就会增加
		this.timePassed += this.speed;
	}
	
	//初始化所有星星
	for(var i = 0; i < maxStars; i++) {
		new Star();
	}

	function animation() {
		//以新图像覆盖已有图像的方式进行绘制背景颜色
		ctx.globalCompositeOperation = 'source-over';
		ctx.globalAlpha = 0.5; //尾巴
		ctx.fillStyle = 'hsla(' + hue + ', 64%, 6%, 2)';
		ctx.fillRect(0, 0, w, h)

		//源图像和目标图像同时显示，重叠部分叠加颜色效果
		ctx.globalCompositeOperation = 'lighter';
		for(var i = 1, l = stars.length; i < l; i++) {
			stars[i].draw();
		};
		
		//调用该方法执行动画，并且在重绘的时候调用指定的函数来更新动画
		//回调的次数通常是每秒60次
		window.requestAnimationFrame(animation);
	}

	animation();
}
```

 - 还有音乐列表歌名搜索、网络音乐搜索、自定义div弹出框、列表信息显示、iframe跨域传送信息、播放快捷键绑定等功能，在index.js代码文件中都有很详细的注释，可以自行查看。
 ## 后序
 - 其实在写播放器的时候，是没有一个整体的框架的，基本都是想到什么功能，就添加一个函数，几乎所有脚本代码都写在一个index.js文件中了。这也是后续学习的方向，毕竟软件性能、代码维护都需要良好的框架支撑。
 - 第一次写GitHub，陈述不清楚，还望见谅，继续学习中.........
 - Stay Hungry，Stay Foolish. Continue Hello World! 


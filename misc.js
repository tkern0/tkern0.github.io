// Canvases don't scale nicely with css
function fixCanvas() {
    var canvas = document.getElementById("outputCanvas");
    var w = window.innerWidth * 0.40;
    var h = w * 9/16;
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = w;
    canvas.style.height = h;
}

/*
  A bunch of elements used by the scripts
  You need to wait for load to be able to initialize them, figure it's best to
   do them all at once
*/
var outputCanvas    = null;
var inputText       = null;
var lyrics          = null;
var startTimes      = null;
var endTimes        = null;
var error           = null;
var playButton      = null;
var timer           = null;
var manualTimer     = null;
var manualButton    = null;
var currentLine     = null;
var nextLine        = null;
var menuAnimation   = null;
var timeSlider      = null;
var syncPlayer      = null;
var currentMenu     = null;
window.addEventListener("load", function() {
    fixCanvas();

    outputCanvas    = document.getElementById("outputCanvas");
    inputText       = document.getElementById("inputText");
    lyrics          = document.getElementById("lyrics");
    startTimes      = document.getElementById("startTimes");
    endTimes        = document.getElementById("endTimes");
    error           = document.getElementById("error");
    playButton      = document.getElementById("playButton");
    timer           = document.getElementById("timer");
    manualTimer     = document.getElementById("manualTimer");
    manualButton    = document.getElementById("manualButton");
    currentLine     = document.getElementById("currentLine");
    nextLine        = document.getElementById("nextLine");
    menuAnimation   = document.getElementById("menuAnimation");
    startLines      = document.getElementById("startLines");
    lyricLines      = document.getElementById("lyricLines");
    endLines        = document.getElementById("endLines");
    timeSlider      = document.getElementById("timeSlider");
    syncPlayer      = document.getElementById("syncPlayer");

    currentMenu = menuAnimation;

    lyrics.addEventListener("scroll", autoScroll);

    startTimes.addEventListener("keyup", fixLineCount);
    lyrics.addEventListener("keyup", fixLineCount);
    endTimes.addEventListener("keyup", fixLineCount);

    timeSlider.addEventListener("input", timeChange);
    timeSlider.addEventListener("mouseup", function() {timeChange(true);});
});
window.addEventListener("resize", fixCanvas);

var outputCanvas = null;
var inputText = null;
var lyrics = null;
var startTimes = null;
var endTimes = null;
var error = null;


// Deals with changing menus
var runningIntervals = {manual: null};
function menuChange(id) {
    if (currentMenu) {
        currentMenu.hidden = true;
    }
    for (var key in runningIntervals) {
        clearInterval(runningIntervals[key]);
    }
    currentMenu = document.getElementById(id);
    currentMenu.hidden = false;
}


/*
    Changes the youtube video
    Useful links:
    https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
    https://developers.google.com/youtube/iframe_api_reference?csw=1
*/

var player;
function onYouTubeIframeAPIReady(id = "5abamRO41fE") {
    player = new YT.Player('player', {
    height: '315',
    width: '560',
    videoId: id,
    events: {
      'onReady': onPlayerReady,
    }
    });
}

var videoLength = 0;
function onPlayerReady() {
    videoLength = player.getDuration();
}

var videoID = "5abamRO41fE"
function changeVideo() {
    var url = document.getElementById("videoLink").value
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    videoID = (match && match[7].length == 11)? match[7] : "";
    // This div gets deleted by the yt api
    document.getElementById("video").innerHTML = `<div id="player" class="center">No video currently loaded</div>`
    onYouTubeIframeAPIReady(videoID);
}

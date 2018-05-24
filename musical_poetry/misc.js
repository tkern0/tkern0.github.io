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
var currentMenu     = null;
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
var menuLyrics      = null;
var timeSlider      = null;
var syncPlayer      = null;
var drawOptions     = null;
var drawColour      = null;
var drawPoint1      = null;
var drawPoint2      = null;
var drawRadius      = null;
var drawText        = null;
var drawError       = null;
var drawColour      = null;
var drawStartTime   = null;
var drawEndTime     = null;
var drawX1          = null;
var drawY1          = null;
var drawX2          = null;
var drawY2          = null;
var drawSelect      = null;
var drawRadius      = null;
var drawString      = null;
var drawFont        = null;
var drawRadiusValue = null;
var drawSubmit      = null;
var drawTimeError   = null;
var drawZ           = null;
var lyricsOptions   = null;
var lyricsFontSize  = null;
var lyricsFont      = null;
var lyricsCircles   = null;
var lyricsBoxes     = null;
var lyricsLines     = null;
var lyricsConvert   = null;
var drawPoint1Text  = null;
var drawPoint2Text  = null;
var hideVideoButton = null;
var video           = null;
window.addEventListener("load", function() {
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
    menuLyrics      = document.getElementById("menuLyrics");
    startLines      = document.getElementById("startLines");
    lyricLines      = document.getElementById("lyricLines");
    endLines        = document.getElementById("endLines");
    timeSlider      = document.getElementById("timeSlider");
    syncPlayer      = document.getElementById("syncPlayer");
    drawOptions     = document.getElementById("drawOptions");
    drawColour      = document.getElementById("drawColour");
    drawPoint1      = document.getElementById("drawPoint1");
    drawPoint2      = document.getElementById("drawPoint2");
    drawRadius      = document.getElementById("drawRadius");
    drawText        = document.getElementById("drawText");
    drawError       = document.getElementById("drawError");
    drawColour      = document.getElementById("drawColour");
    drawStartTime   = document.getElementById("drawStartTime");
    drawEndTime     = document.getElementById("drawEndTime");
    drawX1          = document.getElementById("drawX1");
    drawY1          = document.getElementById("drawY1");
    drawX2          = document.getElementById("drawX2");
    drawY2          = document.getElementById("drawY2");
    drawSelect      = document.getElementById("drawSelect");
    drawRadius      = document.getElementById("drawRadius");
    drawString      = document.getElementById("drawString");
    drawFont        = document.getElementById("drawFont");
    drawRadiusValue = document.getElementById("drawRadiusValue");
    drawSubmit      = document.getElementById("drawSubmit");
    drawTimeError   = document.getElementById("drawTimeError");
    drawZ           = document.getElementById("drawZ");
    lyricsOptions   = document.getElementById("lyricsOptions");
    lyricsFontSize  = document.getElementById("lyricsFontSize");
    lyricsFont      = document.getElementById("lyricsFont");
    lyricsCircles   = document.getElementById("lyricsCircles");
    lyricsBoxes     = document.getElementById("lyricsBoxes");
    lyricsLines     = document.getElementById("lyricsLines");
    lyricsConvert   = document.getElementById("lyricsConvert");
    drawPoint1Text  = document.getElementById("drawPoint1Text");
    drawPoint2Text  = document.getElementById("drawPoint2Text");
    hideVideoButton = document.getElementById("hideVideoButton");
    video           = document.getElementById("video");

    // Some other stuff we can only do one the page is loaded
    currentMenu = menuLyrics;
    ctx = outputCanvas.getContext("2d");

    playButton.disabled = true;

    fixCanvas();
    drawChange();
    drawStopSubmit();
    lyricTimes();
    fixLineCount();

    lyrics.addEventListener("scroll", autoScroll);

    startTimes.addEventListener("keyup", fixLineCount);
    lyrics.addEventListener("keyup", fixLineCount);
    endTimes.addEventListener("keyup", fixLineCount);

    timeSlider.addEventListener("input", timeChange);
    timeSlider.addEventListener("mouseup", function() {timeChange(true);});

    drawOptions.addEventListener("change", drawChange);
    drawStartTime.addEventListener("change", drawStopSubmit);
    drawEndTime.addEventListener("change", drawStopSubmit);

    window.addEventListener("resize", fixCanvas);
});


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
function onYouTubeIframeAPIReady(id) {
    if (id) {
        player = new YT.Player('player', {
        height: '315',
        width: '560',
        videoId: id,
        events: {
          'onReady': onPlayerReady,
        }
        });
    }
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
    videoID = (match && match[7].length == 11) ? match[7] : "";
    // This div gets deleted by the yt api
    video.innerHTML = `<div id="player" class="center">No video currently loaded</div>`
    onYouTubeIframeAPIReady(videoID);
}

var videoHidden = false;
function hideVideo() {
    hideVideoButton.innerHTML = (videoHidden) ? "Hide" : "Show";
    video.style = (videoHidden) ? "" : "display: none;";
    videoHidden = !videoHidden;
}

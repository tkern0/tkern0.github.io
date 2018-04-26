var FONT_SIZE = 50;
var FONT = "px Arial";
var MIN_FONT = 10;
var GAP_MS = 50;

// https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
function changeVideo() {
    var url = document.getElementById("videoLink").value
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    var id = (match && match[7].length == 11)? match[7] : "";
    console.log(id);
    document.getElementById("video").innerHTML = `<iframe class="center" src="https://www.youtube.com/embed/' + id + '" allowfullscreen="" width="560" height="315" frameborder="0"></iframe>`;
    // TODO: Use YT api to get video length and set the length input?
}

function error(str) {
    try {
        document.getElementById("errors").innerHTML = str;
    } catch(e) {
        alert(str);
    }
}

/*
  We should probably switch this over to something like syllables, but that's
   hard using native JS, and I don't want to add stuff untill we have a proper
   server + repository
*/
function countWords(str) {
    return str.trim().split(/\s+/).length;
}

function fitLine(str) {
    // Just need these to center the text, not actually going to use them
    var canvas = document.getElementById("outputCanvas");
    var ctx = canvas.getContext("2d");
    var C_WIDTH = canvas.width;
    var C_HEIGHT = canvas.height;

    // Make sure we can fit the whole line on screen
    var currentFontSize = FONT_SIZE;
    ctx.font = FONT_SIZE + FONT;
    var textWidth = ctx.measureText(str).width;
    while ((textWidth > C_WIDTH) && (currentFontSize >= MIN_FONT)) {
        currentFontSize--;
        ctx.font = currentFontSize + FONT;
        var textWidth = ctx.measureText(str).width;
    }
    var x = Math.round((C_WIDTH - textWidth) / 2);
    var y = Math.round((C_HEIGHT) / 2);
    return [x, y, currentFontSize + FONT]
}

function convertLyrics(text, startTime, endTime) {
    var lyrics = text;
    var songLen = endTime - startTime;
    var currentTime = startTime;

    var output = document.getElementById("inputText");
    var x = 0;
    var y = 0;
    var currentFont = "";

    /*
      We leave GAP_MS between each line, but otherwise we give each word an
       equal amount of time
    */
    var wordCount = countWords(lyrics);
    var songLines = lyrics.split(/\n\s*/).length;
    var wordMS = (songLen - (GAP_MS*songLines)) / wordCount;

    lyrics = lyrics.split("\n");
    for (i = 0; i < lyrics.length; i++) {
        var line = lyrics[i].trim();

        var lineWords = countWords(line);
        var lineMS = Math.round(lineWords * wordMS);

        [x, y, currentFont] = fitLine(line);

        // I really wish there was a proper format(), this looks messy as hell
        output.value += "Time: " + currentTime + ", " + (currentTime + lineMS)
                        + "\n" + "Text: \"" + line + "\", \"" + currentFont
                        + "\", " + x + ", " + y + "\n";

        currentTime += lineMS + GAP_MS;
    }

}

var FONT_SIZE = 50;
var FONT = "px Arial";
var MIN_FONT = 10;
var GAP_MS = 50;

/*
  We should probably switch this over to something like syllables, but that's
   hard using native JS, and I don't want to add stuff untill we have a proper
   server + repository
*/
function countWords(str) {
    return str.trim().split(/\s+/).length;
}

function convertLyrics() {
    // Just need these to center the text, not actually going to use them
    var canvas = document.getElementById("outputCanvas");
    var ctx = canvas.getContext("2d");
    var C_WIDTH = canvas.width;
    var C_HEIGHT = canvas.height;

    var output = document.getElementById("inputText");
    output.value = "";
    var songLen = parseInt(document.getElementById("songLen").value) * 1000;
    var allText = document.getElementById("lyrics").value;
    var wordCount = countWords(allText);
    var songLines = (allText.match(/\n/g)||[]).length;
    var y = Math.round((C_HEIGHT) / 2);
    /*
      We leave GAP_MS between each line, but otherwise we give each word an
       equal amount of time
    */
    var wordMS = (songLen- (GAP_MS*songLines)) / wordCount;


    allText = allText.split("\n");
    var currentTime = 0;
    for (i = 0; i < allText.length; i++) {
        var line = allText[i].trim();

        var lineWords = countWords(line);
        var lineMS = Math.round(lineWords * wordMS);

        // Make sure we can fit the whole line on screen
        var currentFontSize = FONT_SIZE;
        ctx.font = FONT_SIZE + FONT;
        var textWidth = ctx.measureText(line).width;
        while ((textWidth > C_WIDTH) && (currentFontSize >= MIN_FONT)) {
            currentFontSize--;
            ctx.font = currentFontSize + FONT;
            var textWidth = ctx.measureText(line).width;
        }
        var x = Math.round((C_WIDTH - textWidth) / 2);

        // I really wish there was a proper format(), this looks messy as hell
        output.value += "Time: " + currentTime + ", " + (currentTime + lineMS)
                        + "\n" + "Text: \"" + line + "\", \"" + currentFontSize
                        + FONT + "\", " + x + ", " + y + "\n";

        currentTime += lineMS + GAP_MS;
    }

}

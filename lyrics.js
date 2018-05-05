var FONT_SIZE = 50;
var FONT = "Arial";
var MIN_FONT = 10;
var GAP_MS = 50;

// Makes scrolling in the main lyrics box also scroll the time ones
function autoScroll() {
    var pos = lyrics.scrollTop;
    startTimes.scrollTop = pos;
    endTimes.scrollTop = pos;
}

function fixLineCount() {
    startLines.innerHTML = startTimes.value.split(/\n/g).length + " lines";
    lyricLines.innerHTML = lyrics.value.split(/\n/g).length + " lines";
    endLines.innerHTML = endTimes.value.split(/\n/g).length + " lines";
}

// Only want to 'reset' times the first time you switch tabs
var initalSetup = true;
function lyricsSetup() {
    error.innerHTML = ''
    if (initalSetup) {
        initalSetup = false;
        lyricTimes();
        fixLineCount();
    }
}

// Gets default times for the lyrics
function lyricTimes() {
    var lines = lyrics.value.split(/\n/g).length;
    var start = [];
    var end = [];
    for (var i=0; i<lines; i++) {
        start[i] = ""
        end[i] = ""
    }
    start[0] = 0
    end[lines - 1] = videoLength;
    startTimes.value = start.join("\n");
    endTimes.value = end.join("\n");
}

// Using the provided start and end times try guess the timing of each line
function convertLyrics() {
    var lyricLines = lyrics.value.split("\n");
    var startLines = startTimes.value.split("\n");
    var endLines = endTimes.value.split("\n");
    var lines = lyricLines.length

    if (lines != startLines.length || lines != endLines.length) {
        error.innerHTML = "Line lengths mismatched, unable to continue";
        return;
    }
    error.innerHTML = "";

    var lineGroups = [];
    var currentGroup = {start: -1, end: -1, lines: ""}
    for (var i=0; i<lines; i++) {
        var start = parseInt(startLines[i]);
        var end = parseInt(endLines[i]);

        if (!isNaN(start)) {
            /*
              If there are two start times given without an end time inbetween
               the last one becomes the end time of the first
            */
            if (currentGroup.start >= 0 && currentGroup.end < 0) {
                currentGroup.end = start;
                // Sometimes gets here with just newlines, no need to continue
                if (!currentGroup.lines.match(/^\s*$/)) {
                    lineGroups.push(currentGroup);
                }
            }
            currentGroup = {start: start, end: -1, lines: ""};
        // If this is the first start time we've seen
        } else if (currentGroup.start < 0) {
            currentGroup.start = (lineGroups.length == 0) ? 0 : lineGroups[-1].end;
        }

        currentGroup.lines += lyricLines[i] + "\n"

        /*
          You're forced to always have a start time so we don't need to check
           that here
          The end time becomes the new start time incase there are two in a row
        */
        if (!isNaN(end)) {
            currentGroup.end = end;
            if (!currentGroup.lines.match(/^\s*$/)) {
                lineGroups.push(currentGroup);
            }
            currentGroup = {start: end, end: -1, lines: ""};
        }

        // If we're at the end and have yet to see an end time
        if (lineGroups.length == 0 && i == lines - 1) {
            error.innerHTML = "Please specify an end time";
            return;
        }
    }

    inputText.value = "";
    for (var i=0; i<lineGroups.length; i++) {
        var group = lineGroups[i];
        convertText(group.lines, group.start * 1000, group.end * 1000);
    }
    // Switch back so you can see whatg you just added
    menuChange("menuAnimation");
}

/*
    Tries to center a line on the canvas
    Will reduce the font size if it has to to do this
    Returns the coordinates and font to use for the line
*/
function fitLine(str, fontSize = FONT_SIZE, font = FONT) {
    var ctx = outputCanvas.getContext("2d");
    var C_WIDTH = outputCanvas.width;
    var C_HEIGHT = outputCanvas.height;

    var currentFontSize = fontSize;
    font = "px " + font
    ctx.font = fontSize + font;

    var textWidth = ctx.measureText(str).width;
    while ((textWidth > C_WIDTH) && (currentFontSize >= MIN_FONT)) {
        currentFontSize--;
        ctx.font = currentFontSize + font;
        var textWidth = ctx.measureText(str).width;
    }
    var x = Math.round((C_WIDTH - textWidth) / 2);
    var y = Math.round((C_HEIGHT) / 2);
    return [x, y, currentFontSize + font]
}

function countWords(str) {
    return str.trim().split(/[(\s-]+/).length;
}

/*
    Will estimate times for each line in a block of text based on word count,
     then append them to inputText
*/
function convertText(text, startTime, endTime) {
    var songLen = endTime - startTime;
    var currentTime = startTime;
    // Kill leading/trailing whitespace and make big gaps become a single line
    text = text.replace(/^\s*/, "").replace(/\s*$/, "").replace(/\n\s*\n/g, "\n")

    var x = 0;
    var y = 0;
    var currentFont = "";

    /*
      We leave GAP_MS between each line, but otherwise we give each word an
       equal amount of time
    */
    var wordCount = countWords(text);
    var songLines = text.split(/\n\s*/).length;
    var wordMS = (songLen - (GAP_MS*songLines)) / wordCount;

    text = text.split("\n");
    for (var i = 0; i < text.length; i++) {
        var line = text[i].trim();

        var lineWords = countWords(line);
        var lineMS = Math.round(lineWords * wordMS);

        [x, y, currentFont] = fitLine(line);

        // I really wish there was a proper format(), this looks messy as hell
        inputText.value += "Time: " + currentTime + ", " + (currentTime
                        + lineMS) + "\n" + "Text: \"" + line + "\", \""
                        + currentFont + "\", " + x + ", " + y + ", #000000\n";

        currentTime += lineMS + GAP_MS;
    }
}

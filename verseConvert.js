var songLen = 0;
var verses = [];
var times = [];
var verseNum = 0;

function verseBased() {
    var lyrics = document.getElementById("lyrics").value;
    verses = lyrics.split(/\n\s*\n/);
    verseOutput = [];
    verseNum = 0;
    times = [];
    for (i = 0; i < verses.length; i++) {
        times[i] = [NaN, NaN]
    }
    document.getElementById("verse").value = verses[0];

    document.getElementById("converters").hidden = true;
    document.getElementById("manualDiv").hidden = false;
}

function verseSave() {
    verses[verseNum] = document.getElementById("verse").value
    var start = parseInt(document.getElementById("verseStart").value);
    var end = parseInt(document.getElementById("verseEnd").value);
    if (!isNaN(start) && !isNaN(end)) {
        if (start < end) {
            times[verseNum] = [start, end];
            error("");
        } else {
            error("End time must be after start time");
        }
    } else {
        error("Please enter values for both start and end times");
    }
}

function verseChange(amount) {
    var newNum = verseNum + amount;
    if (newNum != verseNum && 0 <= newNum && newNum < verses.length) {
        verseNum = newNum;
        document.getElementById("verse").value = verses[verseNum];
        document.getElementById("verseStart").value = times[verseNum][0];
        document.getElementById("verseEnd").value = times[verseNum][1];
    }
}

function verseDone() {
    for (i = 0; i < times.length; i++) {
        if (isNaN(times[i][0]) || isNaN(times[i][1])) {
            if (confirm("Not all verses have times saved, continuing will return to main menu and erase all progress")) {
                document.getElementById("converters").hidden = false;
                document.getElementById("manualDiv").hidden = true;
            }
            return;
        }
        times[i] = [times[i][0] * 1000, times[i][1] * 1000]
    }

    var output = document.getElementById("inputText");
    output.value = "";

    var currentFont = "";
    for (j = 0; j < times.length; j++) {
        convertLyrics(verses[j], times[j][0], times[j][1])
    }
    document.getElementById("converters").hidden = false;
    document.getElementById("manualDiv").hidden = true;
    error("");
}

var songLen = 0;
var verses = [];
var times = [];
var verseNum = 0;

function verseBased() {
    var lyrics = document.getElementById("lyrics").value;
    verses = lyrics.split(/\n\s*\n/);
    verseNum = 0;

    if (times.length < verses.length) {
        for (i = times.length; i < verses.length; i++) {
            times[i] = [NaN, NaN]
        }
    } else if (times.length > verses.length) {
        error("Less verses found, data may not be accurate anymore")
    }

    document.getElementById("verse").value = verses[0];
    document.getElementById("converters").hidden = true;
    document.getElementById("verseDiv").hidden = false;
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
    var convertedTimes = []
    for (i = 0; i < times.length; i++) {
        if (isNaN(times[i][0]) || isNaN(times[i][1])) {
            if (confirm("Not all verses have times saved, continuing will return to main menu")) {
                document.getElementById("converters").hidden = false;
                document.getElementById("verseDiv").hidden = true;
                error("");
            }
            return;
        }
        convertedTimes[i] = [times[i][0] * 1000, times[i][1] * 1000]
    }

    var output = document.getElementById("inputText");
    output.value = "";

    for (j = 0; j < times.length; j++) {
        convertLyrics(verses[j], convertedTimes[j][0], convertedTimes[j][1])
    }

    document.getElementById("converters").hidden = false;
    document.getElementById("verseDiv").hidden = true;
    error("");
}

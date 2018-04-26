var CONVERTERS_BASE_HTML = "";
var songLen = 0;
var verses = [];
var times = [];
var verseNum = 0;

function verseBased() {
    var lyrics = document.getElementById("lyrics").value;

    CONVERTERS_BASE_HTML = document.getElementById("converters").innerHTML;
    verses = lyrics.split(/\n\s*\n/);
    verseOutput = [];
    verseNum = 0;
    times = [];
    for (i = 0; i < verses.length; i++) {
        times[i] = ["", ""]
    }

    document.getElementById("converters").innerHTML = `
        <textarea id="verse" class="center" rows=15></textarea>
        <div class="center">
            Verse Start: <input type="number" id="verseStart" min="0">
            Verse End: <input type="number" id="verseEnd" min="0"><br>
        </div>
        <div class="center">
            <button type="button" onclick="verseSave(1)">Save</button>
            <button type="button" onclick="verseChange(-1)">Previous</button>
            <button type="button" onclick="verseChange(1)">Next</button>
            <button type="button" onclick="verseDone()">Submit</button>
        </div>
    `;
    document.getElementById("verse").value = verses[0];
}

function verseSave() {
    verses[i] = document.getElementById("verse").value
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
    if (times.length < verses.length) {
        error("Please save times for all verses before continuing");
        return;
    }
    error("");

    for (i = 0; i < times.length; i++) {
        times[i] = [times[i][0] * 1000, times[i][1] * 1000]
    }

    var output = document.getElementById("inputText");
    output.value = "";

    var currentFont = "";
    for (j = 0; j < times.length; j++) {
        convertLyrics(verses[j], times[j][0], times[j][1])
    }
    document.getElementById("converters").innerHTML = CONVERTERS_BASE_HTML;
}

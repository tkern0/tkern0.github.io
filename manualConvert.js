var REACTION_MS = 250;
var manualLineNum = 0;
var manualStartTime = -1;
var manualCurrentTime = -1;
var manualInterval = null;

function manualSetup() {
    var allLyrics = lyrics.value.trim();
    manualLines = lyrics.value.replace(/\n\s*\n/g, "\n").split("\n");
    manualLineNum = 0;
    manualStartTime = -1;
    manualCurrentTime = -1;

    manualTimer.innerHTML = "0.000";
    manualButton.innerHTML = "Start";

    updateManualLines(0);
}

function manualNext() {
    if (manualCurrentTime < 0) {
        manualLines = lyrics.value.replace(/\n\s*\n/g, "\n").split("\n");
        updateManualLines(0);

        inputText.value = "";

        runningIntervals.manual = setInterval(manualUpdateTimer, WAIT_MS);
        manualStartTime = 0;

        manualButton.innerHTML = "Next Line";
    } else if (manualLineNum < manualLines.length){
        var line = manualLines[manualLineNum]
        var x = 0;
        var y = 0;
        var currentFont = "";
        [x, y, currentFont] = fitLine(line);

        inputText.value += "Time: " + Math.round(manualStartTime) + ", "
                        + Math.round(manualCurrentTime - REACTION_MS) + "\n"
                        + "Text: \"" + line + "\", \"" + currentFont + "\", "
                        + x + ", " + y + ", #000000\n";

        manualStartTime = manualCurrentTime - 100

        manualLineNum++;
        updateManualLines(manualLineNum);
        if (manualLineNum + 1 >= manualLines.length){
            clearInterval(runningIntervals.manual);
        } else if (manualLineNum + 2 >= manualLines.length) {
            manualButton.innerHTML = "Done"
        }
    }
}

function updateManualLines(i) {
    currentLine.innerHTML = manualLines[i];
    if (manualLineNum + 2 >= manualLines.length) {
        nextLine.innerHTML = "..."
    } else {
        nextLine.innerHTML = manualLines[i+1];
    }
}

function manualUpdateTimer() {
    manualCurrentTime += WAIT_MS;
    var displayTime = "Current Time: " + (manualCurrentTime / 1000).toFixed(3);
    manualTimer.innerHTML = displayTime;
}

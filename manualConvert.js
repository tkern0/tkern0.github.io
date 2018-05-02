var CONVERTERS_BASE_HTML = "";
var manualStartTime = -1;
var manualLines = [];
var manualLineNum = 0;
var manualTimerInterval = null;
var manualCurrentTime = -1;
var output = null;

function manual() {
    CONVERTERS_BASE_HTML = document.getElementById("converters").innerHTML;
    document.getElementById("converters").innerHTML = `
        <div class="center" id="currentLine">Error finding lines</div>
        <div class="center" id="nextLine">...</div>
        <button class="center bigButton" type="button" onclick="manualNext()" id="manualButton">Next Line</button>
        <div class="center" id="manualTimer">0.000</div>
    `;
    manualStartTime = -1;
    var lyrics = document.getElementById("lyrics").value.trim();
    manualLines = lyrics.replace(/\n\s*\n/g, "\n").split("\n");
    manualLineNum = 0;
    manualTimerInterval = null;
    manualCurrentTime = -1;
    output = null;
    console.log(manualLines)
    updateManualLines(0);
}

function manualNext() {
    if (manualCurrentTime < 0) {
        var lyrics = document.getElementById("lyrics").value;
        manualLines = lyrics.replace(/\n\s*\n/g, "\n").split("\n");
        updateManualLines(0);
        output = document.getElementById("inputText");
        output.value = "";
        manualTimerInterval = setInterval(manualTimer, WAIT_MS);
        manualStartTime = 0;
    } else {
        var line = manualLines[manualLineNum]
        var x = 0;
        var y = 0;
        var currentFont = "";
        [x, y, currentFont] = fitLine(line);

        output.value += "Time: " + Math.round(manualStartTime) + ", "
                        + Math.round(manualCurrentTime - 150) + "\n"
                        + "Text: \"" + line + "\", \"" + currentFont + "\", "
                        + x + ", " + y + "\n";

        manualStartTime = manualCurrentTime - 100

        manualLineNum++;
        updateManualLines(manualLineNum);
        if (manualLineNum + 1 >= manualLines.length){
            clearInterval(manualTimerInterval);
            document.getElementById("converters").innerHTML = CONVERTERS_BASE_HTML;
        } else if (manualLineNum + 2 >= manualLines.length) {
            document.getElementById("manualButton").innerHTML = "Done"
        }
    }
}

function updateManualLines(i) {
    document.getElementById("currentLine").innerHTML = manualLines[i];
    if (manualLineNum + 2 >= manualLines.length) {
        document.getElementById("nextLine").innerHTML = "..."
    } else {
        document.getElementById("nextLine").innerHTML = manualLines[i+1];
    }
}

function manualTimer() {
    manualCurrentTime += WAIT_MS;
    var displayTime = "Current Time: " + (manualCurrentTime / 1000).toFixed(3);
    document.getElementById("manualTimer").innerHTML =  displayTime;
}
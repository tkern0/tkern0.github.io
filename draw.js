function drawChange() {
    var cmpValue = drawOptions.value;
    if (cmpValue.endsWith("Full")) {
        cmpValue = cmpValue.substring(0, cmpValue.length - 4);
    }
    switch (cmpValue) {
        case "rect":
            drawPoint2.hidden   = false;
            drawRadius.hidden   = true;
            drawText.hidden     = true;
            drawError.hidden    = true;
            break;

        case "line":
            drawPoint2.hidden   = false;
            drawRadius.hidden   = true;
            drawText.hidden     = true;
            drawError.hidden    = true;
            break;

        case "circle":
            drawPoint2.hidden   = true;
            drawRadius.hidden   = false;
            drawText.hidden     = true;
            drawError.hidden    = true;
            break;

        case "text":
            drawPoint2.hidden   = true;
            drawRadius.hidden   = true;
            drawText.hidden     = false;
            drawError.hidden    = true;
            break;

        default:
            drawPoint2.hidden   = true;
            drawRadius.hidden   = true;
            drawText.hidden     = true;
            drawError.hidden    = false;
    }
}

function drawSubmitButton() {
    inputText.value += "Time: " + Math.round(drawStartTime.value * 1000) + ", "
                    + Math.round(drawEndTime.value * 1000) + "\n";
    var x1 = Math.round(drawX1.value);
    var y1 = Math.round(drawY1.value);
    var x2 = Math.round(drawX2.value);
    var y2 = Math.round(drawY2.value);
    var r = Math.round(drawRadiusValue.value);
    var colour = drawColour.value;
    var str = drawString.value;
    var font = drawFont.value;
    var z = Math.round(drawZ.value);
    switch (drawOptions.value) {
        case "rect":
            inputText.value += "Rect: " + z + ", " + colour + ", " + x1 + ", "
                            + y1 + ", " + x2 + ", " + y2 + "\n"
            break;

        case "rectFull":
            inputText.value += "RectFull: " + z + ", " + colour + ", " + x1
                            + ", " + y1 + ", " + x2 + ", " + y2 + "\n"
            break;

        case "line":
            inputText.value += "Line: " + z + ", " + colour + ", " + x1 + ", "
                            + y1 + ", " + x2 + ", " + y2 + "\n"
            break;

        case "circle":

            inputText.value += "Circle: " + z + ", " + colour + ", " + x1 + ", "
                            + y1 + ", " + r + "\n"
            break;

        case "circleFull":
            inputText.value += "CircleFull: " + z + ", " + colour + ", " + x1
                            + ", " + y1 + ", " + r + "\n"
            break;

        case "text":
            inputText.value += "Text: \"" + z + ", " + colour + ", " + str
                            + "\", \"" + font + "\", " + x1 + ", " + y1 + "\n"
            break;
    }
}

function drawStopSubmit() {
    if (drawStartTime.value == drawEndTime.value) {
        drawSubmit.disabled = true;
        drawTimeError.innerHTML = "Start and end times cannot be the same";
    } else {
        drawSubmit.disabled = false;
        drawTimeError.innerHTML = "";
    }
}

function drawCurrent(start) {
    if (start) {
        drawStartTime.value = (time / 1000).toFixed(3);
    } else {
        drawEndTime.value = (time / 1000).toFixed(3);
    }
    drawStopSubmit()
}

var selecting = false;
function drawSelectToggle() {
    if (selecting) {
        drawSelect.innerHTML = "Select on Canvas";
        outputCanvas.removeEventListener("mousedown", drawSelectP1);
        outputCanvas.removeEventListener("mouseup", drawSelectP2);
    } else {
        drawSelect.innerHTML = "Stop Selecting";
        outputCanvas.addEventListener("mousedown", drawSelectP1);
        outputCanvas.addEventListener("mouseup", drawSelectP2);
    }
    selecting = !selecting;
}

function drawSelectP1(e) {
    var baseCoords =  outputCanvas.getBoundingClientRect();
    drawX1.value = Math.round(e.clientX - baseCoords.x);
    drawY1.value = Math.round(e.clientY - baseCoords.y);
}

function drawSelectP2(e) {
    var baseCoords =  outputCanvas.getBoundingClientRect();
    drawX2.value = Math.round(e.clientX - baseCoords.x);
    drawY2.value = Math.round(e.clientY - baseCoords.y);
    if (drawOptions.value == "rectFull") {
        drawX2.value -= drawX1.value;
        drawY2.value -= drawY1.value;
    } else if (drawOptions.value == "circle"
               || drawOptions.value == "circleFull") {
        var deltaX = drawX2.value - drawX1.value;
        var deltaY = drawY2.value - drawY1.value;
        var radius = Math.round((deltaX**2 + deltaY**2)**0.5);
        drawRadiusValue.value = radius;
    }
    drawSelectToggle();
    drawPreview();
}

function drawPreview() {
    var params = [];
    var x1 = Math.round(drawX1.value);
    var y1 = Math.round(drawY1.value);
    var x2 = Math.round(drawX2.value);
    var y2 = Math.round(drawY2.value);
    var r = Math.round(drawRadiusValue.value);
    var colour = drawColour.value;
    var str = drawString.value;
    var font = drawFont.value;
    var z = Math.round(drawZ.value);
    switch (drawOptions.value) {
        case "rect":
            params = [x1, y1, x2, y2];
            break;

        case "rectFull":
            params = [x1, y1, x2, y2];
            break;

        case "line":
            params = [x1, y1, x2, y2];
            break;

        case "circle":
            params = [x1, y1, r];
            break;

        case "circleFull":
            params = [x1, y1, r];
            break;

        case "text":
            params = [str, font, x1, y1];
            break;
    }
    var object = {start:    Math.round(drawStartTime.value * 1000),
                  end:      Math.round(drawEndTime.value * 1000),
                  type:     drawOptions.value.toLowerCase(),
                  z:        Math.round(drawZ.value),
                  colour:   drawColour.value,
                  params:   params};
    // Need to use .slice() so we don't just get another refrence
    var drawTempElements = currentElements.slice();
    currentElements.push(object);
    currentElements.sort(function(a, b) {return (a.z > b.z) ? 1 : -1;});
    draw(true, false);
    currentElements = drawTempElements;
}

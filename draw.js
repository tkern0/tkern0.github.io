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
            drawX2.min          = null;
            drawY2.min          = null;
            break;

        case "line":
            drawPoint2.hidden   = false;
            drawRadius.hidden   = true;
            drawText.hidden     = true;
            drawError.hidden    = true;
            drawX2.min          = 0;
            drawY2.min          = 0;
            break;

        case "circle":
            drawPoint2.hidden   = true;
            drawRadius.hidden   = false;
            drawText.hidden     = true;
            drawError.hidden    = true;
            drawX2.min          = 0;
            drawY2.min          = 0;
            break;

        case "text":
            drawPoint2.hidden   = true;
            drawRadius.hidden   = true;
            drawText.hidden     = false;
            drawError.hidden    = true;
            drawX2.min          = 0;
            drawY2.min          = 0;
            break;

        default:
            drawPoint2.hidden   = true;
            drawRadius.hidden   = true;
            drawText.hidden     = true;
            drawError.hidden    = false;
            drawX2.min          = 0;
            drawY2.min          = 0;
    }
}

function drawSubmit() {
    inputText.value += "Time: " + Math.round(drawStartTime.value * 1000) + ", "
                    + Math.round(drawEndTime.value * 1000) + "\n"
    var x1 = Math.round(drawX1.value);
    var y1 = Math.round(drawY1.value);
    var colour = drawColour.value;
    switch (drawOptions.value) {
        case "rect":
            var x2 = Math.round(drawX2.value);
            var y2 = Math.round(drawY2.value);
            inputText.value += "Rect: " + x1 + ", " + y1 + ", " + x2 + ", " + y2
                            + ", " + colour + "\n"
            break;

        case "rectFull":
            var x2 = Math.round(drawX2.value);
            var y2 = Math.round(drawY2.value);
            inputText.value += "RectFull: " + x1 + ", " + y1 + ", " + x2 + ", " + y2
                            + ", " + colour + "\n"
            break;

        case "line":
            var x2 = Math.round(drawX2.value);
            var y2 = Math.round(drawY2.value);
            inputText.value += "Line: " + x1 + ", " + y1 + ", " + x2 + ", " + y2
                            + ", " + colour + "\n"
            break;

        case "circle":
            var r = Math.round(drawRadiusValue.value);
            inputText.value += "Circle: " + x1 + ", " + y1 + ", " + r + ", "
                            + colour + "\n"
            break;

        case "circleFull":
            var r = Math.round(drawRadiusValue.value);
            inputText.value += "CircleFull: " + x1 + ", " + y1 + ", " + r + ", "
                            + colour + "\n"
            break;

        case "text":
            var str = drawString.value;
            var font = drawFont.value;
            inputText.value += "Text: \"" + str + "\", \"" + font + "\", " + x1
                           + ", " + y1 + ", " + colour + "\n"
            break;
    }
}

function drawFixPointLimits() {
    drawX1.max = outputCanvas.width;
    drawY1.max = outputCanvas.height;
    drawX2.max = outputCanvas.width;
    drawY2.max = outputCanvas.height;
}

function drawCurrent(start) {
    if (start) {
        drawStartTime.value = (time / 1000).toFixed(3);
    } else {
        drawEndTime.value = (time / 1000).toFixed(3);
    }
}

var currentPoint = 0
function drawSelectToggle(p1) {
    if (p1) {
        if (currentPoint == 1) {
            drawSelect1.innerHTML = "Select on Canvas";
            outputCanvas.removeEventListener("mousedown", drawSelectP1);
            outputCanvas.removeEventListener("mousedown", drawSelectP2);
            currentPoint = 0;
        } else {
            drawSelect1.innerHTML = "Stop Selecting";
            drawSelect2.innerHTML = "Select on Canvas";
            outputCanvas.addEventListener("mousedown", drawSelectP1);
            outputCanvas.removeEventListener("mousedown", drawSelectP2);
            currentPoint = 1;
        }
    } else {
        if (currentPoint == 2) {
            drawSelect2.innerHTML = "Select on Canvas";
            outputCanvas.removeEventListener("mousedown", drawSelectP1);
            outputCanvas.removeEventListener("mousedown", drawSelectP2);
            currentPoint = 0;
        } else {
            drawSelect2.innerHTML = "Stop Selecting";
            drawSelect1.innerHTML = "Select on Canvas";
            outputCanvas.removeEventListener("mousedown", drawSelectP1);
            outputCanvas.addEventListener("mousedown", drawSelectP2);
            currentPoint = 2;
        }
    }
}

function drawSelectP1(e) {
    console.log(e);
    var baseCoords =  outputCanvas.getBoundingClientRect();
    drawX1.value = e.clientX - baseCoords.x
    drawY1.value = e.clientY - baseCoords.y
}

function drawSelectP2(e) {
    console.log(e)
    var baseCoords =  outputCanvas.getBoundingClientRect()
    drawX2.value = e.clientX - baseCoords.x
    drawY2.value = e.clientY - baseCoords.y
    if (drawOptions.value == "rect") {
        drawX2.value -= drawX1.value
        drawY2.value -= drawY1.value
    }
}

function drawPreview() {
    ctx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
    draw(true, false);
    ctx.fillStyle = drawColour.value;
    ctx.strokeStyle = drawColour.value;
    switch (drawOptions.value) {
        case "rect":
            ctx.beginPath();
            ctx.beginPath();
            ctx.moveTo(parseInt(drawX1.value), parseInt(drawY1.value));
            ctx.lineTo(parseInt(drawX1.value), parseInt(drawY2.value));
            ctx.lineTo(parseInt(drawX2.value), parseInt(drawY2.value));
            ctx.lineTo(parseInt(drawX2.value), parseInt(drawY1.value));
            ctx.lineTo(parseInt(drawX1.value), parseInt(drawY1.value));
            ctx.stroke();
            break;

        case "rectFull":
            ctx.beginPath();
            ctx.fillRect(parseInt(drawX1.value), parseInt(drawY1.value),
                         parseInt(drawX2.value), parseInt(drawY2.value));
            break;

        case "line":
            ctx.beginPath();
            ctx.moveTo(parseInt(drawX1.value), parseInt(drawY1.value));
            ctx.lineTo(parseInt(drawX2.value), parseInt(drawY2.value));
            ctx.stroke();
            break;

        case "circle":
            ctx.beginPath();
            ctx.arc(parseInt(drawX1.value), parseInt(drawY1.value),
                    parseInt(drawRadiusValue.value), 0, 2*Math.PI);
            ctx.stroke();
            break;

        case "circleFull":
            ctx.beginPath();
            ctx.arc(parseInt(drawX1.value), parseInt(drawY1.value),
                    parseInt(drawRadiusValue.value), 0, 2*Math.PI);
            ctx.stroke();
            ctx.fill();
            break;

        case "text":
            ctx.beginPath();
            ctx.font = drawFont.value;
            ctx.fillText(drawString.value, parseInt(drawX1.value),
                         parseInt(drawY1.value));
            break;
    }
}

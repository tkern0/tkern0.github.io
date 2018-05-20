var WAIT_MS = 1000/60;

// Chrome can't wait decimal ms and rounds down so the animation runs fast
if (!!window.chrome && !!window.chrome.webstore) {
    WAIT_MS = Math.round(WAIT_MS);
}

/*
  This is just one basic way of editing it I wanted to fiddle with, we
   should switch to something more user friendly for the final product
  Currently has the following 'commands'
   Time: start, end
    Sets the time when all following elements will appear and dissappear
    These times are in ms
   Rect: z, colour, x, y, w, h
   RectFull: z, colour, x, y, w, h
   Line: z, colour, x1, y1, x2, y2
   Circle: z, colour, x, y, r
   CircleFull: z, colour, x, y, r
   Text: z, colour, "TEXT", "FONT", x, y
*/
var maxTime = 0;
function parseInput() {
    var allText = inputText.value.split("\n");
    var output = [];
    maxTime = 0;

    var start = 0;
    var end = -1;
    // This makes it really easy to add new elements
    var allRegexes = [/^(rect): ?(-?\d*?), ?(#[0-9a-f]{6}), ?(-?\d*?), ?(-?\d*?), ?(-?\d*?), ?(-?\d*?)$/im,
                      /^(rectfull): ?(-?\d*?), ?(#[0-9a-f]{6}), ?(-?\d*?), ?(-?\d*?), ?(-?\d*?), ?(-?\d*?)$/im,
                      /^(line): ?(-?\d*?), ?(#[0-9a-f]{6}), ?(-?\d*?), ?(-?\d*?), ?(-?\d*?), ?(-?\d*?)$/im,
                      /^(circle): ?(-?\d*?), ?(#[0-9a-f]{6}), ?(-?\d*?), ?(-?\d*?), ?(-?\d*?)$/im,
                      /^(circlefull): ?(-?\d*?), ?(#[0-9a-f]{6}), ?(-?\d*?), ?(-?\d*?), ?(-?\d*?)$/im,
                      /^(text): ?(-?\d*?), ?(#[0-9a-f]{6}), ?"(.*?)", ?"(.*?)", ?(-?\d*?), ?(-?\d*?)$/im];
    for (var i=0; i<allText.length; i++) {
        var line = allText[i].trim();
        // Time works a bit differently to the others so it's seperate
        var match = line.match(/time: ?(-?\d*?), ?(-?\d*?)$/im);
        if (match) {
            /*
              We need to explicitly convert these two because otherwise we
               will end up comparing strings when we try to sort
            */
            start = parseInt(match[1]);
            end = parseInt(match[2]);
            if (end > maxTime) {
                maxTime = end;
            }
            continue;
        }
        // Checks all regexes for a match, saves to output if it gets one
        for (var j=0; j<allRegexes.length; j++) {
            var match = line.match(allRegexes[j]);
            if (match) {
                var object = {start:    start,
                              end:      end,
                              type:     match[1].toLowerCase(),
                              z:        parseInt(match[2]),
                              colour:   match[3],
                              params:   match.slice(4)};
                output.push(object);
            }
        }
    }
    // Sort output by the start time of each object
    output.sort(function(a, b) {return (a.start > b.start) ? 1 : -1;});
    return output;
}

var time = 0;
var ctx = null;
var elements = null;
function load() {
    pause();
    if (syncPlayer.checked && player != null) {
        player.pauseVideo();
    }
    elements = parseInput();
    time = 0;
    drawTime();
    timeSlider.max = maxTime;
    if (elements.length != 0) {
        playButton.disabled = false;
    }
}

function drawTime() {
    var timeMin = Math.floor(time / 60000);
    var timeSec = ((time / 1000) % 60).toFixed(3).padStart(6, "0");
    var maxMin = Math.floor(maxTime / 60000);
    var maxSec = ((maxTime / 1000) % 60).toFixed(3).padStart(6, "0");
    timer.innerHTML = timeMin + ":" + timeSec + "/" + maxMin + ":" + maxSec;
}

function timeChange(release) {
    pause();
    time = parseInt(timeSlider.value);
    if (syncPlayer.checked && player != null) {
        player.pauseVideo();
        player.seekTo(time / 1000, release);
    }
    drawTime();
    timeJumpFix();
    draw(true);
}

// TODO: Fix scrolling, make it step like 0.25s rather than 0.001

function togglePlaying() {
    if (elements) {
        if (paused) {
            play();
        } else {
            pause();
        }
    }
}

var paused = true;
var render = null;
function pause() {
    clearInterval(render);
    if (syncPlayer.checked && player != null) {
        player.pauseVideo();
    }
    playButton.innerHTML = "Play";
    paused = true;
}

function play() {
    timeJumpFix();
    draw(true);
    render = setInterval(draw, WAIT_MS);
    if (syncPlayer.checked && player != null) {
        player.playVideo();
    }
    playButton.innerHTML = "Pause";
    paused = false;
}

var futureElements = [];
var currentElements = [];
function timeJumpFix() {
    futureElements = [];
    currentElements = [];
    for (var i=0; i<elements.length; i++) {
        if (elements[i].start <= time) {
            if (elements[i].end > time) {
                currentElements.push(elements[i]);
            }
        } else {
            futureElements.push(elements[i]);
        }
    }
    currentElements.sort(function(a, b) {return (a.z > b.z) ? 1 : -1;});
}

function draw(forceRedraw=false, advance=true) {
    if (futureElements != null && currentElements != null &&
        futureElements.length == 0 && currentElements.length == 0) {
        pause();
        return;
    }

    if (advance) {
        time += WAIT_MS;
        timeSlider.value = time;
        drawTime();
    }

    var redraw = forceRedraw;
    var reorder = false;

    /*
      Check for new elements to draw
      Because this list is sorted, once it fails once we know there won't
       be any more we need to add
    */
    while (futureElements.length > 0 && time >= futureElements[0].start) {
        currentElements.push(futureElements.shift());
        reorder = true;
    }
    /*
      Check if to remove old elements
      This has to be sorted by z so no easy exit, have to check everything
      Can't remove stuff in place cause indexes will shift
    */
    var toRemove = [];
    for (var i=0; i<currentElements.length; i++) {
        if (currentElements[i].end <= time) {
            toRemove.push(i);
        }
    }
    for (var i=0; i<toRemove.length; i++) {
        currentElements.splice(toRemove[i] - i, 1);
        reorder = true;
    }

    if (reorder) {
        redraw = true;
        currentElements.sort(function(a, b) {return (a.z > b.z) ? 1 : -1;});
    }

    // If nothing's changed no need to redraw
    if (redraw) {
        ctx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
        for (var i=0; i<currentElements.length; i++) {
            var type = currentElements[i].type;
            var params = currentElements[i].params;
            ctx.fillStyle = currentElements[i].colour;
            ctx.strokeStyle = currentElements[i].colour;
            switch (type) {
                case "rect":
                    for (var j=0; j<params.length; j++) {
                        params[j] = parseInt(params[j]);
                    }
                    ctx.beginPath();
                    ctx.moveTo(params[0],             params[1]);
                    ctx.lineTo(params[0],             params[1] + params[3]);
                    ctx.lineTo(params[0] + params[2], params[1] + params[3]);
                    ctx.lineTo(params[0] + params[2], params[1]);
                    ctx.lineTo(params[0],             params[1]);
                    ctx.stroke();
                    break;

                case "rectfull":
                    ctx.beginPath();
                    ctx.fillRect(params[0], params[1], params[2], params[3]);
                    break;

                case "line":
                    ctx.beginPath();
                    ctx.moveTo(params[0], params[1]);
                    ctx.lineTo(params[2], params[3]);
                    ctx.stroke();
                    break;

                case "circle":
                    ctx.beginPath();
                    ctx.arc(params[0], params[1], params[2], 0, 2*Math.PI);
                    ctx.stroke();
                    break;

                case "circlefull":
                    ctx.beginPath();
                    ctx.arc(params[0], params[1], params[2], 0, 2*Math.PI);
                    ctx.stroke();
                    ctx.fill();
                    break;

                case "text":
                    ctx.beginPath();
                    ctx.font = params[1];
                    ctx.fillText(params[0], params[2], params[3]);
                    break;
            }
        }
    }
}

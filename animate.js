var WAIT_MS = 1000/60;
var currentElements = null;
var futureElements = null;
var time = -1;
var canvas = null;
var ctx = null;
var paused = false;
var started = false;
var render = null;
// I'd change this based on the audio if you can get that working
var colour = "#000000";

/*
  This is just one basic way of editing it I wanted to fiddle with, we
   should switch to something more user friendly for the final product
  Currently has the following 'commands'
   Time: start, end
    Sets the time when all following elements will appear and dissappear
    These times are in frames because that's easy, we'll probably want to
     change to ms at some point if we even keep this format
   Rect: x1, y1, x2, y2
   Line: x1, y1, x2, y2
   Circle: x, y, r
   Text: "TEXT", "FONT", x, y
*/
function parseInput() {
    var allText = document.getElementById("inputText").value.split("\n");
    var output = [];

    var cTimes = [0, -1];
    // This makes it really easy to add new elements
    var allRegexes = [/(rect): ?(\d*?), ?(\d*?), ?(\d*?), ?(\d*?)$/im,
                      /(line): ?(\d*?), ?(\d*?), ?(\d*?), ?(\d*?)$/im,
                      /(circle): ?(\d*?), ?(\d*?), ?(\d*?)$/im,
                      /(text): ?"(.*?)", ?"(.*?)", ?(\d*?), ?(\d*?)$/im];
    for (i = 0; i < allText.length; i++) {
        var line = allText[i].trim();
        // Time works a bit differently to the others so it's seperate
        var match = line.match(/time: ?(\d*?), ?(\d*?)$/im);
        if (match) {
            /*
              We need to explicitly convert these two because otherwise we
               will end up comparing strings when we try to sort
            */
            cTimes = [parseInt(match[1]), parseInt(match[2])];
            continue;
        }
        // Checks all regexes for a match, saves to output if it gets one
        for (j = 0; j < allRegexes.length; j++) {
            var match = line.match(allRegexes[j]);
            if (match) {
                var object = cTimes.concat(match[1].toLowerCase());
                object = object.concat(match.slice(2));
                output.push(object);
                continue;
            }
        }
    }
    // Sort output by the start time of each object
    output.sort(function(a, b) {return (a[0] > b[0]) ? 1 : -1;});
    return output;
}

function start() {
    if (!started) {
        started = true;
        futureElements = parseInput();
        currentElements = [];
        canvas = document.getElementById("outputCanvas");
        ctx = canvas.getContext("2d");
        render = setInterval(draw, WAIT_MS);
    }
}

function pause() {
    if (started) {
        if (paused) {
            render = setInterval(draw, WAIT_MS);
            document.getElementById("pause").innerHTML = "Pause";
            paused = false;
            draw();
        } else {
            clearInterval(render);
            document.getElementById("pause").innerHTML = "Unpause";
            paused = true;
        }
    }
}

function reset() {
    if (started) {
        clearInterval(render);
        started = false;
        paused = false;
        currentElements = null;
        futureElements = null;
        time = -1;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        document.getElementById("time").innerHTML = "Current Time: n/a";
        document.getElementById("pause").innerHTML = "Pause";
    }
}

function draw() {
    if (futureElements != null && currentElements != null &&
        futureElements.length == 0 && currentElements.length == 0) {
        reset();
        return;
    }
    time += WAIT_MS;
    var displayTime = "Current Time: " + (time / 1000).toFixed(3);
    document.getElementById("time").innerHTML =  displayTime;

    var redraw = false;
    /* Check for new elements to draw
      Because this list is sorted, once it fails once we know there won't
       be any more we need to add
    */
    while (futureElements.length > 0 && time >= futureElements[0][0]) {
        currentElements.push(futureElements.shift());
        redraw = true;
    }
    if (redraw) {
        /*
          Sorts by end time of each object, but puts impossible times, where
           end is before start, at the end
        */
        currentElements.sort(function(a, b) {
            if (a[0] > a[1]) {return 1;}
            if (b[0] > b[1]) {return -1;}
            return (a[1] > b[1]) ? 1 : -1;
        })
    }
    /*
      Check if to remove old elements
      Again because it's sorted we only need this to fail once to know that
       we're done
    */
    while (currentElements.length > 0 && time >= currentElements[0][1]) {
        currentElements.shift();
        redraw = true;
    }

    // If nothing's changed no need to redraw
    if (redraw) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = colour;
        for (i=0; i<currentElements.length; i++) {
            var type = currentElements[i][2];
            var params = currentElements[i].slice(3);

            switch (type) {
                case "rect":
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

                case "text":
                    ctx.beginPath();
                    ctx.font = params[1];
                    ctx.fillText(params[0], params[2], params[3]);
                    break;
            }
        }
    }
}
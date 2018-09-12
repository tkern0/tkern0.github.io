var pause = false;
var canvas;
var ctx;
var w;
var h;
window.addEventListener("load", function() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    w = canvas.width;
    h = canvas.height;
    ctx.fillRect(0, 0, w, h);

    draw();
});

function randRange(min, max) {
    return min + Math.random() * (max - min);
}

function randChance(prob) {
    return Math.random() <= prob;
}

var particles = [];

function draw() {
    if (pause) {
        pause = false;
        return;
    }

    ctx.fillStyle = "#000000";
    ctx.globalAlpha = 0.5;
    ctx.fillRect(0, 0, w, h);

    for (var i = 0; i < particles.length; i++) {
        p = particles[i];
        p.draw(ctx);
        p.update();

        if (p.age < 0) {
            particles.splice(i, 1)
            i--;
        }
    }

    if (randChance(0.1)) {
        p = new Firework(randRange(-10, w + 10), h + 10)
        particles.push(p);
    }

    window.requestAnimationFrame(draw);
}

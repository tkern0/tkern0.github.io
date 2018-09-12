function Particle(x, y, r) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
    this.r = r;

    this.update = function() {
        this.vx += this.ax;
        this.vy += this.ay;
        this.ax = 0;
        this.ay = 0;
        this.x += this.vx;
        this.y += this.vy;
    }

    this.push = function(x, y) {
        this.ax = x;
        this.ay = y;
    }

    this.draw = function(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
        ctx.stroke();
        ctx.fill();
    }
}

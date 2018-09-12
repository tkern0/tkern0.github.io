function Firework(x, y) {
    this.mainParticle = new Particle(x, y, 8);
    this.mainParticle.push(randRange(-0.5, 0.5), randRange(-16, -8));
    this.extraParticles = [];
    this.colour = "#" + Math.random().toString(16).slice(-6);
    this.age = 60;

    this.update = function() {
        if (this.mainParticle != null) {
            this.mainParticle.update();
            this.mainParticle.push(0, 1/6); // Gravity

            if (this.mainParticle.vy > 0) {
                for (var i = 0; i < 30; i++) {
                    p = new Particle(this.mainParticle.x, this.mainParticle.y, 2);
                    p.push(randRange(-0.75, 0.75), randRange(-0.75, 0.75));
                    this.extraParticles.push(p);
                }
                this.mainParticle = null;
            }

        } else {
            for (var i = 0; i < this.extraParticles.length; i++) {
                this.extraParticles[i].update();
            }
        }
    }

    this.draw = function(ctx) {
        ctx.fillStyle = this.colour;
        ctx.strokeStyle = this.colour;
        if (this.mainParticle != null) {
            ctx.globalAlpha = 1;
            this.mainParticle.draw(ctx);
        } else {
            for (var i = 0; i < this.extraParticles.length; i++) {
                ctx.globalAlpha = this.age/60;
                this.extraParticles[i].draw(ctx);
            }
            this.age--;
        }
    }
}

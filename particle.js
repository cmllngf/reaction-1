class Particle {
  constructor(
    pos = createVector(random(width), random(height)),
    colored
  ) {
    this.pos = pos
    this.vel = createVector(0,0)
    this.acc = createVector(0,0)
    this.radius = 15
    this.c = paletteRGB[floor(random(paletteRGB.length))]
    this.colored = colored
  }
  
  update() {
    this.vel.add(this.acc)
    this.vel.limit(4);
    this.pos.add(this.vel)
    this.acc.mult(0)
    this.vel.mult(.9)
    this.edges()
  }

  applyForce(force) {
    this.acc.add(force)
  }
  
  display() {
    noFill()
    const d = dist(this.pos.x, this.pos.y, width/2, height/2)
    const c = this.colored ? color(this.c) : color(map(d, 0, width/2, 255, 0))
    c.setAlpha(map(d, width/2, 0, 255, 0))
    stroke(c)
    circle(this.pos.x, this.pos.y, this.radius * 2)
  }

  displayCenter() {
    noStroke()
    const d = dist(this.pos.x, this.pos.y, width/2, height/2)
    const alpha = map(d, width, 0, 150, 0)
    const c = this.colored ? color(this.c) : color(map(d, this.radius*2, 0, 255, 0))
    c.setAlpha(alpha)
    fill(c)
    circle(this.pos.x, this.pos.y, this.radius / 4)
  }

  edges() {
    if(this.pos.x < 0 + this.radius || this.pos.x + this.radius > width) {
      this.vel.x = -this.vel.x
    }
    if(this.pos.y < 0 + this.radius || this.pos.y + this.radius > height) {
      this.vel.y = -this.vel.y
      if(this.vel.y < 0.05 && this.vel.y > -0.05)
        this.vel.y = random(-1, 1)
      if(this.vel.x < 0.05 && this.vel.x > -0.05)
        this.vel.x = random(-1, 1)
    }
  }

  overlaps(other) {
    const d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y)
    return d < (this.radius + other.radius)
  }

  avoid(other) {
    const a = atan2(other.pos.y - this.pos.y, other.pos.x - this.pos.x);
    const force = p5.Vector.fromAngle(a).mult(-.4)
    this.applyForce(force)
  }

  link(other) {
    const d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y)
    noFill()
    // stroke(this.c, map(d, this.radius*2, 0, 0, 255))
    const alpha = map(d, this.radius*2, 0, 0, 255)
    const c = this.colored ? color(this.c) : color(map(d, this.radius*2, 0, 255, 0))
    c.setAlpha(alpha)
    stroke(c)
    line(this.pos.x, this.pos.y, other.pos.x, other.pos.y)
  }

  setColor(c) {
    this.c = c
  }
}
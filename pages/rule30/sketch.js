const DEPTH_MAX = 4
let circles
let num_init = 1

function setup() {
  createCanvas(windowWidth, windowHeight)
  // noSmooth()
  frameRate(60)
  smooth()

  circles = []
  // for (let i = 0; i < num_init; i++) {
  // circles = circles.concat(new ACircle(random(0, width), random(0, height), 100, i))
  // }
  circles = circles.concat(new ACircle(width / 2, height / 2, 100, 0))

  for (let i = 0; i < DEPTH_MAX * 4; i++) {
    for (var c of circles) {
      c.step(0)
    }
  }
}

function draw() {
  background(255)

  for (var c of circles) {
    c.draw(0)
  }

  noLoop()
}
//
//
//
//
//
class ACircle {
  constructor(x, y, r, id) {
    this.x = x
    this.y = y
    this.r = r
    this.id = id
    this.children = []
  }

  draw(depth) {
    // noFill()
    noStroke()
    if (depth == 0) {
      strokeWeight(32)
      stroke(0)
      fill(255)
    } else {
      fill(255 - depth / DEPTH_MAX * 255)
    }

    circle(this.x, this.y, this.r)

    if (this.children.length != 0) {
      for (var c of this.children) {
        c.draw(depth + 1)
      }
    }
  }

  step(depth) {
    if (depth > DEPTH_MAX)
      return

    if (this.children.length == 0) {

      let r = this.r * 2
      let num = floor(random(1, 16 + 1))
      let th = 0
      const th_unit = 2 * PI / num

      for (let i = 0; i < num; i++) {
        const x = this.x + r * cos(th)
        const y = this.y + r * sin(th)
        th += th_unit
        this.children = this.children.concat(new ACircle(x, y, this.r * random(0.4, 0.8) * 0.8, i))
      }

    } else {

      for (var c of this.children) {
        c.step(depth + 1)
      }

    }
  }
}
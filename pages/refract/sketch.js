let ball, points, max_points, t, radius
function setup() {
  createCanvas(windowWidth, windowHeight)
  //noSmooth()
  frameRate(60)

  t = 0

  points = []
  max_points = 256

  radius = Math.min(width, height) / 4

  ball = new Ball(width / 2, height / 2, PI / 4)
  //ball = new Ball(random(0, width), random(0, height), random(0, 2 * PI))
}

function draw() {
  background(0)
  margin(1.5)

  //fill(50)
  beginShape()
  for (var i = 0; i < points.length; i++) {
    vertex(points[i][0], points[i][1])
    fill(255, 0, 0)
    stroke(0)
    circle(points[i][0], points[i][1], 10)
  }
  noFill()
  stroke(255)
  vertex(ball.x, ball.y)
  endShape()
  for (var j = 0; j < 64; j++) {
    ball.draw()
    t++
  }
}

//
//
//

class Ball {
  constructor(x, y, angle) {
    this.x = x
    this.y = y
    this.angle = angle
    this.speed = 10
  }

  draw() {
    this.x += this.speed * cos(this.angle)
    this.y += this.speed * sin(this.angle)

    stroke(0)
    fill(255)
    strokeWeight(1)
    rectMode(CENTER)
    //rect(this.x, this.y, 10, 10)
    circle(this.x, this.y, 10)

    //this.angle += 0.01
    this.angle += noise(this.x / width, this.y / height, t / 100) * 0.05
    //this.angle += noise(t / 100) * 0.05

    var hit = false

    var dx = this.x - width / 2
    var dy = this.y - height / 2
    if (Math.sqrt(dx * dx + dy * dy) > radius) {
      hit = true
      this.angle += PI / 2
    }

    if (hit) {
      if (points.length < max_points) {
        points = points.concat([[this.x, this.y]])
      } else {
        points.splice(0, 1)
        points.push([this.x, this.y])
      }
    }
  }
}

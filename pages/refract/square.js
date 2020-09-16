let ball, points, max_points, t
function setup() {
  createCanvas(windowWidth, windowHeight)
  noSmooth()
  frameRate(60)

  t = 0

  points = []
  max_points = 30

  //ball = new Ball(width / 2, height / 2, PI / 4)
  ball = new Ball(random(0, width), random(0, height), random(0, 2 * PI))
}

function draw() {
  background(0)
  margin(0.75)

  //fill(100)
  noFill()
  stroke(255)
  beginShape()
  for (var i = 0; i < points.length; i++) {
    vertex(points[i][0], points[i][1])
  }
  vertex(ball.x, ball.y)
  endShape()
  for (var j = 0; j < 16; j++) {
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
    circle(this.x, this.y, 10)

    //this.angle += 0.01
    this.angle += noise(this.x / width, this.y / height, t) * 0.05

    var hit = false
    if (this.x < 0) {
      hit = true
      this.angle = random(PI / 2, -PI / 2)
    }
    if (this.x > width) {
      hit = true
      this.angle = random(PI / 2, (3 * PI) / 2)
    }
    if (this.y < 0) {
      hit = true
      this.angle = random(0, PI)
    }
    if (this.y > height) {
      hit = true
      this.angle = random(0, -PI)
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

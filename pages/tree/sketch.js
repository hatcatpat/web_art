function setup() {
  createCanvas(windowWidth, windowHeight)
  //noSmooth()
  frameRate(60)
  smooth()
}

function draw() {
  background(255)
  stroke(0)

  var point = new Point(width / 2, height / 2, 50, 1, color(255))

  noLoop()
}

//
//
//
class Point {

  constructor(x, y, r, d, col) {
    this.x = x
    this.y = y
    this.r = r
    this.d = d
    this.col = col
    //
    this.points = []
    if (d < 4) {
      var res = floor(random(1, 16))
      var th_unit = 2 * PI / res
      var th = random(0, 2 * PI)
      for (let i = 0; i < res; i++) {
        var pr = (1 / d) * width / 5
        pr *= random(0.5, 1.5)
        var px = this.x + pr * cos(th)
        var py = this.y + pr * sin(th)
        this.points = this.points.concat(
          new Point(px, py, r / 2, d + 1,
            color(noise(th/(2*PI) * 16,d*16) * 255)
            // color(noise( 
              // (px-width/2)/(width/2) * 8,
              // (py-height/2)/(height/2) * 8,
              //  d*8 ) * 255)
          )
        )
        th += th_unit * random(0.5, 1.5)
      }
    }
    this.draw()
  }

  draw() {
    this.drawCircles()
    this.drawLines()
  }

  drawCircles() {
    stroke(this.col)
    fill(this.col)
    circle(this.x, this.y, this.r)
    for (const point of this.points) {
      point.drawCircles()
    }
  }

  drawLines() {
    stroke(this.col)
    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i]
      line(this.x, this.y, point.x, point.y)
      if (i > 0) {
        const prev_point = this.points[i - 1]
        line(prev_point.x, prev_point.y, point.x, point.y)
      }
    }
    for (const point of this.points) {
      point.drawLines()
    }
  }

}
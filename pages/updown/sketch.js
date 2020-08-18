function setup() {
  //sz = Math.min(windowWidth, windowHeight)
  //createCanvas(sz, sz)
  createCanvas(windowWidth, windowHeight)
  frameRate(60)

  noSmooth()

  var lines = 64 * 2
  var steps = 100 * 2

  updown = new UpDown(lines, steps)
}

function draw() {
  background(0)

  updown.draw()
}

//
//
//
class UpDown {
  constructor(lines, steps) {
    this.lines = lines
    this.steps = steps

    this.mode = 0

    this.y_unit = windowHeight / this.lines
    this.x_unit = windowWidth / this.steps
    this.points = new Array(this.lines + 1)
    this.t = new Array(this.lines + 1)
    for (var i = 0; i <= this.lines; i++) {
      this.points[i] = []
      this.t[i] = [0, random(0.01, 1 / 60)]
    }

    this.generate()
  }

  generate() {
    for (var i = 0; i <= this.steps; i++) {
      var prev_y = 0
      var perc = map(sin((i / this.steps) * Math.PI * 2), -1, 1, 0, 1)
      for (var j = 0; j <= this.lines; j++) {
        var y = map(noise(i, j), 0, 1, prev_y, j * this.y_unit * perc)
        this.points[j].push([i * this.x_unit, y])
        prev_y = y
      }
    }
  }

  modify() {
    for (var i = 0; i <= this.steps; i++) {
      var prev_y = 0
      for (var j = 0; j <= this.lines; j++) {
        var t = this.t[j][0]
        var perc = noise(t) * 2
        //var perc = map(
        //sin((i / this.steps) * Math.PI * map(noise(i, t), 0, 1, 2, 4) + t),
        //-1,
        //1,
        //0,
        //1
        //)
        var y = map(
          noise(i + t, j + t, t),
          0,
          1,
          prev_y,
          j * this.y_unit * perc
        )
        this.points[j][i][1] = y
        prev_y = y
      }
    }
  }

  vertex(x, y) {
    if (this.mode == 0) {
      curveVertex(x, y)
    } else if (this.mode == 1) {
      vertex(x, y)
    } else if (this.mode == 2) {
      point(x, y)
    }
  }

  draw() {
    stroke(255)
    strokeWeight(1)
    noStroke()
    noFill()
    //fill(0, 0, map(sin(this.t[0][0]), -1, 1, 0, 255))
    for (var j = 1; j <= this.lines; j++) {
      var t = this.t[j][0]
      fill(0, 0, map(noise(j + t, t), 0, 1, 0, 255))
      //stroke(0, 0, map(noise(j + t, t), 0, 1, 0, 255))
      beginShape()

      if (this.mode == 0) {
        this.vertex(0, j * this.y_unit)
      }
      for (var i = 0; i <= this.steps; i++) {
        this.vertex(this.points[j][i][0], this.points[j][i][1])
      }
      if (this.mode == 0) {
        this.vertex(0, j * this.y_unit)
      }
      endShape()
    }

    this.modify()

    for (var i = 0; i < this.t.length; i++) {
      this.t[i][0] += this.t[i][1]
    }
  }
}

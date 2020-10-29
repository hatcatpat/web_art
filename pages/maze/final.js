let image
function preload() {
  image = loadImage("grace.png")
  //image = loadImage("strawb.png")
  //image = loadImage("words.png")
}

let grid, sz, unit, res
let runners, running, t
let hue, mode
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL)
  //noSmooth()
  frameRate(60)

  sz = Math.min(width, height)

  t = 0

  //res = 16 * 2
  res = 256

  mode = Math.floor(random(0, 2))

  image.resize(res, res)

  var possible_starts = []

  hue = random(0, 360)
  grid = Array(res)
  for (var i = 0; i < res; i++) {
    grid[i] = Array(res)
    for (var j = 0; j < res; j++) {
      var v = 1
      //var c = image.get(i, j)
      //console.log(c)
      //if ((c[0] + c[1] + c[2]) / (255 * 3) > 0.5) {

      var dx = i - res / 2
      var dy = j - res / 2
      if (Math.sqrt(dx * dx + dy * dy) < (res / 2) * 0.9) {
        v = 0
        possible_starts.push([i, j])
      }
      grid[i][j] = v
    }
  }

  unit = (sz / res) * 0.9

  runners = []

  for (var i = 0; i < 64; i++) {
    var rand_index = floor(random(0, possible_starts.length))
    var p = possible_starts[rand_index]

    runners.push(new MazeRunner(p[0], p[1], i + 2))
  }
}

function draw() {
  background(255)

  noStroke()

  translate(-width / 2, -height / 2)
  translate(width / 2 - (unit * res) / 2, height / 2 - (unit * res) / 2)

  running = true
  //for (var i = 0; i < 1; i++) {
  while (running) {
    running = false
    for (var j = 0; j < runners.length; j++) {
      running = running || runners[j].running
    }
    for (var j = 0; j < runners.length; j++) {
      if (runners[j].running) {
        runners[j].draw()
      }
    }
  }
  noLoop()
  //}
  t++

  draw_grid()
  //draw_grid_lines()
}

function draw_grid() {
  noStroke()
  fill(0)
  rect(-unit, 0, unit, unit * res)
  rect(unit * res, 0, unit, unit * res)
  rect(-unit, -unit, unit * (res + 2), unit)
  rect(-unit, unit * res, unit * (res + 2), unit)

  var col = color(255, 0, 0)
  strokeWeight(1)
  noStroke()
  for (var i = 0; i < res; i++) {
    for (var j = 0; j < res; j++) {
      if (grid[i][j] == 0 || grid[i][j] == 1) {
        //col = color(0)
        col = color(255)
      } else {
        var b = 0

        for (var k = 0; k < runners.length; k++) {
          if (grid[i][j] == runners[k].type) {
            //b = (k / runners.length) * 80 + 20
            b = (k / runners.length) * 80 + 20
            hue = (k / runners.length) * 360
          }
        }
        colorMode(HSB, 360, 100, 100)
        //col = color(hue, 100, b)
        col = color(0, 0, b)
        //col = color(hue, 100, 100)
        colorMode(RGB, 255)
      }

      fill(col)
      //stroke(col)
      rect(i * unit, j * unit, unit, unit)
    }
  }
}

function draw_grid_lines() {
  stroke(0)
  for (var i = 0; i <= grid.length; i++) {
    line(i * unit, 0, i * unit, unit * grid.length)
    line(0, i * unit, unit * grid.length, i * unit)
  }
}

//
//
//

class MazeRunner {
  constructor(x, y, type) {
    this.x = x
    this.y = y
    this.points = [[this.x, this.y]]
    this.curr_point = 0
    this.dirs = []
    this.retries = 0
    this.type = type
    grid[this.x][this.y] = this.type
    this.running = true
  }

  draw() {
    this.get_dirs()

    if (this.dirs.indexOf("left") != -1) {
      this.check_left()
    }
    if (this.dirs.indexOf("right") != -1) {
      this.check_right()
    }
    if (this.dirs.indexOf("up") != -1) {
      this.check_up()
    }
    if (this.dirs.indexOf("down") != -1) {
      this.check_down()
    }

    //console.log(this.dirs)
    //console.log("checks finished")

    if (this.dirs.length == 0) {
      if (this.retries < this.points.length - 1) {
        this.points.splice(this.curr_point, 1)
        this.curr_point = this.points.length - 1 - this.retries
        this.x = this.points[this.curr_point][0]
        this.y = this.points[this.curr_point][1]
        this.retries++
      } else {
        //generate()
        this.x = -1
        this.y = -1
        this.running = false
        this.points = []
        //noLoop()
      }
    } else {
      this.retries = 0
      if (random(0, 100) < 50) {
        //if (this.type % 2 == 0) {
        //if (mode == 0) {
        this.move(this.dirs[Math.floor(random(0, this.dirs.length))])
      } else {
        this.move(this.dirs[this.type % this.dirs.length])
        //this.move(this.dirs[0])
      }
    }
  }

  move(dir) {
    if (dir == "left") {
      this.x -= 1
    } else if (dir == "right") {
      this.x += 1
    } else if (dir == "up") {
      this.y -= 1
    } else if (dir == "down") {
      this.y += 1
    }
    grid[this.x][this.y] = this.type
    this.points = this.points.concat([[this.x, this.y]])
  }

  get_dirs() {
    var dirs = []
    if (this.x > 0) {
      dirs = dirs.concat("left")
    }
    if (this.x < res - 1) {
      dirs = dirs.concat("right")
    }
    if (this.y > 0) {
      dirs = dirs.concat("up")
    }
    if (this.y < res - 1) {
      dirs = dirs.concat("down")
    }
    this.dirs = dirs
  }

  //

  check_left() {
    if (grid[this.x - 1][this.y] != 0) {
      this.remove_dir("left")
    } else {
      this.far_check_left(this.x - 1, this.y)
    }
  }

  check_right() {
    if (grid[this.x + 1][this.y] != 0) {
      this.remove_dir("right")
    } else {
      this.far_check_right(this.x + 1, this.y)
    }
  }

  check_up() {
    if (grid[this.x][this.y - 1] != 0) {
      this.remove_dir("up")
    } else {
      this.far_check_up(this.x, this.y - 1)
    }
  }

  check_down() {
    if (grid[this.x][this.y + 1] != 0) {
      this.remove_dir("down")
    } else {
      this.far_check_down(this.x, this.y + 1)
    }
  }

  //

  L(x, y) {
    var val = false
    if (x >= 1) {
      if (grid[x - 1][y] != 0) {
        val = true
        //console.log("L")
      }
    }
    return val
  }

  R(x, y) {
    var val = false
    if (x <= res - 2) {
      if (grid[x + 1][y] != 0) {
        val = true
        //console.log("R")
      }
    }
    return val
  }

  U(x, y) {
    var val = false
    if (y >= 1) {
      if (grid[x][y - 1] != 0) {
        val = true
        //console.log("U")
      }
    }
    return val
  }

  D(x, y) {
    var val = false
    if (y <= res - 2) {
      if (grid[x][y + 1] != 0) {
        val = true
        //console.log("D")
      }
    }
    return val
  }

  far_check_left(x, y) {
    if (this.L(x, y) || this.U(x, y) || this.D(x, y)) {
      //console.log("far L")
      this.remove_dir("left")
    }
  }

  far_check_right(x, y) {
    if (this.R(x, y) || this.U(x, y) || this.D(x, y)) {
      //console.log("far R")
      this.remove_dir("right")
    }
  }

  far_check_up(x, y) {
    if (this.R(x, y) || this.U(x, y) || this.L(x, y)) {
      //console.log("far U")
      this.remove_dir("up")
    }
  }

  far_check_down(x, y) {
    if (this.R(x, y) || this.L(x, y) || this.D(x, y)) {
      //console.log("far D")
      this.remove_dir("down")
    }
  }

  remove_dir(dir) {
    if (this.dirs.indexOf(dir) != -1) {
      //console.log("removed " + dir)
      this.dirs.splice(this.dirs.indexOf(dir), 1)
    }
  }
}

let grid, sz, unit, res
let mr, running, t
function setup() {
  createCanvas(windowWidth, windowHeight)
  noSmooth()
  frameRate(60)

  sz = Math.min(width, height)

  t = 0

  res = 64 + 8
  //res = 256
  grid = Array(res)
  for (var i = 0; i < res; i++) {
    grid[i] = Array(res)
    for (var j = 0; j < res; j++) {
      var v = 0

      if (
        grid_rect(i, j, 4, 4, 4, 24) || // F
        grid_rect(i, j, 8, 4, 8, 4) ||
        grid_rect(i, j, 8, 16, 8, 4) ||
        grid_rect(i, j, 20, 16, 4, 12) || // U
        grid_rect(i, j, 24, 24, 8, 4) ||
        grid_rect(i, j, 32, 16, 4, 12) ||
        grid_rect(i, j, 40, 16, 4, 12) || // C
        grid_rect(i, j, 44, 16, 4, 4) ||
        grid_rect(i, j, 44, 24, 4, 4) ||
        grid_rect(i, j, 52, 4, 4, 24) || // K
        grid_rect(i, j, 56, 16, 4, 4) ||
        grid_rect(i, j, 60, 12, 4, 4) ||
        grid_rect(i, j, 60, 20, 4, 4)
      ) {
        v = 1
      }

      grid[i][j] = v
    }
  }

  unit = (sz / res) * 0.75

  running = true
  mr = new MazeRunner(Math.floor(random(0, res)), Math.floor(random(0, res)))
}

function grid_rect(i, j, x, y, w, h) {
  if (x <= i && i < x + w && y <= j && j < y + h) {
    return true
  } else {
    return false
  }
}

function generate() {
  for (var i = 0; i < res; i++) {
    for (var j = 0; j < res; j++) {
      var v = 0

      if (
        grid_rect(i, j, 4, 4, 4, 24) || // F
        grid_rect(i, j, 8, 4, 8, 4) ||
        grid_rect(i, j, 8, 16, 8, 4) ||
        grid_rect(i, j, 20, 16, 4, 12) || // U
        grid_rect(i, j, 24, 24, 8, 4) ||
        grid_rect(i, j, 32, 16, 4, 12) ||
        grid_rect(i, j, 40, 16, 4, 12) || // C
        grid_rect(i, j, 44, 16, 4, 4) ||
        grid_rect(i, j, 44, 24, 4, 4) ||
        grid_rect(i, j, 52, 4, 4, 24) || // K
        grid_rect(i, j, 56, 16, 4, 4) ||
        grid_rect(i, j, 60, 12, 4, 4) ||
        grid_rect(i, j, 60, 20, 4, 4)
      ) {
        v = 1
      }
      grid[i][j] = v
    }
  }
  var valid_pos = false
  while (!valid_pos) {
    var x = Math.floor(random(0, res))
    var y = Math.floor(random(0, res))
    if (grid[x][y] == 0) {
      valid_pos = true
    }
  }
  mr = new MazeRunner(x, y)
}

function draw() {
  background(255)
  noStroke()

  translate(width / 2 - (unit * res) / 2, height / 2 - (unit * res) / 2)

  //if (t % 2 == 0) {
  for (var i = 0; i < 16; i++) {
    if (running) {
      //while (running) {
      mr.draw()
    }
  }
  //}
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
      //stroke(0)
      if (grid[i][j] == 0) {
        //noStroke()
        col = color(0)
      } else if (i == mr.x && j == mr.y) {
        col = color(255, 0, 0)
      } else {
        //col = color(noise((i / res) * 4, (j / res) * 4) * 255)
        col = color(255)
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
  constructor(x, y) {
    this.x = x
    this.y = y
    grid[this.x][this.y] = 1
    this.points = [[this.x, this.y]]
    this.curr_point = 0
    this.dirs = []
    this.retries = 0
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
        generate()
        this.x = -1
        this.y = -1
        //running = false
        //noLoop()
      }
    } else {
      this.retries = 0
      this.move(this.dirs[Math.floor(random(0, this.dirs.length))])
      //this.move(this.dirs[0])
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
    grid[this.x][this.y] = 1
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
    if (grid[this.x - 1][this.y] == 1) {
      this.remove_dir("left")
    } else {
      this.far_check_left(this.x - 1, this.y)
    }
  }

  check_right() {
    if (grid[this.x + 1][this.y] == 1) {
      this.remove_dir("right")
    } else {
      this.far_check_right(this.x + 1, this.y)
    }
  }

  check_up() {
    if (grid[this.x][this.y - 1] == 1) {
      this.remove_dir("up")
    } else {
      this.far_check_up(this.x, this.y - 1)
    }
  }

  check_down() {
    if (grid[this.x][this.y + 1] == 1) {
      this.remove_dir("down")
    } else {
      this.far_check_down(this.x, this.y + 1)
    }
  }

  //

  L(x, y) {
    var val = false
    if (x >= 1) {
      if (grid[x - 1][y] == 1) {
        val = true
        //console.log("L")
      }
    }
    return val
  }

  R(x, y) {
    var val = false
    if (x <= res - 2) {
      if (grid[x + 1][y] == 1) {
        val = true
        //console.log("R")
      }
    }
    return val
  }

  U(x, y) {
    var val = false
    if (y >= 1) {
      if (grid[x][y - 1] == 1) {
        val = true
        //console.log("U")
      }
    }
    return val
  }

  D(x, y) {
    var val = false
    if (y <= res - 2) {
      if (grid[x][y + 1] == 1) {
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

var t, th
var x_prop, y_prop
var y_unit
var num_rows, num_cols, rows
var num_paths
function setup() {
  createCanvas(windowWidth, windowHeight)
  //noSmooth()
  frameRate(60)
  smooth()

  //
  t = 0
  th = random(0.0, 2 * Math.PI)

  num_rows = 8 * 8 * 3 * 8
  num_cols = 5 * 8

  num_paths = 2 * 2

  y_prop = 0.75
  x_prop = 0.8

  y_prop = 0.7
  x_prop = 0.9

  y_unit = height / num_rows

  rows = []
  for (var i = 0; i < num_rows; i++) {
    rows.push(Array(num_cols).fill(1))
    normalize(rows[i])
  }
}

function normalize(arr) {
  var sum = 0
  for (var i = 0; i < arr.length; i++) {
    sum += arr[i]
  }
  for (var i = 0; i < arr.length; i++) {
    arr[i] /= sum
  }
  return arr
}

function sizeFunc(i, j) {
  //return (sin((i + j) * 2 * Math.PI + t) + 1) / 2
  var s = (sin((i + j + random(0.0, 0.2)) * 2 * Math.PI + th) + 1) / 2
  //return (sin((i + j + random(0.0, 0.2)) * 2 * Math.PI + th) + 1) / 2
  return s * noise(i * 8, j * 8)
  //return (sin(noise(i, j, t) * 2 * Math.PI) + 1) / 2
}

function isPath(j, num) {
  return j % floor(num / (num_paths + 1)) == 0 && j != 0
}

function draw() {
  background(255)
  stroke(0)

  for (var i = 0; i < num_rows; i++) {
    for (var j = 0; j < num_cols; j++) {
      rows[i][j] = sizeFunc(i / num_rows, j / num_cols)
    }
  }

  margin(0.8)

  noStroke()
  rectMode(CENTER)
  for (var i = 0; i < num_rows; i++) {
    var y = i * y_unit
    var arr = normalize(rows[i])
    var x_sum = 0
    for (var j = 0; j < num_cols; j++) {
      var x = arr[j] * width
      //if (j != floor(num_cols / 2)) {
      if (!isPath(j, num_cols)) {
        fill(map(arr[j] / max(arr), 0, 1, 0, 200))
      } else {
        fill(0)
      }
      rect(x_sum + x / 2, y + y_unit / 2, x * x_prop, y_unit * y_prop)
      x_sum += x
    }
  }

  t += 0.01

  noLoop()
}

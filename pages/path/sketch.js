const pi = Math.PI
var t = 0
var steps, num_lines, x_unit, y_unit, f
function setup() {
  createCanvas(windowWidth, windowHeight)
  //noSmooth()
  frameRate(60)
  smooth()
}

function wiggle(id) {
  //circle(0.5 * x_unit, (id + 0.5) * y_unit, 20)
  //circle((steps - 0.5) * x_unit, (id + 0.5) * y_unit, 20)
  var num = 32 / 4
  //var num = 1
  for (var k = 0; k < num; k++) {
    //stroke(noise(id) * 255)
    stroke((255 * k) / num)
    //stroke(noise(id * 1000, k, -t) * 255)
    beginShape()
    for (var i = 0; i < steps; i++) {
      var p = i / (steps - 1)
      var x = (i + 0.5) * x_unit
      var n = map(f(p, t, id), 0, 1, -sin(p * pi), sin(p * pi))
      var y = sin((p + n) * 2 * pi) - (k - 1) / num
      //y *= (y_unit / 2) * 0.9 * ((k + 1) / num)
      y *= (y_unit / 2) * 1.0

      //circle(x, (id + 0.5) * y_unit + y, 6)
      vertex(x, (id + 0.5) * y_unit + y)
    }
    endShape()
  }
}

function keyPressed(key) {
  if (key.key == "p") {
    noLoop()
  } else {
    loop()
  }
}

function draw() {
  background(255)

  f = noise
  //f = (x, y, z) => (cos(x * 1 * pi + y) + 1) / 2
  //f = (x, y, z) => sin(noise(x, y, z) * 8 * pi)
  steps = 128
  num_lines = 5
  x_unit = width / steps
  y_unit = height / num_lines

  stroke(0)
  noFill()

  translate(width / 2, height / 2)
  scale(0.75)
  translate(-width / 2, -height / 2)

  for (var i = 0; i < num_lines; i++) {
    wiggle(i)
  }

  translate(width / 2, height / 2)
  rotate(pi / 2)
  translate(-width / 2, -height / 2)
  for (var i = 0; i < num_lines; i++) {
    wiggle(i)
  }

  //stroke(0)
  //rectMode(CENTER)
  //strokeWeight(20)
  //square(width / 2, height / 2, min(width, height) / 2)
  strokeWeight(5)

  t += 0.003 * 8
}

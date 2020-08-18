var canvas

//// USEFUL FUNCTIONS

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
}

function margin(m) {
  translate(width / 2, height / 2)
  scale(m, m)
  translate(-width / 2, -height / 2)
}

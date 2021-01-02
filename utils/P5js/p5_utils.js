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

function VAdd(A, B)
{
  return p5.Vector.add(A,B)
}

function VSub(A, B)
{
  return p5.Vector.sub(A,B)
}

function VMul(A, B)
{
  return p5.Vector.mult(A,B)
}

function VDiv(A, B)
{
  return p5.Vector.div(A,B)
}
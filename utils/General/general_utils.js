var sin = Math.sin
var cos = Math.cos
var PI = Math.PI
var TWOPI = Math.PI * 2
var random = Math.random

function lerp(lo, hi, x) {
  return (1 - x) * lo + x * hi
}

function randint(lo, hi) {
  hi++
  return Math.floor(Math.random() * (hi - lo) + lo)
}

function choose(arr) {
  return arr[randint(0, arr.length - 1)]
}

function map(x, in_min, in_max, out_min, out_max) {
  return ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
}
// TODO: Update map to use in,in, out,out; instead of the old out,out, in,in

function rand(lo, hi) {
  return map(Math.random(), lo, hi, 0, 1)
}

function carteToSpherical(x, y, z) {
  var r = Math.sqrt(x * x + y * y + z * z)
  var psi = Math.atan2(y, x)
  var theta = Math.acos(z / r)
  return { r: r, psi: psi, theta: theta }
}

function sphericalToCarte(r, psi, theta) {
  var x = r * Math.sin(theta) * Math.cos(psi)
  var y = r * Math.sin(theta) * Math.sin(psi)
  var z = r * Math.cos(theta)
  return { x: x, y: y, z: z }
}

var layers
var radius, num_iter
let nsc
function setup() {
  createCanvas(windowWidth, windowHeight, SVG)
  // noSmooth()
  // frameRate(60)
  // smooth()
  noLoop()

  nsc = floor(random(1,16+1))

  let initial_segs = 64 * 4
  num_iter = initial_segs
  // let initial_segs = 32
  // num_iter = 16
  let th_unit = PI * 2 / (initial_segs - 1)
  // radius = 0.01 * min(width, height) / 2 * 1.2
  // radius = 0.05 * min(width, height) / 2
  radius = (min(width, height) / 2) * 0.9 / (initial_segs - 1)

  layers = []
  for (let i = 0; i < num_iter; i++) {
    layers.push([])
  }
  window.layers = layers

  // let min_radius = radius * 7
  let min_radius = 0.05 * min(width, height) / 2
  for (let i = 0; i < initial_segs; i++) {
    let th = i * th_unit
    layers[0].push(new Node(th, min_radius))
  }

  for (let i = 0; i < num_iter - 1; i++) {
    for (let j = 0; j < layers[i].length - 1; j++) {
      const A = layers[i][j].th
      const B = layers[i][(j + 1) % layers[i].length].th
      const th = A + (abs(B - A) / 2 * 0.4)
      layers[i + 1].push(new Node(
        th,
        min_radius + radius * (i + 1)
      ))
      layers[i][j].addChild(layers[i + 1][layers[i + 1].length - 1])
      layers[i][(j + 1) % layers[i].length].addChild(layers[i + 1][layers[i + 1].length - 1])
    }
  }

}

function keyPressed(k) {
  if (k.key == "s") {
    save("" + day() + "_" + hour() + "_" + second() + ".svg");
  }
}

function draw() {

  background(255)
  for (let i = 0; i < 60 * 2; i++) {
    layers.forEach(layer => {
      layer.forEach(node => {
        node.draw(false)
      })
    })
  }

  layers.forEach(layer => {
    layer.forEach(node => {
      node.draw(true)
    })
  })

}
//
//
//
//
class Node {

  constructor(th, r) {
    this.th = th
    this.r = r
    this.t = random(0, 100)
    this.children = []
  }

  addChild(node) {
    this.children.push(node)
  }

  draw(visible) {
    const p = this.getCarte()

    if (visible) {
      strokeWeight(0.1)
      stroke(0)
      this.children.forEach(child => {
        const o = child.getCarte()
        line(p.x, p.y, o.x, o.y)
      })
    }

    // this.th += noise(p.x / width * nsc, p.y / height * nsc, this.t / 1000) * 0.05
    this.th += sin(noise(p.x / width * nsc, p.y / height * nsc, this.t / 1000) * 2 * PI) * 0.05

    this.t++
  }

  getCarte() {
    const x = this.r * cos(this.th) + width / 2 * 1
    const y = this.r * sin(this.th) + height / 2
    return { x: x, y: y }
  }

}
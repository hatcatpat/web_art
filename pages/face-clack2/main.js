import * as THREE from "../../node_modules/three/build/three.module.js"
window.THREE = THREE
setup({ antialias: true })

import { ImprovedNoise } from "../../node_modules/three/examples/jsm/math/ImprovedNoise.js"
import { OrbitControls } from "../../node_modules/three/examples/jsm/controls/OrbitControls.js"

//
//
//

class Clacker {
  constructor(x, y, r) {
    this.x = x
    this.y = y

    this.ns = 4

    this.r =
      r *
      map(perlin.noise(this.x * this.ns, this.y * this.ns, 0), -1, 1, 0.5, 1.5)

    var scx = 0.4
    var scy = 0.5
    var pixel_data = getPixelFract(
      map(this.x, -scx, scx, 0, 1),
      map(this.y, -scy, scy, 1, 0)
    )
    var col = new THREE.Color()
    col.setRGB(pixel_data.r / 255, pixel_data.g / 255, pixel_data.b / 255)

    //var br = (col.r + col.b + col.g) / 3
    //br = map(br, 0, 1, 1.5, 0.5)

    //this.r = r * br
    //

    this.body = new CANNON.Body({ mass: 1 })
    this.body.addShape(new CANNON.Sphere(this.r))
    this.body.position.set(this.x, this.y, 0)

    //

    var geom = new THREE.SphereGeometry(this.r, 32, 32)
    //col.setHSL(
    //0,
    //0,
    //(pixel_data.r / 255 + pixel_data.g / 255 + pixel_data.b / 255) / 3
    ////0.5
    ////map(perlin.noise(this.x * this.ns, this.y * this.ns, 0), -1, 1, 0, 1)
    //)
    var mat = new THREE.MeshBasicMaterial({ color: col })
    this.mesh = new THREE.Mesh(geom, mat)
    this.mesh.position.copy(this.body.position)
    this.mesh.quaternion.copy(this.body.quaternion)
  }

  add(scene, world) {
    scene.add(this.mesh)
    world.addBody(this.body)
  }

  animate() {
    this.mesh.position.copy(this.body.position)
    this.mesh.quaternion.copy(this.body.quaternion)

    //var p = this.body.position
    //if (Math.abs(p.x) > 2 || Math.abs(p.y) > 2) {
    //this.reset()
    //}
  }

  reset() {
    this.body.position.set(this.x, this.y, 0)
    this.body.velocity.set(0, 0, 0)
  }
}

//
//
//

class Clackers {
  constructor(count) {
    this.count = count

    this.clackers = []
    var unit = 1 / this.count
    this.unit = unit
    var r = unit * 0.5 * 0.8
    var m = (this.count - 1) * unit
    this.m = m
    for (var i = 0; i < this.count; i++) {
      for (var j = 0; j < this.count; j++) {
        this.clackers.push(new Clacker(i * unit - m / 2, j * unit - m / 2, r))
      }
    }
  }

  animate() {
    for (var i = 0; i < this.clackers.length; i++) {
      this.clackers[i].animate()
    }
  }

  reset() {
    for (var i = 0; i < this.clackers.length; i++) {
      this.clackers[i].reset()
    }
  }

  add(scene, world) {
    for (var i = 0; i < this.clackers.length; i++) {
      this.clackers[i].add(scene, world)
    }
  }
}

//
//
//

function getImageData(image) {
  var canvas = document.createElement("canvas")
  canvas.width = image.width
  canvas.height = image.height

  var context = canvas.getContext("2d")
  context.drawImage(image, 0, 0)

  return context.getImageData(0, 0, image.width, image.height)
}

function getPixelFract(x, y) {
  var x = Math.floor(image_data.width * x) * 4
  var y = Math.floor(image_data.height * y) * 4

  var position = x + image_data.width * y,
    data = image_data.data
  return {
    r: data[position],
    g: data[position + 1],
    b: data[position + 2],
    a: data[position + 3],
  }
}

var seed = performance.now()
var hfBody
function setupHeightmap() {
  // Create a matrix of height values
  var matrix = []
  var h = map(Math.random(), 0, 1, 0.2, 1)
  var sc = map(Math.random(), 0, 1, 2, 4)
  var sizeX = 15 * 4,
    sizeY = 15 * 4
  for (var i = 0; i < sizeX; i++) {
    matrix.push([])
    for (var j = 0; j < sizeY; j++) {
      var height =
        map(
          perlin.noise((i / sizeX) * sc, (j / sizeY) * sc, seed),
          -1,
          1,
          0,
          1
        ) * h
      if (i === 0 || i === sizeX - 1 || j === 0 || j === sizeY - 1) height = -h
      matrix[i].push(height)
    }
  }

  // Create the heightfield
  var sz = 0.05
  var hfShape = new CANNON.Heightfield(matrix, {
    elementSize: sz,
  })
  hfBody = new CANNON.Body({ mass: 0 })
  hfBody.position.z = -h
  hfBody.position.x = (-sizeX / 2) * sz
  hfBody.position.y = (-sizeY / 2) * sz
  hfBody.addShape(hfShape)
  world.addBody(hfBody)
}

var world
var clackers
var controls, perlin
var image_data
var w
function main() {
  world = new CANNON.World()
  world.broadphase = new CANNON.NaiveBroadphase()
  world.solver.iterations = 10
  world.gravity.set(0, 0, -1)

  //

  camera.position.z = 1

  //var aspect = Math.min(width, height) / Math.max(width, height)
  //w = 0.75
  //var h = 0.75
  //camera = new THREE.OrthographicCamera(
  //-w,
  ////0,
  //w,
  //h * aspect,
  //-h * aspect,
  //-100,
  //100
  //)
  //scene.add(camera)

  //

  controls = new OrbitControls(camera, renderer.domElement)

  perlin = new ImprovedNoise()

  //

  var image_texture = new THREE.TextureLoader().load("lisa.jpg", function () {
    image_data = getImageData(image_texture.image)
    clackers = new Clackers(23)
    clackers.add(scene, world)
    window.clackers = clackers
  })

  //

  setupHeightmap()

  var plane = new CANNON.Body({ mass: 0 })
  plane.addShape(new CANNON.Plane())
  plane.position.x = -1
  plane.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), (1 * Math.PI) / 2)
  world.add(plane)

  var plane = new CANNON.Body({ mass: 0 })
  plane.addShape(new CANNON.Plane())
  plane.position.x = 1
  plane.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), (3 * Math.PI) / 2)
  world.add(plane)

  var plane = new CANNON.Body({ mass: 0 })
  plane.addShape(new CANNON.Plane())
  plane.position.y = 1
  plane.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), (1 * Math.PI) / 2)
  world.add(plane)

  var plane = new CANNON.Body({ mass: 0 })
  plane.addShape(new CANNON.Plane())
  plane.position.y = -1
  plane.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), (3 * Math.PI) / 2)
  world.add(plane)

  //var plane_mesh = new THREE.Mesh(
  //new THREE.PlaneGeometry(1, 1),
  //new THREE.MeshBasicMaterial({ color: 0xff0000 })
  //)
  //plane_mesh.position.copy(plane.position)
  //plane_mesh.quaternion.copy(plane.quaternion)
  //scene.add(plane_mesh)

  //

  renderer.render(scene, camera)

  animate()
}
main()

var clackers_playing = false
document.addEventListener("keydown", onKeyDown, false)
function onKeyDown(event) {
  var keycode = event.which
  if (keycode == 80) {
    clackers_playing = true
  }
  if (keycode == 81) {
    world.removeBody(hfBody)
    seed = performance.now()
    setupHeightmap()
    clackers.reset()
  }
}

var t = 0
function animate() {
  requestAnimationFrame(animate)

  if (clackers_playing) {
    world.step(1 / 60)

    if (clackers != null) {
      clackers.animate()
    }

    t += 0.01
  }

  renderer.render(scene, camera)
}

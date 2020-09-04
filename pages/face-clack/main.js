import * as THREE from "../../node_modules/three/build/three.module.js"
window.THREE = THREE
setup()

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

    //

    this.body = new CANNON.Body({ mass: 1 })
    this.body.addShape(new CANNON.Sphere(this.r))
    this.body.position.set(this.x, this.y, 0)

    //

    var geom = new THREE.SphereGeometry(this.r, 32, 32)

    var pixel_data = getPixelFract(
      map(this.x, -1, 1, 0, 1),
      map(this.y, -1, 1, 1, 0)
    )
    var col = new THREE.Color()
    col.setRGB(pixel_data.r / 255, pixel_data.g / 255, pixel_data.b / 255)
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
    this.body.position.z = 0
    this.mesh.position.copy(this.body.position)
    this.mesh.quaternion.copy(this.body.quaternion)
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
    var r = unit * 0.5 * 0.8
    var m = (this.count - 1) * unit
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
  var x = Math.floor(image_data.width * x)
  var y = Math.floor(image_data.height * y)

  var position = (x + image_data.width * y) * 4,
    data = image_data.data
  return {
    r: data[position],
    g: data[position + 1],
    b: data[position + 2],
    a: data[position + 3],
  }
}

//function getPixel(x, y) {
//var position = (x + image_data.width * y) * 4,
//data = image_data.data
//return {
//r: data[position],
//g: data[position + 1],
//b: data[position + 2],
//a: data[position + 3],
//}
//}

var world
var clackers
var controls, perlin
var image_data
function main() {
  world = new CANNON.World()
  world.broadphase = new CANNON.NaiveBroadphase()
  world.solver.iterations = 10
  world.gravity.set(0, -1, 0)

  //

  var aspect = Math.min(width, height) / Math.max(width, height)
  var w = 0.75
  var h = 0.75
  camera = new THREE.OrthographicCamera(
    //-w,
    0,
    w,
    h * aspect,
    -h * aspect,
    -100,
    100
  )
  scene.add(camera)

  //

  controls = new OrbitControls(camera, renderer.domElement)

  perlin = new ImprovedNoise()

  //

  var image_texture = new THREE.TextureLoader().load("girl.jpg", function () {
    image_data = getImageData(image_texture.image)
    clackers = new Clackers(20)
    clackers.add(scene, world)
    window.clackers = clackers
  })

  //

  var plane = new CANNON.Body({ mass: 0 })
  plane.addShape(new CANNON.Plane())
  plane.position.y = 0
  plane.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), (3 * Math.PI) / 2)
  world.add(plane)

  var plane = new CANNON.Body({ mass: 0 })
  plane.addShape(new CANNON.Plane())
  plane.position.x = -0.5
  plane.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2)
  world.add(plane)

  var plane = new CANNON.Body({ mass: 0 })
  plane.addShape(new CANNON.Plane())
  plane.position.x = 0.5
  plane.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), (3 * Math.PI) / 2)
  world.add(plane)

  //var plane_mesh = new THREE.Mesh(
  //new THREE.PlaneGeometry(1, 1),
  //new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide })
  //)
  //plane_mesh.quaternion.copy(plane.quaternion)
  //plane_mesh.position.copy(plane.position)
  //scene.add(plane_mesh)
  //window.plane_mesh = plane_mesh

  //

  renderer.render(scene, camera)

  animate()
}
main()

function animate() {
  requestAnimationFrame(animate)

  world.step(1 / 60)

  if (clackers != null) {
    clackers.animate()
  }

  renderer.render(scene, camera)
}

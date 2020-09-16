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

    //

    this.body = new CANNON.Body({ mass: 1 })
    this.body.addShape(new CANNON.Sphere(this.r))
    this.body.position.set(this.x, this.y, 0)
    this.body.addEventListener("collide", this.collide.bind(this))

    var spring_origin = new CANNON.Body({ mass: 0 })
    spring_origin.position.set(this.x, this.y, 0)
    this.spring = new CANNON.Spring(spring_origin, this.body, {
      restLength: 0,
      stiffness: 200,
      damping: 0,
    })

    //

    var geom = new THREE.SphereGeometry(this.r, 32, 32)
    var col = new THREE.Color()
    col.setHSL(
      0,
      0,
      map(perlin.noise(this.x * this.ns, this.y * this.ns, 0), -1, 1, 0, 1)
    )
    var mat = new THREE.MeshBasicMaterial({ color: col })
    this.mesh = new THREE.Mesh(geom, mat)
    this.mesh.position.copy(this.body.position)
    this.mesh.quaternion.copy(this.body.quaternion)

    this.collide_obj = { t: 0, dur: 60, active: false }
  }

  collide(e) {
    if (!this.collide_obj.active) {
      this.collide_obj.active = true
    }
  }

  add(scene, world) {
    scene.add(this.mesh)
    world.addBody(this.body)
  }

  clack(force, t) {
    //this.collide_obj.active = true
    var dir = new THREE.Vector3()
    //dir.x = perlin.noise(this.x, this.y, t)
    //dir.y = perlin.noise(this.x, this.y, -t)

    dir.x = Math.random() * force - force / 2
    dir.y = Math.random() * force - force / 2

    dir.normalize()
    this.body.velocity.x = dir.x
    this.body.velocity.y = dir.y
  }

  animate(t) {
    this.mesh.position.copy(this.body.position)
    this.mesh.quaternion.copy(this.body.quaternion)
    this.spring.applyForce()

    //

    var sc = map(
      perlin.noise(this.x * this.ns, this.y * this.ns, t),
      -1,
      1,
      0.5,
      1.5
    )
    this.mesh.scale.set(sc, sc, 1)

    this.body.shapes[0].radius = this.r * sc
    this.body.shapes[0].boundingSphereRadiusNeedsUpdate = true
    this.body.shapes[0].updateBoundingSphereRadius()

    //

    if (this.collide_obj.active) {
      this.mesh.material.color.setHSL(
        0,
        1,
        this.collide_obj.t / this.collide_obj.dur / 2 + 0.5
      )

      //this.mesh.material.color = new THREE.Color(
      //this.collide_obj.t / this.collide_obj.dur,
      //0,
      //0
      //)

      if (this.collide_obj.t >= this.collide_obj.dur) {
        this.collide_obj.t = 0
        this.collide_obj.active = false
      } else {
        this.collide_obj.t++
      }
    } else {
      this.mesh.material.color.setHSL(
        0,
        0,
        map(perlin.noise(this.x * this.ns, this.y * this.ns, t), -1, 1, 0, 1)
      )
    }
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

    this.clack_timer = { t: 0, dur: 60 }
    this.t = 0
  }

  animate() {
    for (var i = 0; i < this.clackers.length; i++) {
      this.clackers[i].animate(this.t)
    }

    if (this.clack_timer.t > this.clack_timer.dur) {
      for (
        var i = 0;
        i < Math.floor(Math.random() * this.clackers.length);
        i++
      ) {
        var index = Math.floor(Math.random() * this.clackers.length)
        this.clackers[index].clack(Math.random() * 8 + 1)
      }
      //for (var i = 0; i < this.clackers.length; i++) {
      //this.clackers[i].clack(this.t)
      //}
      this.clack_timer.t = 0
    }

    this.clack_timer.t++
    this.t += 0.05
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

function loosen(v) {
  for (var i = 0; i < clackers.clackers.length; i++) {
    clackers.clackers[i].spring.restLength = v * Math.random()
  }
}
window.loosen = loosen

var world
var clackers
var controls, perlin
function main() {
  world = new CANNON.World()
  world.broadphase = new CANNON.NaiveBroadphase()
  world.solver.iterations = 10

  //

  var aspect = Math.min(width, height) / Math.max(width, height)
  var w = 0.75
  var h = 0.75
  camera = new THREE.OrthographicCamera(
    -w,
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

  clackers = new Clackers(25)
  clackers.add(scene, world)
  window.clackers = clackers

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
    //animate()
    clackers_playing = true
  }
  if (keycode == 81) {
    loosen(0.2)
  }
}

function animate() {
  requestAnimationFrame(animate)

  if (clackers_playing) {
    world.step(1 / 60)
    clackers.animate()
  }

  renderer.render(scene, camera)
}

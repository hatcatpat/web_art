import * as THREE from "../../node_modules/three/build/three.module.js"
window.THREE = THREE
setup()

import { ImprovedNoise } from "../../node_modules/three/examples/jsm/math/ImprovedNoise.js"
import { OrbitControls } from "../../node_modules/three/examples/jsm/controls/OrbitControls.js"

//
//
//

class Ball {
  constructor(sz, len, spring_settings, x, y, z) {
    this.body = new CANNON.Body({ mass: 1 })
    this.body.addShape(new CANNON.Sphere(sz))
    this.body.position.set(x, y, z)
    this.body.angularDamping = 0.5

    var geom = new THREE.SphereGeometry(sz, 32, 32)
    //var mat = new THREE.MeshStandardMaterial({ color: 0xffffff })
    var col = new THREE.Color()
    col.setHSL(0, 0, Math.random())
    var mat = new THREE.MeshBasicMaterial({ color: col })
    this.mesh = new THREE.Mesh(geom, mat)
    this.mesh.position.copy(this.body.position)
    this.mesh.quaternion.copy(this.body.quaternion)
    this.mesh.castShadow = true

    var spring_origin = new CANNON.Body({ mass: 0 })
    //spring_origin.position.set(x, y * 2, z)
    //spring_origin.position.set(x, 0, z)
    //spring_origin.position.set(0, 0, 0)
    this.spring = new CANNON.Spring(spring_origin, this.body, spring_settings)

    //this.origin_debug = new THREE.Mesh(
    //new THREE.SphereGeometry(sz / 4, 32, 32),
    //new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    //)
    //this.origin_debug.position.set(x, y * 2, z)
    //this.origin_debug.position.copy(spring_origin.position)

    //this.vel_dur = 60 * 2
    //this.t = 0
    //this.t = Math.random() * this.vel_dur

    var line_len = Math.floor(map(Math.random(), 0, 1, 2, 16))
    this.points = new Float32Array(line_len * 3)
    for (var i = 0; i < line_len; i++) {
      this.points[3 * i] = 0
      this.points[3 * i + 1] = 0
      this.points[3 * i + 2] = 0
    }
    this.line_geom = new THREE.BufferGeometry()
    this.line_geom.setAttribute(
      "position",
      new THREE.BufferAttribute(this.points, 3)
    )

    this.line_mat = new THREE.LineBasicMaterial({ color: 0x000000 })
    this.line = new THREE.Line(this.line_geom, this.line_mat)
  }

  add(scene, world) {
    scene.add(this.line)
    scene.add(this.mesh)
    world.addBody(this.body)
  }

  animate() {
    this.mesh.position.copy(this.body.position)
    this.mesh.quaternion.copy(this.body.quaternion)

    this.spring.applyForce()

    this.animateLine()

    //if (this.t > this.vel_dur) {
    //this.t = 0
    //this.vel_dur = Math.random() * 50 + 10
    //var x = -this.mesh.position.x * 4
    //var z = -this.mesh.position.z * 4
    //var x = Math.random() * 16 - 16
    //var y = Math.random() * 16 - 16
    //var z = Math.random() * 16 - 16
    //this.body.velocity.set(x, y, z)
    //} else {
    //this.t++
    //}
  }
  animateLine() {
    var a = this.line.geometry.attributes.position.array

    var pos = []
    for (var i = 0; i < a.length / 3; i++) {
      pos.push(a[3 * i], a[3 * i + 1], a[3 * i + 2])
    }
    pos.push(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z)
    pos.splice(0, 3)

    for (var i = 0; i < a.length / 3; i++) {
      a[3 * i] = pos[3 * i]
      a[3 * i + 1] = pos[3 * i + 1]
      a[3 * i + 2] = pos[3 * i + 2]
    }

    this.line.geometry.attributes.position.needsUpdate = true
    this.line.geometry.computeBoundingSphere()
  }
}

//

class Pendulum {
  constructor(scene, world, count) {
    this.balls = []
    var x_unit = 10 / count
    var y = 3
    for (var i = 0; i < count; i++) {
      var b = new Ball(
        //0.2,
        Math.random() * 0.3 + 0.1,
        //y,
        y * 8,
        //{ restLength: y, stiffness: 10, damping: 0 },
        { restLength: 2, stiffness: 10, damping: 0 },
        x_unit * i - (x_unit * count) / 2,
        y,
        0
      )
      //scene.add(b.mesh)
      b.add(scene, world)
      //scene.add(b.origin_debug)
      //world.addBody(b.body)
      this.balls.push(b)

      this.vel_dur = 60 * 2
      this.t = 0
    }
  }
  animate() {
    for (var i = 0; i < this.balls.length; i++) {
      this.balls[i].animate()
    }

    if (this.t > this.vel_dur) {
      this.t = 0

      for (var i = 0; i < this.balls.length; i++) {
        var v = 8
        //var v = map(Math.random(), 0, 1, 4, 16)
        if (Math.random() < 0.1) {
          v *= 4
        }
        var x = Math.random() * v - v / 2
        var y = Math.random() * v - v / 2
        var z = Math.random() * v - v / 2
        this.balls[i].body.velocity.set(x, y, z)
      }
    } else {
      this.t++
    }
  }
}

//

var controls
var world
var pendulum
function main() {
  world = new CANNON.World()
  //world.gravity.set(0, -1, 0)
  world.broadphase = new CANNON.NaiveBroadphase()
  world.solver.iterations = 10

  //

  renderer.shadowMap.enabled = true
  //camera.fov = 90
  //camera.position.set(0, 0, 0)
  //camera.updateProjectionMatrix()
  camera.position.set(0, 4, 4)
  controls = new OrbitControls(camera, renderer.domElement)

  var point = new THREE.PointLight(0xffffff, 0.3)
  point.position.set(0, 0, 0)
  //point.position.set(0, 64, 0)
  point.castShadow = true
  scene.add(point)

  var ambient = new THREE.AmbientLight(0xffffff, 0.2)
  scene.add(ambient)

  //

  pendulum = new Pendulum(scene, world, 128)
  window.pendulum = pendulum

  //

  //const plane = new THREE.Mesh(
  //new THREE.PlaneGeometry(100, 100),
  //new THREE.MeshStandardMaterial({ color: 0xaaaaaa, side: THREE.BackSide })
  //)
  //plane.receiveShadow = true
  //plane.position.y = -1
  //plane.rotateX(PI / 2)
  //scene.add(plane)

  //var plane_body = new CANNON.Body({
  //mass: 0,
  //})
  //plane_body.addShape(new CANNON.Plane())
  //plane_body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -PI / 2)
  //plane_body.position.copy(plane.position)
  //world.addBody(plane_body)

  var sphere = new THREE.Mesh(
    new THREE.SphereGeometry(8, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0xff0000, side: THREE.BackSide })
  )
  sphere.receiveShadow = true
  scene.add(sphere)

  renderer.render(scene, camera)

  animate()
}
main()

var th = 0
var psi = 0
function animate() {
  requestAnimationFrame(animate)

  world.step(1 / 60)
  pendulum.animate()

  var p = pendulum.balls[0].mesh.position
  var r = 4
  var x = r * sin(th) * cos(psi) + p.x
  var y = r * sin(th) * sin(psi) + p.y
  var z = r * cos(th) + p.z

  //camera.position.set(x, y, z)

  //th += 0.01
  //psi += 0.01
  //camera.lookAt(x, y, z)

  controls.update()

  renderer.render(scene, camera)
}

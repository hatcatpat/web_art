import * as THREE from "../../node_modules/three/build/three.module.js"
window.THREE = THREE
setup({ antialias: true })

import { ImprovedNoise } from "../../node_modules/three/examples/jsm/math/ImprovedNoise.js"
import { OrbitControls } from "../../node_modules/three/examples/jsm/controls/OrbitControls.js"

//
//
//

class BumpTrail {
  constructor(len, start) {
    this.len = len

    this.points = new Float32Array(this.len * 3)
    for (var i = 0; i < this.len; i++) {
      this.points[3 * i] = 0
      this.points[3 * i + 1] = 0
      this.points[3 * i + 2] = 0
    }

    this.geom = new THREE.BufferGeometry()
    this.geom.setAttribute(
      "position",
      new THREE.BufferAttribute(this.points, 3)
    )

    this.mat = new THREE.LineBasicMaterial({ color: 0x000000 })

    this.mesh = new THREE.Line(this.geom, this.mat)

    this.pos = 0
  }

  reset(p) {
    var a = this.mesh.geometry.attributes.position.array
    for (var i = 0; i < this.len; i++) {
      a[3 * i] = p.x
      a[3 * i + 1] = p.y
      a[3 * i + 2] = p.z
    }
    this.mesh.geometry.attributes.position.needsUpdate = true
    this.mesh.geometry.computeBoundingSphere()
  }

  animate(p) {
    var a = this.mesh.geometry.attributes.position.array

    var pos = []
    for (var i = 0; i < this.len; i++) {
      pos.push(a[3 * i], a[3 * i + 1], a[3 * i + 2])
    }
    pos.push(p.x, p.y, p.z)
    pos.splice(0, 3)

    for (var i = 0; i < this.len; i++) {
      a[3 * i] = pos[3 * i]
      a[3 * i + 1] = pos[3 * i + 1]
      a[3 * i + 2] = pos[3 * i + 2]
    }

    this.mesh.geometry.attributes.position.needsUpdate = true
    this.mesh.geometry.computeBoundingSphere()
  }
}

class Bump {
  constructor(sz) {
    this.sz = sz

    this.geom = new THREE.SphereGeometry(this.sz, 32, 32)
    this.col = new THREE.Color()
    this.col.setHSL(Math.random(), 0, 0.0)
    this.mat = new THREE.MeshBasicMaterial({
      color: this.col,
      side: THREE.DoubleSide,
    })

    this.mesh = new THREE.Mesh(this.geom, this.mat)
    this.x = Math.random()
    this.y = Math.random()
    this.z = Math.random()
    this.mesh.position.set(this.x, this.y, this.z)

    this.orig_step = 0.1 / 64
    this.step = this.orig_step
    this.sp = 0.1

    this.th = 0
    this.psi = 0
    this.th_sp = Math.random() * this.sp
    this.psi_sp = Math.random() * this.sp

    this.been_hit = false
    this.hit_t = 0
    this.hit_dur = 20

    this.trail = new BumpTrail(128 * 4)
    this.trail.reset({ x: this.x, y: this.y, z: this.z })
  }
  animate() {
    this.x += this.step * sin(this.th) * cos(this.psi)
    this.y += this.step * sin(this.th) * sin(this.psi)
    this.z += this.step * cos(this.th)

    var reset = false
    if (this.x < 0) {
      reset = true
      this.x = 1 + this.x
    }
    if (this.x >= 1) {
      reset = true
      this.x = 0
    }
    if (this.y < 0) {
      reset = true
      this.y = 1 + this.y
    }
    if (this.y >= 1) {
      reset = true
      this.y = 0
    }
    if (this.z < 0) {
      reset = true
      this.z = 1 + this.z
    }
    if (this.z >= 1) {
      reset = true
      this.z = 0
    }

    if (reset) {
      this.trail.reset({ x: this.x, y: this.y, z: this.z })
    }
    this.mesh.position.set(this.x, this.y, this.z)

    this.th += this.th_sp * Math.random()
    this.psi += this.psi_sp * Math.random()

    if (this.been_hit) {
      if (this.hit_t < this.hit_dur) {
        var perc = this.hit_t / this.hit_dur
        this.mat.color = new THREE.Color(sin(perc * PI), 0, 0)
        var sc = 1 + sin(perc * PI)
        this.mesh.scale.set(sc, sc, sc)
        this.hit_t++
      } else {
        this.been_hit = false
        this.step = this.orig_step
        this.mat.color = this.col
      }
    }

    this.trail.animate({ x: this.x, y: this.y, z: this.z })
  }

  hit(b) {
    if (!this.been_hit) {
      this.been_hit = true
      this.hit_t = 0
      if (b == 0) {
        this.th_sp *= -1
        this.psi_sp *= -1
      }
      this.step = (6 * Math.random() + 2) * this.orig_step

      this.mat.color = new THREE.Color(0x000000)
    }
  }
}

class BumpController {
  constructor(count, sz) {
    this.count = count
    this.sz = sz

    this.bumps = []
    var res = 0.01
    for (var i = 0; i < this.count; i++) {
      this.bumps.push(new Bump(res))
    }
  }
}

//
//
//

var bc, controls
function main() {
  var zoom = 1.0
  camera.position.set(0.5 + zoom, 0.5, 0.5 + zoom)
  //camera.lookAt(1, 1, 1)
  camera.updateProjectionMatrix()
  controls = new OrbitControls(camera, renderer.domElement)

  controls.target = new THREE.Vector3(0.5, 0.5, 0.5)
  controls.autoRotate = true
  controls.zoomSpeed = 0.5
  controls.update()

  bc = new BumpController(128 * 3, 1)

  for (var i = 0; i < bc.count; i++) {
    scene.add(bc.bumps[i].mesh)
    scene.add(bc.bumps[i].trail.mesh)
  }

  var cube = new THREE.BoxGeometry(1, 1, 1)

  var edges = new THREE.EdgesGeometry(cube)
  var line = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: 0x000000 })
  )
  line.position.set(0.5, 0.5, 0.5)
  scene.add(line)

  renderer.render(scene, camera)

  animate()
}
main()

function animate() {
  requestAnimationFrame(animate)

  for (var i = 0; i < bc.count; i++) {
    var b = bc.bumps[i]
    b.animate()
    for (var j = 0; j < bc.count; j++) {
      if (j != i) {
        var p = bc.bumps[j]
        if (b.mesh.position.distanceTo(p.mesh.position) < 0.05) {
          b.hit(1)
          p.hit(1)
        }
      }
    }
  }

  controls.update()

  renderer.render(scene, camera)
}

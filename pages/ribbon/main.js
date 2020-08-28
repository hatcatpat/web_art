import * as THREE from "../../node_modules/three/build/three.module.js"
window.THREE = THREE
setup()

import { ImprovedNoise } from "../../node_modules/three/examples/jsm/math/ImprovedNoise.js"
import { OrbitControls } from "../../node_modules/three/examples/jsm/controls/OrbitControls.js"
//
//
//
class Ribbon {
  constructor(len, h, res) {
    this.len = len
    this.h = h
    this.res = res

    this.geometry = new THREE.PlaneGeometry(this.len, this.h, 1, this.res)
    this.material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      wireframe: true,
    })

    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.rotateZ(PI / 2)

    this.direction = 0
    this.speed = 0.1 / 8
    this.step = 0.1 / 8
    this.orig_r = 5
    this.r = this.orig_r

    this.points = [this.mesh.geometry.vertices[0]]
    console.log(this.points)
  }

  movement(t) {}

  animate() {
    for (var i = 0; i < this.mesh.geometry.vertices.length - 2; i += 2) {
      var I = this.mesh.geometry.vertices.length - 2 - i

      this.mesh.geometry.vertices[I].y = this.mesh.geometry.vertices[I - 1].y
    }

    //for (var i = 0; i < this.mesh.geometry.vertices.length; i += 2) {
    //if (i == 0) {
    //this.mesh.geometry.vertices[i].y += this.step * cos(this.direction)
    //this.mesh.geometry.vertices[i].z += this.step * sin(this.direction)
    //} else {
    //var prev = this.mesh.geometry.vertices[i - 1]
    //var curr = this.mesh.geometry.vertices[i]
    //var angle = Math.atan2(prev.y - curr.y, prev.x - curr.x)

    //this.mesh.geometry.vertices[i].y = prev.y + this.step * cos(angle)
    //this.mesh.geometry.vertices[i].z = prev.z + this.step * sin(angle)
    //}

    //this.mesh.geometry.vertices[i + 1].y = this.mesh.geometry.vertices[i].y
    //this.mesh.geometry.vertices[i + 1].z = this.mesh.geometry.vertices[i].z
    //}
    //this.direction += this.speed
    //this.r =
    //this.orig_r *
    //map(perlin.noise(this.direction / TWOPI / 8, 0, 0), -1, 1, 0, 1)
    this.mesh.geometry.verticesNeedUpdate = true
  }
}
//
//
//

var rib
var controls, perlin
function main() {
  perlin = new ImprovedNoise()

  controls = new OrbitControls(camera, renderer.domElement)

  rib = new Ribbon(1, 2, 8)
  window.rib = rib
  scene.add(rib.mesh)

  renderer.render(scene, camera)

  animate()
}
main()

function animate() {
  requestAnimationFrame(animate)

  rib.animate()

  renderer.render(scene, camera)
}

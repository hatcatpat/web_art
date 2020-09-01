import * as THREE from "../../node_modules/three/build/three.module.js"
window.THREE = THREE
setup({ antialias: true })

import { ImprovedNoise } from "../../node_modules/three/examples/jsm/math/ImprovedNoise.js"
import { OrbitControls } from "../../node_modules/three/examples/jsm/controls/OrbitControls.js"

import * as SHADERS from "./shaders.js"

function noise(x, y, z) {
  if (y == null) {
    y = 0
  }
  if (z == null) {
    z = 0
  }

  return map(perlin.noise(x, y, z), -1, 1, 0, 1)
}

//
//
//
class Ribbon {
  constructor(r, h, col, res) {
    this.orig_r = r
    this.h = h
    this.res = res

    this.geometry = new THREE.PlaneGeometry(this.h, this.h, 1, this.res)
    this.material = new THREE.MeshStandardMaterial({
      color: col,
      side: THREE.DoubleSide,
      //wireframe: true,
    })

    //this.uniforms = {
    //u_time: { value: 0.0 },
    //u_dot_res: { value: 0.7 },
    //u_dot_num: { value: 20 },
    //u_res: { value: new Vector2(width, height) },
    //}
    //this.material = new THREE.ShaderMaterial({
    //uniforms: this.uniforms,
    //fragmentShader: SHADERS.frag.dots(),
    //vertexShader: SHADERS.vert.simple(),
    //side: THREE.DoubleSide,
    //})

    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.rotateZ(PI / 2)
    this.mesh.position.y = 1

    //this.mesh.castShadow = true
    //this.mesh.receiveShadow = true

    //this.direction = Math.random() * TWOPI
    this.direction = 0
    this.speed = 0.1 / 5
    this.step = 1
    this.r = this.orig_r

    this.t = 0
    this.dir = 1
    this.dur = 10

    this.pos = []
    for (var i = 0; i < this.mesh.geometry.vertices.length; i += 2) {
      this.mesh.geometry.vertices[i].y = 0
      this.mesh.geometry.vertices[i].z = 0
      this.mesh.geometry.vertices[i + 1].y = this.mesh.geometry.vertices[i].y
      this.mesh.geometry.vertices[i + 1].z = this.mesh.geometry.vertices[i].z
      this.pos.push({ x: 0, y: 0, z: 0 })
    }
    this.mesh.geometry.verticesNeedUpdate = true
  }

  animate() {
    var d = false
    for (var i = 0; i < this.mesh.geometry.vertices.length; i += 2) {
      var perc = i / this.mesh.geometry.vertices.length
      if (i == 0) {
        var y = this.r * cos(this.direction)
        var z = this.r * sin(this.direction)
        this.mesh.geometry.vertices[i].y = y
        this.mesh.geometry.vertices[i].z = z
        //this.r = map(sin(this.direction), -1, 1, 0, 2) * this.orig_r
        this.r = noise(this.direction, this.orig_r, this.t / 100) * this.orig_r

        this.pos.push({ y: y, z: z })
      } else {
        var p = this.pos[this.pos.length - i / 2 - 1]
        this.mesh.geometry.vertices[i].y = p.y
        this.mesh.geometry.vertices[i].z = p.z
      }
      this.mesh.geometry.vertices[i + 1].x =
        this.h * noise(perc, this.orig_r, this.t / 100)
      this.mesh.geometry.vertices[i + 1].y = this.mesh.geometry.vertices[i].y
      this.mesh.geometry.vertices[i + 1].z = this.mesh.geometry.vertices[i].z
    }

    this.pos.splice(0, 1)

    this.direction += this.speed * noise(this.t / 100, 0, 0) * 2 * this.dir
    if (this.t % this.dur == 0) {
      this.dir *= -1
      this.dur = Math.random() * 60
    }

    this.t++

    this.mesh.geometry.verticesNeedUpdate = true
  }
}
//
//
//

var ribs
var controls, perlin
function main() {
  //renderer.shadowMap.enabled = true

  perlin = new ImprovedNoise()
  window.perlin = perlin

  camera.position.y = 10
  camera.position.x = 10

  var amb_light = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(amb_light)

  var point_light = new THREE.PointLight(0xffffff, 0.3)
  point_light.position.set(4, 4, 4)
  //point_light.position.set(0, 4, 0)
  //point_light.castShadow = true
  scene.add(point_light)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.autoRotate = true

  ribs = []
  var num = 16 * 4

  for (var i = 0; i < num; i++) {
    var col = new THREE.Color()
    //"hsl(" + 360 * (i / num) + ",0%,100%)")
    //col.setHSL(i / num, 1, map(i / (num - 1), 0, 1, 0.3, 1))
    col.setHSL((i / (num - 1)) * 0.1 + 0.5, 1, 0.5)
    //console.log(col)
    var h = noise(i / (num - 1), 0, 0) * 2
    //var h = Math.random() * 2
    //var h = map(i / (num - 1), 0, 1, 1, 1)
    ribs.push(new Ribbon(7 * (i / num) + 4, h, col, 120 * 2))
    scene.add(ribs[i].mesh)
  }

  //scene.background = new THREE.Color(0x888888)

  //var sz = 200
  //var bg = new THREE.Mesh(
  //new THREE.PlaneGeometry(sz, sz),
  ////new THREE.BoxGeometry(sz, sz, sz),
  //new THREE.MeshStandardMaterial({ color: 0x000000, side: THREE.DoubleSide })
  //)
  //bg.rotateX(PI / 2)
  //bg.receiveShadow = true
  //scene.add(bg)

  renderer.render(scene, camera)

  animate()
}
main()

function animate() {
  requestAnimationFrame(animate)

  for (var i = 0; i < ribs.length; i++) {
    ribs[i].animate()
  }

  controls.update()

  renderer.render(scene, camera)
}

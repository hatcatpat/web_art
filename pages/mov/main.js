import * as THREE from "../../node_modules/three/build/three.module.js"
window.THREE = THREE
setup()

import * as SHADER from "./shader.js"

import { ImprovedNoise } from "../../node_modules/three/examples/jsm/math/ImprovedNoise.js"

function parafunc(a, b, target) {
  var m = Math.min(width, height) * 0.4

  a *= PI
  b *= TWOPI

  var x = m * sin(a) * cos(b) * map(perlin.noise(a, b, t), -2, 2, -1, 1)
  var y = m * sin(a) * sin(b)
  var z = m * cos(a)

  target.set(x, y, z)
}

var uniforms, plane, perlin, t
function main() {
  perlin = new ImprovedNoise()

  t = 0

  camera = new THREE.OrthographicCamera(
    0,
    width,
    height,
    0,
    -width * height,
    width * height
  )
  camera.position.x -= width / 2
  camera.position.y -= height / 2

  scene.background = new THREE.Color(0x000000)

  uniforms = {
    time: { value: 0 },
    res: { value: new THREE.Vector2(width, height) },
  }

  plane = new THREE.Mesh(
    new THREE.ParametricBufferGeometry(parafunc, 64, 64),
    //new THREE.PlaneGeometry(width, height),
    //new THREE.SphereGeometry(Math.min(width, height) * 0.4, 32, 32),
    new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: SHADER.vert(),
      fragmentShader: SHADER.frag(),
      side: THREE.DoubleSide,
    })
  )
  plane.rotateY(PI / 2)
  plane.rotateZ(PI / 2)
  scene.add(plane)
  window.g = plane.geometry

  renderer.render(scene, camera)
  animate()
}
main()

function animate() {
  requestAnimationFrame(animate)

  t += 0.01
  uniforms.time.value = performance.now() / 1000

  var sp = 0.01
  //plane.rotateX(sp)
  //plane.rotateY(sp)
  //plane.rotateZ(sp)

  //console.log(
  //new THREE.ParametricBufferGeometry(parafunc, 2, 2).attributes.position
  //)
  var arr = new THREE.ParametricBufferGeometry(parafunc, 64, 64).attributes
    .position.array

  plane.geometry.attributes.position.array = arr
  plane.geometry.computeBoundingSphere()
  plane.geometry.attributes.position.needsUpdate = true

  renderer.render(scene, camera)
}

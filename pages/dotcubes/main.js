import * as THREE from "../../node_modules/three/build/three.module.js"
window.THREE = THREE
setup({ antialias: true })

import * as SHADERS from "./shaders.js"

import { ImprovedNoise } from "../../node_modules/three/examples/jsm/math/ImprovedNoise.js"
var perlin

var cubes = []
function addCube(x, y, sz) {
  var cube = new THREE.Mesh(
    new THREE.CubeGeometry(sz, sz, sz),
    new THREE.MeshPhongMaterial({ color: 0xff0000 })
  )
  cube.position.set(x, y, 0)
  input_scene.add(cube)
  cubes.push(cube)
}

var input_tex, input_scene
var uniforms, cube
var light
function main() {
  perlin = new ImprovedNoise()

  camera = new THREE.OrthographicCamera(
    width / -50,
    width / 50,
    height / 50,
    height / -50,
    -50,
    50
  )
  scene.add(camera)

  input_tex = new THREE.WebGLRenderTarget(width, height)
  input_scene = new THREE.Scene()
  input_scene.background = new THREE.Color(1, 1, 1)

  light = new THREE.DirectionalLight(0xffffff, 1)
  var light_target = new THREE.Object3D()
  light_target.position.set(0, 0, 0)
  light.target = light_target
  light.position.set(1, 1, 1)
  input_scene.add(light)

  var ambient = new THREE.AmbientLight(0xffffff, 0.5)
  input_scene.add(ambient)

  var res = 4
  var unit = 20 / res
  for (var i = 0; i < res; i++) {
    for (var j = 0; j < res; j++) {
      addCube((i + 0.5) * unit * 2 - 20, (j + 0.5) * unit * 2 - 20, unit)
    }
  }

  renderer.setRenderTarget(input_tex)
  renderer.render(input_scene, camera)

  var geom = new THREE.PlaneGeometry(100, 100)

  uniforms = {
    u_time: { value: 0.0 },
    u_dot_res: { value: 1.0 },
    u_dot_num: { value: 50 },
    u_res: { value: new Vector2(width, height) },
    u_tex: { value: input_tex.texture },
  }
  window.uniforms = uniforms

  var mat = new THREE.ShaderMaterial({
    uniforms: uniforms,
    fragmentShader: SHADERS.frag.dots(),
  })
  const plane = new THREE.Mesh(geom, mat)
  scene.add(plane)

  renderer.setRenderTarget(null)
  renderer.render(scene, camera)
}
main()

var th = 0
function animate() {
  uniforms.u_time.value = performance.now() / 1000

  for (var i = 0; i < cubes.length; i++) {
    var cube = cubes[i]
    cube.rotation.x = map(perlin.noise(th, 0, -i), 0, TWOPI, -1, 1)
    cube.rotation.y = map(perlin.noise(-i, th, 0), 0, TWOPI, -1, 1)
    cube.rotation.z = map(perlin.noise(0, -i, th), 0, TWOPI, -1, 1)
  }

  th += 0.005
  light.position.set(1 * cos(th * 4.0), 1 * sin(th * 4.0), 1)

  renderer.setRenderTarget(input_tex)
  renderer.render(input_scene, camera)

  renderer.setRenderTarget(null)
  renderer.render(scene, camera)

  requestAnimationFrame(animate)
}
animate()

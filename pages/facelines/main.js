import * as THREE from "../../node_modules/three/build/three.module.js"
window.THREE = THREE
setup({ antialias: true })

import * as SHADERS from "./shaders.js"

import { ImprovedNoise } from "../../node_modules/three/examples/jsm/math/ImprovedNoise.js"
var perlin

var input_tex, input_scene
var uniforms, cube
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

  var light = new THREE.DirectionalLight(0xffffff, 1)
  var light_target = new THREE.Object3D()
  light_target.position.set(0, 0, 0)
  light.target = light_target
  light.position.set(1, 1, 1)
  input_scene.add(light)

  cube = new THREE.Mesh(
    new THREE.CubeGeometry(20, 20, 20),
    new THREE.MeshPhongMaterial({ color: 0x00ff00 })
  )
  input_scene.add(cube)

  var cube2 = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshPhongMaterial({ color: 0xffffff })
  )
  cube2.position.z = -10
  input_scene.add(cube2)

  renderer.setRenderTarget(input_tex)
  renderer.render(input_scene, camera)

  var geom = new THREE.PlaneGeometry(100, 100)

  uniforms = {
    u_time: { value: 0.0 },
    u_dot_res: { value: 3.0 },
    u_dot_num: { value: 50 },
    u_res: { value: new Vector2(width, height) },
    u_tex: { value: input_tex.texture },
  }

  var mat = new THREE.ShaderMaterial({
    uniforms: uniforms,
    fragmentShader: SHADERS.frag.dots(),
  })
  //var mat = new THREE.MeshBasicMaterial({ map: input_tex.texture })
  const plane = new THREE.Mesh(geom, mat)
  scene.add(plane)

  renderer.setRenderTarget(null)
  renderer.render(scene, camera)
}
main()

function animate() {
  uniforms.u_time.value = performance.now() / 1000

  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
  cube.rotation.z += 0.02

  renderer.setRenderTarget(input_tex)
  renderer.render(input_scene, camera)

  renderer.setRenderTarget(null)
  renderer.render(scene, camera)

  requestAnimationFrame(animate)
}
animate()

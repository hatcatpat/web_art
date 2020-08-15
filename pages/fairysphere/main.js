import * as THREE from "../../node_modules/three/build/three.module.js"
window.THREE = THREE
setup({ antialias: true })

import * as SHADERS from "./shaders.js"

import { OrbitControls } from "../../node_modules/three/examples/jsm/controls/OrbitControls.js"

import { ImprovedNoise } from "../../node_modules/three/examples/jsm/math/ImprovedNoise.js"
var perlin

var input_tex, input_scene
var uniforms, shape, geom
var light, light2
var controls
function input() {
  input_tex = new THREE.WebGLRenderTarget(width, height)
  input_scene = new THREE.Scene()

  input_scene.background = new THREE.CubeTextureLoader()
    .setPath("cubemap/")
    .load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"])

  light = new THREE.DirectionalLight(0x00ff00, 1.0)
  var light_target = new THREE.Object3D()
  light_target.position.set(0, 0, 0)
  light.target = light_target
  light.position.set(2, 2, 2)
  input_scene.add(light)

  light2 = new THREE.DirectionalLight(0x0000ff, 1.0)
  var light_target2 = new THREE.Object3D()
  light2.target = light_target
  light2.position.set(0, 0, 0)
  input_scene.add(light2)
  console.log(light2)

  var ambient = new THREE.AmbientLight(0xffffff, 2.0)
  input_scene.add(ambient)

  geom = new THREE.SphereGeometry(1, 64, 64)

  var mat = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    shininess: 1,
    envMap: input_scene.background,
  })

  shape = new THREE.Mesh(geom, mat)
  input_scene.add(shape)

  renderer.render(input_scene, camera)
}
function output() {
  scene.background = new THREE.Color(0)

  uniforms = {
    u_time: { value: 0.0 },
    u_dot_res: { value: 1 },
    u_dot_num: { value: 100 },
    u_res: { value: new Vector2(width, height) },
    u_tex: { value: input_tex.texture },
  }
  window.uniforms = uniforms

  var shader_mat = new THREE.ShaderMaterial({
    uniforms: uniforms,
    fragmentShader: SHADERS.frag.dots(),
  })
  const plane = new THREE.Mesh(geom, shader_mat)
  scene.add(plane)

  renderer.setRenderTarget(null)
  renderer.render(scene, camera)
}

var bg_tex, bg_scene
function main() {
  perlin = new ImprovedNoise()

  //controls = new OrbitControls(camera, renderer.domElement)

  camera.lookAt(0, 0, 0)
  camera.zoom = 1.2
  camera.updateProjectionMatrix()

  input()
  output()

  bg_tex = new THREE.WebGLRenderTarget(width, height)
  bg_scene = new THREE.Scene()

  var sz = 4
  var pmat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    envMap: input_scene.background,
    side: THREE.DoubleSide,
  })
  var plane = new THREE.Mesh(new THREE.BoxGeometry(sz, sz, sz), pmat)
  bg_scene.add(plane)

  renderer.setRenderTarget(bg_tex)
  renderer.render(bg_scene, camera)

  scene.background = bg_tex.texture
}
main()

var psi = 0
var th = 0
function animate() {
  uniforms.u_time.value = performance.now() / 1000

  var r = 2
  camera.position.set(
    r * sin(th) * cos(psi),
    r * sin(th) * sin(psi),
    r * cos(th)
  )
  camera.lookAt(0, 0, 0)

  light.position.set(
    r * sin(th - PI / 4) * cos(psi),
    r * sin(th - PI / 4) * sin(psi),
    r * cos(th - PI / 4)
  )
  light2.position.set(
    r * sin(th + PI / 4) * cos(psi),
    r * sin(th + PI / 4) * sin(psi),
    r * cos(th + PI / 4)
  )
  light2.updateMatrix()

  //shape.rotation.x = map(perlin.noise(th, 0, 0), 0, TWOPI, -1, 1)
  //shape.rotation.y = map(perlin.noise(0, th, 0), 0, TWOPI, -1, 1)
  //shape.rotation.z = map(perlin.noise(0, 0, th), 0, TWOPI, -1, 1)

  th += 0.005 * 2

  renderer.setRenderTarget(input_tex)
  renderer.render(input_scene, camera)

  renderer.setRenderTarget(bg_tex)
  renderer.render(bg_scene, camera)

  renderer.setRenderTarget(null)
  renderer.render(scene, camera)

  requestAnimationFrame(animate)
}
animate()

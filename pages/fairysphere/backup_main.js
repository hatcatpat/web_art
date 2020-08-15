import * as THREE from "../../node_modules/three/build/three.module.js"
window.THREE = THREE
setup({ antialias: true })

import * as SHADERS from "./shaders.js"

import { OrbitControls } from "../../node_modules/three/examples/jsm/controls/OrbitControls.js"

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
var uniforms, shape
var light
var controls
function main() {
  perlin = new ImprovedNoise()

  controls = new OrbitControls(camera, renderer.domElement)

  var out_camera = new THREE.OrthographicCamera(
    width / -50,
    width / 50,
    height / 50,
    height / -50,
    -50,
    50
  )
  scene.add(out_camera)

  input_tex = new THREE.WebGLRenderTarget(width, height)
  input_scene = new THREE.Scene()
  //input_scene.background = new THREE.Color(1, 1, 1)

  input_scene.background = new THREE.CubeTextureLoader()
    .setPath("cubemap/")
    .load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"])

  light = new THREE.DirectionalLight(0xffffff, 0.6)
  var light_target = new THREE.Object3D()
  light_target.position.set(0, 0, 0)
  light.target = light_target
  light.position.set(2, 2, 2)
  input_scene.add(light)

  var ambient = new THREE.AmbientLight(0xffffff, 5)
  input_scene.add(ambient)

  var geom = new THREE.SphereGeometry(10, 12, 12)

  //for (var i = 0; i < geom.faces.length; i++) {
  //var c = new THREE.Color(0xffffff)
  //c.setRGB(0, 0, i / geom.faces.length + 0.2)
  //geom.faces[i].vertexColors[0] = c
  //geom.faces[i].vertexColors[1] = c
  //geom.faces[i].vertexColors[2] = c
  //}

  //var mat = new THREE.MeshPhongMaterial({
  //color: 0xffffff,
  //shininess: 0,
  //envMap: input_scene.background,
  //vertexColors: THREE.VertexColors,
  //})

  var mat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    envMap: input_scene.background,
  })

  shape = new THREE.Mesh(geom, mat)
  input_scene.add(shape)

  renderer.setRenderTarget(input_tex)
  renderer.render(input_scene, camera)

  var geom = new THREE.PlaneGeometry(100, 100)

  uniforms = {
    u_time: { value: 0.0 },
    u_dot_res: { value: 3.0 },
    //u_dot_res: { value: 100.0 },
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

  shape.rotation.x = map(perlin.noise(th, 0, 0), 0, TWOPI, -1, 1)
  shape.rotation.y = map(perlin.noise(0, th, 0), 0, TWOPI, -1, 1)
  shape.rotation.z = map(perlin.noise(0, 0, th), 0, TWOPI, -1, 1)

  th += 0.005 * 2

  renderer.setRenderTarget(input_tex)
  renderer.render(input_scene, camera)

  renderer.setRenderTarget(null)
  renderer.render(scene, camera)

  requestAnimationFrame(animate)
}
animate()

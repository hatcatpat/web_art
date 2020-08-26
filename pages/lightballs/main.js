import * as THREE from "../../node_modules/three/build/three.module.js"
window.THREE = THREE
setup()

import * as DAT from "../../node_modules/dat.gui/build/dat.gui.module.js"
const gui = new DAT.GUI()
window.gui = gui

document.addEventListener("keydown", onDocumentKeyDown, false)
function onDocumentKeyDown(event) {
  if (event.key == "q") {
    gui.hide()
  } else if (event.key == "Q") {
    gui.show()
  }
}

var gui_obj = {
  res: 10,
}
gui
  .add(gui_obj, "res")
  .min(2)
  .max(300)
  .step(1)
  .onChange(function (newValue) {
    console.log("res changed to:  ", newValue)
    res = newValue
    setup()
    main()
  })

import { EffectComposer } from "../../node_modules/three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "../../node_modules/three/examples/jsm/postprocessing/RenderPass.js"
import { UnrealBloomPass } from "../../node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js"

var composer, renderpass
function init() {
  // renderer
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  // scene
  scene.background = new THREE.Color(0x000000)

  // camera
  camera.position.z = 0.8

  // composer
  var renderScene = new RenderPass(scene, camera)
  var bloomPass = new UnrealBloomPass(
    new THREE.Vector2(width, height),
    1.5,
    0.4,
    0.85
  )
  bloomPass.threshold = 0.5
  bloomPass.strength = 1.5
  bloomPass.radius = 0
  window.bloomPass = bloomPass

  composer = new EffectComposer(renderer)
  composer.addPass(renderScene)
  composer.addPass(bloomPass)
}

var res = 10
var R, P, unit, w, h, X, Y, dummy, circles, light_circles
var light1, light2
function main() {
  init()

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(6, 4),
    new THREE.MeshPhongMaterial({ shininess: 1 })
  )
  plane.receiveShadow = true
  plane.position.z = -1
  scene.add(plane)

  const intensity = 1
  const dist = 0
  //const angle = Math.PI/8
  const angle = 0.1
  const penum = 0
  const decay = 1

  //var light = new THREE.AmbientLight( 0xffffff, 0.1 )
  //scene.add(light)

  light1 = new THREE.SpotLight(0xfffffff, intensity, dist, angle, penum, decay)
  light1.position.set(-4, 0, 4)
  light1.target.position.set(0, 0, 0)
  light1.castShadow = true
  light1.shadow.mapSize.width = 512 * 4
  light1.shadow.mapSize.height = 512 * 4
  scene.add(light1)

  light2 = new THREE.SpotLight(0xffffff, intensity, dist, angle, penum, decay)
  light2.position.set(4, 0, 4)
  light2.target.position.set(0, 0, 0)
  light2.castShadow = true
  light2.shadow.mapSize.width = 512 * 4
  light2.shadow.mapSize.height = 512 * 4
  scene.add(light2)

  w = 0.9
  //w = 1
  unit = w / res

  var mat = new THREE.MeshPhongMaterial({ color: 0x111111, shininess: 1 })
  const geom = new THREE.SphereGeometry(unit * 0.5 * 0.5, 6, 6)

  circles = new THREE.InstancedMesh(
    new THREE.BufferGeometry().fromGeometry(geom),
    mat,
    Math.floor((res * res) / 2)
  )
  circles.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  circles.receiveShadow = true
  circles.castShadow = true
  window.circles = circles
  scene.add(circles)

  mat = new THREE.MeshPhongMaterial({ color: 0xaaaaaa, shininess: 0 })
  light_circles = new THREE.InstancedMesh(
    new THREE.BufferGeometry().fromGeometry(geom),
    mat,
    Math.floor((res * res) / 2)
  )
  light_circles.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  light_circles.receiveShadow = true
  light_circles.castShadow = true
  scene.add(light_circles)

  dummy = new THREE.Object3D()
  var k = 0
  R = new Array(res)
  P = new Array(res)
  for (var i = 0; i < res; i++) {
    R[i] = new Array(res)
    P[i] = new Array(res)
    for (var j = 0; j < res; j++) {
      R[i][j] = Math.random() * 2
      P[i][j] = map(Math.random(), -0.1, 0.1, 0, 1)
      //updateDummy(i,j,k)

      if (i % 2 == 0) {
        updateDummy(i, j, k, 0)
      } else {
        updateDummy(i, j, k, 1)
      }

      k++
    }
  }

  renderer.render(scene, camera)
}
main()

function updateDummy(i, j, k, mesh) {
  //const r = R[i][j] * map( Math.sin( ((i+1)*(j+1))+performance.now()/200), 0.5,4, -1,1)
  const mod = map(Math.sin(i + j + performance.now() / 200), 0.5, 4, -1, 1)
  const r = R[i][j] * mod
  const x = unit * (i + 0.5) - w / 2
  const y = unit * (j + 0.5) - w / 2
  //const z = P[i][j] * map( Math.sin(i+performance.now()/500), 0.5,2, -1,1)
  const dist = Math.sqrt(x * x + y * y)
  const z =
    P[i][j] * map(Math.sin(i + performance.now() / 500), 0.5, dist * 3, -1, 1)

  dummy.position.set(x, y, z)
  dummy.scale.set(r, r, r)
  dummy.updateMatrix()

  //mesh.setMatrixAt(k, dummy.matrix)
  if (mesh == 0) {
    circles.setMatrixAt(k, dummy.matrix)
  } else {
    light_circles.setMatrixAt(k % Math.floor((res * res) / 2), dummy.matrix)
  }
}

function animate() {
  requestAnimationFrame(animate)

  var k = 0
  for (var i = 0; i < res; i++) {
    for (var j = 0; j < res; j++) {
      updateDummy(i, j, k, k < Math.floor((res * res) / 2) ? 0 : 1)
      k++
    }
  }
  circles.instanceMatrix.needsUpdate = true
  light_circles.instanceMatrix.needsUpdate = true

  renderer.render(scene, camera)
  composer.render()
}
animate()

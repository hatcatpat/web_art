import * as THREE from "../../node_modules/three/build/three.module.js"
window.THREE = THREE
setup()

import { OrbitControls } from "../../node_modules/three/examples/jsm/controls/OrbitControls.js"
var controls

import { ImprovedNoise } from "../../node_modules/three/examples/jsm/math/ImprovedNoise.js"
var perlin

function generateTerrain(w, h) {
  var data = new Array(w * h)

  var k = 0
  for (var i = 0; i < w; i++) {
    for (var j = 0; j < h; j++) {
      data[k] = perlin.noise(i / w, j / h)
      k++
    }
  }

  return data
}

var plane, light
function main() {
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  controls = new OrbitControls(camera, renderer.domElement)

  perlin = new ImprovedNoise()

  light = new THREE.DirectionalLight(0xffff00, 2)
  var light_target = new THREE.Object3D()
  light_target.position.set(0, 0, 0)
  light.target = light_target
  light.shadow.mapSize.width = 512 * 1
  light.shadow.mapSize.height = 512 * 1
  light.position.set(2, 2, 2)
  light.castShadow = true
  scene.add(light)
  scene.add(light_target)

  scene.add(new THREE.DirectionalLightHelper(light, 1, 0x00ff00))

  //

  var geometry = new THREE.PlaneBufferGeometry(1, 1, 100, 100)
  var data = generateTerrain(100, 100)
  var vertices = geometry.attributes.position.array

  console.log(vertices.length == data.length)

  for (var i = 0; i < vertices.length; i += 3) {
    if (i < 100 * 3 * 99) {
      vertices[i + 2] = rand(0, 1)
    }
    //vertices[i + 2] = data[i / 3]
  }
  //for (var i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
  //vertices[j + 2] = data[i] * 10
  //}

  var mat = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    morphTargets: true,
    side: THREE.DoubleSide,
  })

  plane = new THREE.Mesh(geometry, mat)
  window.plane = plane
  scene.add(plane)

  plane.receiveShadow = true
  plane.castShadow = true

  renderer.render(scene, camera)
}
main()

var current_target = 0
var warp_dur = 60
var t = 0
function impulse() {
  //plane.morphTargetInfluences[current_target] = lerp(0, 1, t / warp_dur)
  plane.morphTargetInfluences[current_target] = map(
    sin((t / warp_dur) * TWOPI),
    0,
    1,
    -1,
    1
  )
}

function getRandomTarget() {
  plane.morphTargetInfluences[current_target] = 0
  current_target = randint(0, plane.morphTargetInfluences.length - 1)
}

function animate() {
  requestAnimationFrame(animate)

  controls.update()

  //impulse()

  //t++
  //if (t > warp_dur) {
  //t = 0
  //getRandomTarget()
  //}

  renderer.render(scene, camera)
}
animate()

import * as THREE from "../../node_modules/three/build/three.module.js"
window.THREE = THREE
setup({ antialias: true })

import { ImprovedNoise } from "../../node_modules/three/examples/jsm/math/ImprovedNoise.js"
var perlin

import * as SHADERS from "../../utils/General/shaders.js"

var squares, dummy, num, shadows, shadow_depth, uniforms
function main() {
  const color = 0xaa0000
  const near = 1
  const far = 0
  scene.fog = new THREE.Fog(color, near, far)

  perlin = new ImprovedNoise()

  var sc = 0.6
  camera = new THREE.OrthographicCamera(
    0,
    width / sc,
    height / sc,
    0,
    -width * height,
    width * height
  )
  camera.position.x = -width / 2 / sc
  camera.position.y = -height / 2 / sc

  var res = 64 / 2
  num = res * 8
  var sz = Math.min(width, height) / res
  //var geom = new THREE.PlaneGeometry(sz, sz)
  var geom = new THREE.CircleGeometry(sz, 32, 32)
  var mat = new THREE.MeshBasicMaterial({ color: 0x000000, fog: true })

  squares = new THREE.InstancedMesh(geom, mat, num)
  scene.add(squares)

  var c = 0.9
  mat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(c, c, c),
    fog: false,
  })
  shadows = new THREE.InstancedMesh(geom, mat, num)
  shadow_depth = new THREE.Vector2(1.3, 1.3)
  scene.add(shadows)

  dummy = new THREE.Object3D()

  renderer.render(scene, camera)
  animate()
}
main()

function noise(x, y, z) {
  return map(perlin.noise(x, y, z), -1, 1, -1, 1)
}

function trail(i) {
  return {
    x:
      width *
      cos((i / num) * TWOPI * noise(t, t, i / num + 100) * 8) *
      noise(i / num, t, t),
    y:
      height *
      cos((i / num) * TWOPI * noise(i / num + 100, t, t) * 8 + PI / 2) *
      noise(t, t, i / num),
  }
}

var t = 0
function animate() {
  requestAnimationFrame(animate)

  t += 0.01 / 4

  for (var i = 0; i < num; i++) {
    var p = trail(i + 1)
    dummy.position.x = p.x
    dummy.position.y = p.y
    //dummy.position.z = -(i + 1) / num
    dummy.position.z = (sin(t * 4 + (i / num) * PI) - 1) / 2
    dummy.updateMatrix()
    squares.setMatrixAt(i, dummy.matrix)

    dummy.position.x = p.x * shadow_depth.x
    dummy.position.y = p.y * shadow_depth.y
    dummy.position.z = -((i + 1) / num) - 2
    dummy.updateMatrix()
    shadows.setMatrixAt(i, dummy.matrix)
  }
  squares.instanceMatrix.needsUpdate = true
  shadows.instanceMatrix.needsUpdate = true

  renderer.render(scene, camera)
}

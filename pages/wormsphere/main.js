import * as THREE from "../../node_modules/three/build/three.module.js"
window.THREE = THREE

import { OrbitControls } from "../../node_modules/three/examples/jsm/controls/OrbitControls.js"

setup({ antialias: true })
//
//
//
function generateWormArray() {
  var arr = []
  var theta_unit = PI / res
  var psi_unit = TWOPI / res

  var r = 0.05
  var p = new Vector3(0, 0, 0)
  var th = rand(0, PI)
  var psi = rand(0, TWOPI)
  var osp = { th: rand(0.01, 0.3), psi: rand(0.01, 0.3) }
  var sp = { th: osp.th, psi: osp.psi }
  arr.push(p)
  for (var i = 0; i < res; i++) {
    p.x += r * sin(th) * cos(psi)
    p.y += r * sin(th) * sin(psi)
    p.z += r * cos(th)
    arr.push(new Vector3(p.x, p.y, p.z))

    th += sp.th
    psi += sp.psi

    //sp.th = osp.th * rand(0, 2)
    //sp.psi = osp.psi * rand(0, 2)

    sp.th = map(sin(PI * (i / res)), 0, osp.th, -1, 1)
    sp.psi = map(cos(TWOPI * (i / res)), 0, osp.psi, -1, 1)
  }

  return arr
}

function generateWorm(arr) {
  return new THREE.CatmullRomCurve3(arr, true, "chordal")
}

var res = 500
var controls
var tube, tube_arr, orig_arr
const seg = 64 * 4,
  rseg = 8 * 4,
  closed = true
var radius = 0.03

function main() {
  var light = new THREE.PointLight(0xffffff, 1)
  light.position.set(2, 2, 2)
  scene.add(light)

  var light2 = new THREE.PointLight(0xfffffff, 1)
  light2.position.set(-2, -2, -2)
  scene.add(light2)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.autoRotate = true
  window.controls = controls

  const arr = generateWormArray()
  const curve = generateWorm(arr)
  tube_arr = arr
  orig_arr = arr

  tube = new THREE.Mesh(
    new THREE.TubeBufferGeometry(curve, seg, radius, rseg, closed),
    new THREE.MeshPhongMaterial({ color: 0xff0000 })
  )
  scene.add(tube)
  window.tube = tube

  setRandomWarpTarget()

  //const cube = new THREE.Mesh(
  //new THREE.CubeGeometry(1, 1, 1),
  //new THREE.MeshPhongMaterial(0xff0000)
  //)
  //scene.add(cube)

  renderer.render(scene, camera)

  requestAnimationFrame(animate)
}
main()

function warp() {
  var r = 1 / 60
  var th = rand(0, PI)
  var psi = rand(0, TWOPI)

  var osp = { th: 0.4, psi: 0.2 }
  var sp = { th: osp.th, psi: osp.psi }
  for (var i = 0; i < tube_arr.length; i++) {
    var p = tube_arr[i]
    p.x += r * sin(th) * cos(psi)
    p.y += r * sin(th) * sin(psi)
    p.z += r * cos(th)

    th += sp.th
    psi += sp.psi

    sp.th = osp.th * rand(-2, 2)
    sp.psi = osp.psi * rand(-2, 2)

    tube_arr[i] = p
  }
  var new_curve = new THREE.CatmullRomCurve3(tube_arr, true, "chordal")
  var new_tube = new THREE.TubeBufferGeometry(
    new_curve,
    seg,
    radius,
    rseg,
    closed
  )
  tube.geometry.attributes.position.array = new_tube.attributes.position.array
  tube.geometry.attributes.position.needsUpdate = true
  tube.updateMatrix()
}

var target_arr
function setRandomWarpTarget() {
  orig_arr = tube_arr
  target_arr = generateWormArray()
}

var warp_dur = 60
var t = 0
function warpToTarget() {
  for (var i = 0; i < tube_arr.length; i++) {
    var p = tube_arr[i]
    p.x = lerp(orig_arr[i].x, target_arr[i].x, t / warp_dur)
    p.y = lerp(orig_arr[i].y, target_arr[i].y, t / warp_dur)
    p.z = lerp(orig_arr[i].z, target_arr[i].z, t / warp_dur)

    tube_arr[i] = p
  }
  var new_curve = new THREE.CatmullRomCurve3(tube_arr, true, "chordal")
  var new_tube = new THREE.TubeBufferGeometry(
    new_curve,
    seg,
    radius,
    rseg,
    closed
  )
  tube.geometry.attributes.position.array = new_tube.attributes.position.array
  tube.geometry.attributes.position.needsUpdate = true
  tube.updateMatrix()

  t++
  if (t >= warp_dur) {
    setRandomWarpTarget()
    t = 0
  }
}

function getCenter() {
  var mean = new Vector3(0, 0, 0)
  for (var i = 0; i < tube_arr.length; i++) {
    mean.add(tube_arr[i])
  }
  mean.divideScalar(tube_arr.length)

  controls.target = mean
}

function animate() {
  controls.update()

  warpToTarget()
  getCenter()

  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

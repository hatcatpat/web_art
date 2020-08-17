import * as THREE from "../../node_modules/three/build/three.module.js"
window.THREE = THREE
setup()

import { OrbitControls } from "../../node_modules/three/examples/jsm/controls/OrbitControls.js"

function makeRing(y, h, r) {
  var th_unit = TWOPI / res
  var arr = new Array(res)

  y = num - y
  y *= h

  for (var i = 0; i < res; i++) {
    arr[i] = new THREE.Vector3(r * cos(i * th_unit), y, r * sin(i * th_unit))
  }

  return arr
}

function copyVec3(vec) {
  return new THREE.Vector3(vec.x, vec.y, vec.z)
}

function faceNorm(vertices) {
  var Q = copyVec3(vertices[0])
  var R = copyVec3(vertices[1])
  var S = copyVec3(vertices[2])

  var QR = R.sub(Q)
  var QS = S.sub(Q)

  return QR.cross(QS).normalize()
}

function connectRings(bot_ring, top_ring, h) {
  var vertices = []
  var faces = []
  vertices = vertices.concat(bot_ring)
  vertices = vertices.concat(top_ring)

  var len = bot_ring.length
  for (var i = 0; i < len - 1; i += 1) {
    var I = i + h
    // triangle 1
    var norm = faceNorm([bot_ring[i], bot_ring[i + 1], top_ring[i]])
    faces = faces.concat(new THREE.Face3(I, I + 1, len + I, norm.negate()))
    // triangle 2
    //norm = faceNorm([top_ring[i], bot_ring[i], top_ring[i + 1]])
    faces = faces.concat(new THREE.Face3(len + I, len + I + 1, I + 1, norm))
  }

  // last 2 triangles
  faces = faces.concat(new THREE.Face3(h + len - 1, h + 0, h + 2 * len - 1))
  faces = faces.concat(new THREE.Face3(h + 2 * len - 1, h + 0, h + len))

  return { vertices: vertices, faces: faces }
}

var res = 16,
  num = 10
function addPillar() {
  var vertices = []
  var faces = []

  var prev_ring = []
  var prev_r = 0.0
  var h = rand(0.1, 1)
  for (var i = 0; i < num; i++) {
    var r = map(i / num, 0.1, 1, 0, 1)
    var bot_ring = makeRing(i, h, prev_r)
    var top_ring = makeRing(i + 1, h, r)
    if (i == 0) {
      var layer = connectRings(bot_ring, top_ring, vertices.length)
    } else {
      var layer = connectRings(prev_ring, bot_ring, vertices.length)
      vertices = vertices.concat(layer.vertices)
      faces = faces.concat(layer.faces)
      layer = connectRings(bot_ring, top_ring, vertices.length)
    }
    prev_r = r
    prev_ring = top_ring
    vertices = vertices.concat(layer.vertices)
    faces = faces.concat(layer.faces)
  }

  var geometry = new THREE.Geometry()
  geometry.vertices = vertices
  geometry.faces = faces
  geometry.computeBoundingSphere()
  geometry.computeFaceNormals()
  geometry.computeVertexNormals()

  //var material = new THREE.MeshBasicMaterial({
  //color: 0x00ff00,
  //wireframe: true,
  //side: THREE.DoubleSide,
  //})

  var material = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    //side: THREE.FrontSide,
    side: THREE.DoubleSide,
  })

  var mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  return mesh
}

var controls, lights
function main() {
  controls = new OrbitControls(camera, renderer.domElement)
  camera.position.set(2, 2, 2)

  lights = {
    point: new THREE.PointLight(0xffffff, 1),
    ambient: new THREE.AmbientLight(0xffffff, 0),
  }
  lights.point.position.set(2, 2, 2)
  scene.add(lights.point)
  scene.add(lights.ambient)

  var plane = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshPhongMaterial({ color: 0x00ff00 })
  )
  plane.rotateX((3 * PI) / 2)
  scene.add(plane)

  var pillars = []
  for (var i = 0; i < 4; i++) {
    var m = addPillar()
    m.position.x = rand(-2, 2)
    m.position.z = rand(-2, 2)
    pillars.push(m)
  }

  renderer.render(scene, camera)
}
main()

function animate() {
  requestAnimationFrame(animate)

  controls.update()

  renderer.render(scene, camera)
}
animate()

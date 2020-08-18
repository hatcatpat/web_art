import * as THREE from "../../node_modules/three/build/three.module.js"
window.THREE = THREE
setup({ antialias: true })

import * as SHADERS from "./shaders.js"

import { OrbitControls } from "../../node_modules/three/examples/jsm/controls/OrbitControls.js"

import { ImprovedNoise } from "../../node_modules/three/examples/jsm/math/ImprovedNoise.js"
var perlin

function makeRing(y, h, r) {
  var th_unit = TWOPI / res
  var arr = new Array(res)

  y /= num
  y = 1 - y
  y *= h * 10

  for (var i = 0; i < res; i++) {
    var R = r * map(perlin.noise(i, y, currentPillar * 100), 0.5, 2, -1, 1)
    arr[i] = new THREE.Vector3(R * cos(i * th_unit), y, R * sin(i * th_unit))
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
    faces = faces.concat(new THREE.Face3(len + I, I, len + I + 1))
    // triangle 2
    faces = faces.concat(new THREE.Face3(I, I + 1, len + I + 1))
  }

  // last 2 triangles
  faces = faces.concat(new THREE.Face3(h + len - 1, h + 0, h + 2 * len - 1))
  faces = faces.concat(new THREE.Face3(h + 2 * len - 1, h + 0, h + len))

  return { vertices: vertices, faces: faces }
}

function makeMorphTarget(geometry) {
  var i = 0
  var vertices = []
  for (var v = 0; v < geometry.vertices.length; v++) {
    vertices.push(geometry.vertices[v].clone())
    if (v == i) {
      vertices[vertices.length - 1].x *= 2
      vertices[vertices.length - 1].z *= 2
    }
  }
  geometry.morphTargets.push({ name: "target" + i, vertices: vertices })
}

var res = randint(4, 16),
  num = randint(10, 1000)
function pillarGeom() {
  var vertices = []
  var faces = []

  var prev_ring = []
  var prev_r = 0.0
  //var h = rand(0.5, 3)
  var h = 2
  var r_lo = 0.0
  var r_hi = rand(1, 6)
  for (var i = 0; i < num; i++) {
    var r = map(i / num, r_lo, r_hi, 0, 1)
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

  var buffer_geometry = new THREE.BufferGeometry().fromGeometry(geometry)
  buffer_geometry.computeBoundingSphere()
  buffer_geometry.computeFaceNormals()
  buffer_geometry.computeVertexNormals()

  return buffer_geometry
}

function addPillar() {
  var material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    shininess: 0.0,
    //bumpMap: pillarTex.texture,
    //map: pillarTex.texture,
  })

  var mesh = new THREE.Mesh(pillarGeom(), material)
  mesh.receiveShadow = true
  mesh.castShadow = true
  scene.add(mesh)

  return mesh
}

var controls, lights, pillars
var currentPillar = 0
var uniforms, pillarTex, pillarTexScene, pillarCamera
function main() {
  scene.background = new THREE.Color(0x555555)

  renderer.shadowMap.enabled = true
  perlin = new ImprovedNoise()

  camera.position.set(14, 8, 14)
  camera.lookAt(0, 8, 0)
  camera.updateProjectionMatrix()
  //controls = new OrbitControls(camera, renderer.domElement)

  lights = {
    point: new THREE.PointLight(0xffffff, 0.2),
    point2: new THREE.PointLight(0xffffff, 0.2),
    point3: new THREE.PointLight(0xffffff, 0.2),
    ambient: new THREE.AmbientLight(0xffffff, 0.6),
  }
  lights.point.castShadow = true
  lights.point.position.set(4, 4, 4)
  scene.add(lights.point)
  lights.point2.castShadow = true
  lights.point2.position.set(-4, 4, 4)
  scene.add(lights.point2)
  lights.point3.position.set(16, 8, 16)
  scene.add(lights.point3)

  scene.add(lights.ambient)
  window.lights = lights

  // pillars
  //

  //pillarTex = new THREE.WebGLRenderTarget(width, height)
  //pillarTexScene = new THREE.Scene()

  //var pillarWidth = 1
  //var pillarHeight = 1
  //pillarCamera = new THREE.OrthographicCamera(
  //0,
  //pillarWidth,
  //pillarHeight,
  //0,
  //0,
  //1
  //)
  //pillarCamera.position.set(-pillarWidth / 2, -pillarHeight / 2, 0)
  //pillarTexScene.add(pillarCamera)

  //uniforms = {
  //u_time: { value: 0.0 },
  //u_res: { value: new Vector2(pillarWidth, pillarHeight) },
  //}
  //var plane = new THREE.Mesh(
  //new THREE.PlaneGeometry(100, 100),
  //new THREE.ShaderMaterial({
  //uniforms: uniforms,
  //fragmentShader: SHADERS.bumpMap(),
  //})
  //)
  //pillarTexScene.add(plane)
  //renderer.setRenderTarget(pillarTex)
  //renderer.render(pillarTexScene, pillarCamera)
  //renderer.setRenderTarget(null)

  pillars = [addPillar()]
  window.pillars = pillars

  var plane = new THREE.Mesh(
    new THREE.PlaneGeometry(500, 500),
    new THREE.MeshPhongMaterial({
      color: 0xaaaaaa,
      shininess: 0,
    })
  )
  plane.receiveShadow = true
  plane.rotateX((3 * PI) / 2)
  scene.add(plane)

  renderer.render(scene, camera)
}
main()

var th = 0,
  r = 4
function animate() {
  requestAnimationFrame(animate)

  //uniforms.u_time.value += 0.1

  //controls.update()

  //lights.point.position.set(r * cos(th), r, r * sin(th))
  //lights.point2.position.set(r * cos(th + PI / 2), r, r * sin(th + PI / 2))

  th += 0.01

  //renderer.setRenderTarget(pillarTex)
  //renderer.render(pillarTexScene, pillarCamera)

  //renderer.setRenderTarget(null)
  renderer.render(scene, camera)
}
animate()

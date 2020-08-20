import * as THREE from "../../node_modules/three/build/three.module.js"
window.THREE = THREE
setup({ antialias: true })

function blockGeometry(w, h) {
  var geom = new THREE.Geometry()

  geom.vertices.push(
    //new THREE.Vector3(0, h + 1, 1),
    new THREE.Vector3(0, h, 2),
    new THREE.Vector3(1, h, 0),
    new THREE.Vector3(1, -h, 0),
    //new THREE.Vector3(0, -h - 1, 1),
    new THREE.Vector3(0, -h, 2),
    new THREE.Vector3(-1, -h, 0),
    new THREE.Vector3(-1, h, 0),
    //new THREE.Vector3(0, h + 1, 1)
    new THREE.Vector3(0, h, 2)
  )

  geom.faces.push(
    new THREE.Face3(3, 1, 0),
    new THREE.Face3(3, 2, 1),
    new THREE.Face3(3, 0, 5),
    new THREE.Face3(3, 5, 4)
  )

  geom.computeBoundingSphere()
  geom.computeFaceNormals()
  geom.computeVertexNormals()

  return geom
}

function addBlock(x, y, w, h, orientation) {
  var mat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 0.3,
  })

  var mesh = new THREE.Mesh(blockGeometry(w, h), mat)
  mesh.castShadow = true
  mesh.receiveShadow = true

  mesh.rotateZ((orientation * PI) / 2)
  mesh.position.x = x
  mesh.position.y = y

  scene.add(mesh)
}

var lights
function setupLights() {
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  //var ambient = new THREE.AmbientLight(0xffffff, 0.0)
  //scene.add(ambient)

  var point = new THREE.PointLight(0xffffff, 0.5)
  point.position.set(0, 0, 8)
  point.castShadow = true
  var sz = 512 * 4
  point.shadow.mapSize.x = sz
  point.shadow.mapSize.y = sz
  point.shadow.camera.near = 0
  point.shadow.camera.far = 16
  scene.add(point)

  //lights = { ambient: ambient, point: point }
}

function main() {
  scene.background = new THREE.Color(0xffffff)

  //camera.near = 14
  //camera.far = 16 + 6
  camera.position.z = 16 * 2
  camera.updateProjectionMatrix()

  setupLights()

  var mat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 0.1,
  })

  var plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), mat)
  //plane.receiveShadow = true
  scene.add(plane)

  for (var i = 0; i < 16; i++) {
    addBlock(randint(-8, 8), randint(-8, 8), 1, randint(3, 8), randint(0, 1))
  }

  //addBlock(0, 0, 1, 8, 1)
  //addBlock(0, 0, 1, 8, 0)

  renderer.render(scene, camera)
}
main()

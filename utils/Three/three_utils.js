var canvas, camera, renderer, scene, width, height
var Vector2, Vector3

function setup(renderer_options) {
  Vector2 = THREE.Vector2
  Vector3 = THREE.Vector3

  width = window.innerWidth
  height = window.innerHeight
  canvas = document.getElementById("canvas")

  renderer = new THREE.WebGLRenderer(
    Object.assign({ canvas: canvas }, renderer_options)
  )
  renderer.setSize(width, height)
  window.renderer = renderer

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xffffff)
  window.scene = scene

  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.z = 2
  window.camera = camera

  window.addEventListener("resize", onWindowResize, false)
}

function main() {}

function onWindowResize() {
  width = window.innerWidth
  height = window.innerHeight

  camera.aspect = width / height
  camera.updateProjectionMatrix()

  renderer.setSize(width, height)

  main()
}

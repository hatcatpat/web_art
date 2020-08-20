import * as THREE from "../../node_modules/three/build/three.module.js"
window.THREE = THREE
setup({ antialias: true })

import * as SHADER from "./shader.js"

function setupOrthographicCamera() {
  camera = new THREE.OrthographicCamera(
    0,
    width,
    height,
    0,
    -width * height,
    width * height
  )
  camera.position.x = -width / 2
  camera.position.y = -height / 2
  camera.position.z = 0
}

var uniforms
function main() {
  setupOrthographicCamera()

  var seaside_image = new THREE.TextureLoader().load("seaside.jpg")
  seaside_image.wrapS = THREE.MirroredRepeatWrapping
  seaside_image.wrapT = THREE.MirroredRepeatWrapping

  uniforms = {
    time: { value: 0.0 },
    res: { value: new THREE.Vector2(width, height) },
    image: { value: seaside_image },
  }

  var plane = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.ShaderMaterial({
      uniforms: uniforms,
      fragmentShader: SHADER.frag(),
    })
  )
  scene.add(plane)

  renderer.render(scene, camera)

  animate()
}
main()

function animate() {
  requestAnimationFrame(animate)

  uniforms.time.value = performance.now() / 1000

  renderer.render(scene, camera)
}

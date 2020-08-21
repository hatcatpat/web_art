import * as THREE from "../../node_modules/three/build/three.module.js"
window.THREE = THREE
setup({ antialias: true })

import * as SHADER from "./shader.js"
import * as SHADER_UTILS from "../../utils/General/shaders.js"

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

function addShaderObject() {
  var sz = Math.min(width, height) * 0.5
  var obj = new THREE.Mesh(
    //new THREE.PlaneGeometry(width, height),
    //new THREE.SphereGeometry(Math.min(width, height) * 0.4, 32, 32),
    new THREE.BoxGeometry(sz, sz, sz),
    new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: SHADER_UTILS.vert.basic(),
      fragmentShader: SHADER.frag(),
    })
  )
  scene.add(obj)

  return obj
}

var uniforms, plane
function main() {
  setupOrthographicCamera()

  var seaside_image = new THREE.TextureLoader().load("seaside.jpg")
  seaside_image.wrapS = THREE.MirroredRepeatWrapping
  seaside_image.wrapT = THREE.RepeatWrapping

  var video = document.getElementById("vid")
  video.play()
  video.playbackSpeed = 4
  var vidtex = new THREE.VideoTexture(video)
  vidtex.wrapS = THREE.MirroredRepeatWrapping
  vidtex.wrapT = THREE.RepeatWrapping

  uniforms = {
    time: { value: 0.0 },
    res: { value: new THREE.Vector2(width, height) },
    image: { value: seaside_image },
    tex: { value: vidtex },
  }

  var p = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: SHADER_UTILS.vert.basic(),
      fragmentShader: SHADER.frag(),
    })
    //new THREE.MeshBasicMaterial({ map: vidtex })
  )
  p.position.z = -width
  //scene.add(p)

  plane = addShaderObject()

  renderer.setRenderTarget(null)
  renderer.render(scene, camera)
  animate()
}

var startButton = document.getElementById("startButton")
startButton.addEventListener(
  "click",
  function () {
    main()
  },
  false
)
//main()

function animate() {
  requestAnimationFrame(animate)

  var t = 0.003
  plane.rotateX(t)
  plane.rotateY(t * 2)
  plane.rotateZ(t / 2)

  uniforms.time.value = performance.now() / 1000

  renderer.render(scene, camera)
}

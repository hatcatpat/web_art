var canvas, camera, renderer, scene, width, height

function setup(){

  width = window.innerWidth
  height = window.innerHeight

  canvas = document.getElementById('canvas'),
  renderer = new THREE.WebGLRenderer({canvas:canvas})
  renderer.setSize(width,height)
  window.renderer = renderer

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xffffff)
  window.scene = scene 

  camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 )
  camera.position.z = 2
  window.camera = camera

}

function main(){}

window.onresize = function(){
  
  width = window.innerWidth
  height = window.innerHeight

  camera.aspect = width / height
  camera.updateProjectionMatrix()

  renderer.setSize(width, height)

  main()
}

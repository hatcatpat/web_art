import * as THREE from '../../node_modules/three/build/three.module.js'
window.THREE = THREE
setup()

function main(){

  const cube = new THREE.Mesh(
    new THREE.CubeGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color: 0xff00ff })
  )
  cube.rotateX(0.3)
  cube.rotateY(0.4)
  scene.add(cube)

  renderer.render( scene, camera )

}
main()

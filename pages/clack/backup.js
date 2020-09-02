import * as THREE from "../../node_modules/three/build/three.module.js"
window.THREE = THREE
setup()

import { ImprovedNoise } from "../../node_modules/three/examples/jsm/math/ImprovedNoise.js"
import { OrbitControls } from "../../node_modules/three/examples/jsm/controls/OrbitControls.js"

//
//
//

var controls
var world
var cube, cube_body, spring
function main() {
  world = new CANNON.World()
  world.gravity.set(0, -1, 0)
  world.broadphase = new CANNON.NaiveBroadphase()
  world.solver.iterations = 10

  //

  renderer.shadowMap.enabled = true
  camera.position.set(4, 4, 4)
  controls = new OrbitControls(camera, renderer.domElement)

  var point = new THREE.PointLight(0xffffff, 1)
  point.position.set(4, 4, 4)
  point.castShadow = true
  scene.add(point)

  //

  cube = new THREE.Mesh(
    new THREE.CubeGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0xff00ff })
  )
  cube.castShadow = true
  cube.position.y = 2
  cube.rotateX(0.3)
  cube.rotateY(0.4)
  scene.add(cube)

  cube_body = new CANNON.Body({
    mass: 1,
  })
  cube_body.addShape(new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)))
  //cube_body.angularVelocity.set(0, 10, 0)
  cube_body.angularDamping = 0.5
  cube_body.position.copy(cube.position)
  cube_body.quaternion.copy(cube.quaternion)
  world.addBody(cube_body)
  window.cube_body = cube_body

  var spring_origin = new CANNON.Body({ mass: 0 })
  spring_origin.position.set(0, 4, 0)
  spring = new CANNON.Spring(spring_origin, cube_body, {
    restLength: 2,
    stiffness: 10,
    damping: 0,
  })

  //

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({ color: 0xaaaaaa, side: THREE.BackSide })
  )
  plane.receiveShadow = true
  plane.position.y = -1
  plane.rotateX(PI / 2)
  scene.add(plane)

  var plane_body = new CANNON.Body({
    mass: 0,
  })
  plane_body.addShape(new CANNON.Plane())
  plane_body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -PI / 2)
  plane_body.position.copy(plane.position)
  world.addBody(plane_body)

  renderer.render(scene, camera)

  animate()
}
main()

function animate() {
  requestAnimationFrame(animate)

  world.step(1 / 60)
  cube.position.copy(cube_body.position)
  cube.quaternion.copy(cube_body.quaternion)

  spring.applyForce()

  renderer.render(scene, camera)
}

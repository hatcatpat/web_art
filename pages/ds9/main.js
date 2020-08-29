import * as THREE from "../../node_modules/three/build/three.module.js"
window.THREE = THREE
setup({ antialias: true })

import { ImprovedNoise } from "../../node_modules/three/examples/jsm/math/ImprovedNoise.js"
var perlin

import { Trig } from "./trig.js"

import { EffectComposer } from "../../node_modules/three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "../../node_modules/three/examples/jsm/postprocessing/RenderPass.js"
import { UnrealBloomPass } from "../../node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js"
var composer

function setupOSC() {
  var oscPort = new osc.WebSocketPort({
    url: "ws://localhost:8081", // URL to your Web Socket server.
    metadata: true,
  })

  oscPort.open()

  oscPort.on("message", function (oscMsg) {
    console.log("An OSC message just arrived!", oscMsg)

    if (oscMsg.address == "/trig") {
      var arg = oscMsg.args
      trig({
        dir: arg[0].value,
        pos_dur: arg[1].value,
        int_dur: arg[2].value,
        max: arg[3].value,
        v: arg[4].value,
      })
    }
  })
}

var circles, dummy, res, sizes
function main() {
  setupOSC()

  scene.background = new THREE.Color(0)

  var sc = 0.8
  camera = new THREE.OrthographicCamera(
    0,
    width / sc,
    height / sc,
    0,
    -width * height,
    width * height
  )
  camera.position.x = (-width * (1 - sc)) / 2
  camera.position.y = (-height * (1 - sc)) / 2

  // composer
  var renderScene = new RenderPass(scene, camera)
  var bloomPass = new UnrealBloomPass(
    new THREE.Vector2(width, height),
    1.5,
    0.4,
    0.85
  )
  bloomPass.threshold = 0.0
  bloomPass.strength = 2
  bloomPass.radius = 0.0
  window.bloomPass = bloomPass

  composer = new EffectComposer(renderer)
  composer.addPass(renderScene)
  composer.addPass(bloomPass)

  perlin = new ImprovedNoise()

  res = new THREE.Vector2(32, 32)
  sizes = new THREE.Vector2(width / res.x, height / res.y)

  var geom = new THREE.CircleGeometry(
    Math.min(sizes.x, sizes.y) * 0.5 * 0.25,
    32
  )
  var mat = new THREE.MeshBasicMaterial({ color: 0x00ff00 })

  circles = new THREE.InstancedMesh(geom, mat, res.x * res.y)
  scene.add(circles)

  dummy = new THREE.Object3D()

  renderer.render(scene, camera)
  composer.render()
  animate()
}
main()

function trig(args) {
  //console.log("trig", args)
  trig_events.push(
    new Trig({
      res: res,
      pos_dur: args.pos_dur,
      intensity_dur: args.int_dur,
      max_intensity: args.max,
      looping: false,
      dir: { dir: Math.round(args.dir), v: args.v },
    })
  )
}
window.trig = trig

function getScale(i, j) {
  return (1 - Math.abs(j - pos) / res.y) * intensity + 1
}

var trig_events = [
  //new Trig({
  //res: res,
  //pos_dur: 1,
  //intensity_dur: 0.1,
  //max_intensity: 4,
  //looping: false,
  //dir: { dir: 0, v: 0 },
  //}),
  //new Trig({
  //res: res,
  //pos_dur: 1,
  //intensity_dur: 0.1,
  //max_intensity: 4,
  //looping: true,
  //dir: { dir: 1, i: 0, j: 2 },
  //}),
]
function animate() {
  requestAnimationFrame(animate)

  var k = 0
  for (var i = 0; i < res.x; i++) {
    for (var j = 0; j < res.y; j++) {
      dummy.scale.set(1, 1)

      dummy.position.x = (i + 0.5) * sizes.x
      dummy.position.y = (j + 0.5) * sizes.y
      dummy.position.z = 0

      var v = 0
      for (var t in trig_events) {
        var s = trig_events[t].getScale(i, j)
        if (s > v) {
          v = s
        }
      }
      dummy.scale.set(v, v)

      dummy.updateMatrix()

      circles.setMatrixAt(k, dummy.matrix)
      k++
    }
  }
  circles.instanceMatrix.needsUpdate = true

  for (var t in trig_events) {
    trig_events[t].update()
    if (trig_events[t].done) {
      trig_events.splice(t, 1)
    }
  }

  renderer.render(scene, camera)
  composer.render()
}

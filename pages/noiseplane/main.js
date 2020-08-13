import * as THREE from "../../node_modules/three/build/three.module.js"
window.THREE = THREE

setup({ antialias: true })

import { OrbitControls } from "../../node_modules/three/examples/jsm/controls/OrbitControls.js"
var controls

import { ImprovedNoise } from "../../node_modules/three/examples/jsm/math/ImprovedNoise.js"
var perlin

import * as SHADERS from "../../utils/General/shaders.js"

function shader() {
  return (
    `
    varying vec2 vUv;
    uniform vec3 col;
    uniform vec3 u_res;
    uniform vec3 fogColor;
    uniform float fogNear;
    uniform float fogFar;
    uniform float t;
    ` +
    SHADERS.utils.random() +
    `
    void main() {
      vec3 pos = gl_FragCoord.xyz / u_res;
      vec3 C = col * vec3(pos.z*1.3,1.0,1.1) - (random(pos.xy+mod(t,1000.0)/100.0)/8.0);
      gl_FragColor = vec4(C,1.0);
      #ifdef USE_FOG
	#ifdef USE_LOGDEPTHBUF_EXT
	  float depth = gl_FragDepthEXT / gl_FragCoord.w;
	#else
	  float depth = gl_FragCoord.z / gl_FragCoord.w;
	#endif
	  float fogFactor = smoothstep( fogNear, fogFar, depth );
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
      #endif
    }
  `
  )
}

function generateTerrain(w, h, z) {
  var data = new Array(w * h)

  var k = 0
  var t = performance.now() / (1000 * 5)
  var sc = map(perlin.noise(t, 3.1415, -1000), 1, 24, -1, 1)
  for (var i = 0; i < w; i++) {
    for (var j = 0; j < h; j++) {
      data[k] =
        0.5 +
        0.5 *
          perlin.noise(
            (i / w) * map(perlin.noise(t, 1000, -2000), 1 / sc, sc, -1, 1),
            (j / h) * map(perlin.noise(t, -1000, -3000), 1 / sc, sc, -1, 1),
            z
          )
      k++
    }
  }

  return data
}

//var worldWidth = 256 * 4,
//worldDepth = 256 / 4
var worldWidth = 256,
  worldDepth = 256
var worldHalfWidth = worldWidth / 2,
  worldHalfDepth = worldDepth / 2

var plane, light, sz, noise_z, plane_uniforms
function makePlane() {
  var geometry = new THREE.PlaneBufferGeometry(
    sz,
    sz,
    worldWidth - 1,
    worldDepth - 1
  )

  noise_z = rand(0, 100)
  var data = generateTerrain(worldWidth, worldDepth, noise_z)
  var vertices = geometry.attributes.position.array

  for (var i = 0; i < vertices.length; i += 3) {
    vertices[i + 2] = data[i / 3] * sz
  }

  //var mat = new THREE.MeshPhongMaterial({
  //color: 0xff0000,
  //morphTargets: true,
  //})

  plane_uniforms = {
    col: { value: new Vector3(1, 1, 1) },
    fogColor: { value: scene.fog.color },
    fogNear: { value: scene.fog.near },
    fogFar: { value: scene.fog.far },
    u_res: { value: new Vector3(width, height, sz) },
    t: { value: 0 },
  }
  var vertexShader = SHADERS.vert.basic()
  //var fragmentShader = SHADERS.frag.fogShader()
  var fragmentShader = shader()
  var mat = new THREE.ShaderMaterial({
    uniforms: plane_uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    fog: true,
    //wireframe: true,
  })

  plane = new THREE.Mesh(geometry, mat)
  scene.add(plane)
}

function makeSea() {
  var geometry = new THREE.PlaneBufferGeometry(sz * 1, sz * 1, 1, 1)
  var mat = new THREE.MeshBasicMaterial({ color: 0x0000ff, fog: false })

  var sea = new THREE.Mesh(geometry, mat)
  sea.position.set(0, 0, 0.5)
  scene.add(sea)
}

function main() {
  //renderer.shadowMap.enabled = true
  //renderer.shadowMap.type = THREE.PCFSoftShadowMap

  scene.background = 0x000000

  controls = new OrbitControls(camera, renderer.domElement)

  perlin = new ImprovedNoise()

  sz = 1
  var szmul = 1.6

  camera.position.z = sz * szmul

  const color = 0x001f1f
  const near = sz * (szmul - 1)
  const far = sz * szmul * 0.9
  scene.fog = new THREE.Fog(color, near, far)

  makePlane()

  //plane.receiveShadow = true
  //plane.castShadow = true

  renderer.render(scene, camera)
}
main()

var noise_sp = 0.05
function animate() {
  requestAnimationFrame(animate)

  controls.update()

  var data = generateTerrain(worldWidth, worldDepth, noise_z)
  var vertices = plane.geometry.attributes.position.array

  for (var i = 0; i < vertices.length; i += 3) {
    vertices[i + 2] = data[i / 3] * sz
  }
  plane.geometry.attributes.position.needsUpdate = true

  //noise_z += map(perlin.noise(noise_z, 0, 0), 0, noise_sp, -1, 1)
  noise_z += 0.02

  plane_uniforms.t.value = performance.now()

  renderer.render(scene, camera)
}
animate()

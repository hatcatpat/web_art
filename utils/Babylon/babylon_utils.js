var scene, camera, canvas, engine, recorder
var Vector2 = BABYLON.Vector2
var Vector3 = BABYLON.Vector3
var Color = BABYLON.Color3
function setup(){

  canvas = document.getElementById("canvas")
  engine = new BABYLON.Engine(canvas, true)

  if (BABYLON.VideoRecorder.IsSupported(engine)) {
      recorder = new BABYLON.VideoRecorder(engine)
  }

  engine.runRenderLoop(function () {
    scene.render()
  })

  window.addEventListener("resize", function () {
    engine.resize()
  })

}


function random(st) {
  return Math.sin( 
    BABYLON.Vector2.Dot(st, new BABYLON.Vector2(12.9898,78.233) ) 
  ) % 1
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
function noise(st) {
  var i = st.floor()
  var f = st.fract()

  // Four corners in 2D of a tile
  var a = random(i)
  var b = random( (new BABYLON.Vector2(1.0, 0.0)).add(i) )
  var c = random( (new BABYLON.Vector2(0.0, 1.0)).add(i) )
  var d = random( (new BABYLON.Vector2(1.0, 1.0)).add(i) )

  // Smooth Interpolation

  // Cubic Hermine Curve.  Same as SmoothStep()
  var u = f.multiply(f).multiply( (new BABYLON.Vector2(3,3)).subtract(f.scale(2)) )

  // Mix 4 corners percentages
  return map( 
    lerp(a, b, u.x) 
    + (c - a) * u.y * (1-u.x)
    + (d - b) * u.x * u.y,
    0,1,
    -1,1
  )

}

setup()

var sphere
var light2

var createScene = function () {

  scene = new BABYLON.Scene(engine)
  scene.clearColor = new Color.White().scale(0.0)

  camera = new BABYLON.UniversalCamera("Camera", new Vector3(0,90,-150), scene)
  //camera.setTarget(new Vector3.Zero())
  camera.setTarget(new Vector3(0,0,60))
  camera.attachControl(canvas, true)
  //camera.inputs.clear()

  var light1 = new BABYLON.HemisphericLight("light1", new Vector3(1, 1, 0), scene)
  light2 = new BABYLON.PointLight("light2", new Vector3(0, 150, 0), scene)
  light2.intensity = 0.3

  var ground = new BABYLON.MeshBuilder.CreateCylinder("ground", {diameter:110,height:2,tessellation:50}, scene )
  ground.rotate( new Vector3(0,1,0), Math.PI/4 )
  ground.receiveShadows = true
  ground.position.y = -5

  var ground_mat = new BABYLON.StandardMaterial("sphere_mat", scene)
  //ground_mat.diffuseColor = new Color.Gray()
  ground_mat.specularColor = new Color.White().scale(1.0)
  ground_mat.diffuseTexture = new BABYLON.Texture("./rock.jpg", scene);
  ground_mat.bumpTexture = new BABYLON.Texture("./rock_map.png", scene);

  ground.material = ground_mat

  sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:40, updatable:true}, scene)
  sphere.position.y = 40

  var sphere_mat = new BABYLON.StandardMaterial("sphere_mat", scene)
  sphere_mat.diffuseTexture = new BABYLON.CloudProceduralTexture("texture", 1024, scene);
  sphere_mat.diffuseColor = new Color.Red()
  sphere_mat.specularColor = new Color.White().scale(0.8)
  //sphere_mat.diffuseTexture = new BABYLON.Texture("./rock.jpg", scene);
  sphere_mat.bumpTexture = new BABYLON.Texture("./rock_map.png", scene);
  sphere.material = sphere_mat
  //sphere.isVisible = false

  var angle = 0
  var update_sphere = function(pos){ 
    var delta = angle;
    for (var idx = 0; idx < pos.length; idx += 3) {
      var scoords = carteToSpherical(pos[idx],pos[idx+1],pos[idx+2])

      if((scoords.theta+angle/(8) )%0.1 < (0.1/2) ){
	scoords.r += Math.cos(delta) * 0.4 * noise(new Vector2(scoords.psi+angle,scoords.theta+angle))
      }

      var coords = sphericalToCarte(scoords.r,scoords.psi,scoords.theta)
      pos[idx] = coords.x
      pos[idx+1] = coords.y
      pos[idx+2] = coords.z
      //delta += 0.00005 * dir
    }
  }

  var shadowGenerator = new BABYLON.ShadowGenerator(1024, light2)
  shadowGenerator.getShadowMap().renderList.push(sphere)

  scene.registerBeforeRender(function() {

    var t = performance.now()/1000
    //Color.HSVtoRGBToRef( 
      //noise(new Vector2(t,t)) * 360,
      //1,1,sphere.material.diffuseColor)

    sphere.updateMeshPositions(update_sphere, true)
    var sp = noise(new Vector2(t,t))*0.1
    sphere.rotate(new Vector3(1, 0, 0), sp/2)
    sphere.rotate(new Vector3(0, 1, 0), sp/8)
    sphere.rotate(new Vector3(0, 0, 1), sp/ (noise(new Vector2(t,t)) * 8) )
    angle += 0.01
  })

  return scene
}
scene = createScene()

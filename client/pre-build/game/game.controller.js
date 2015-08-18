app.controller('GameController', function($scope, $http, GameFactory) {

  var grass = ['grass', 'dirt', 'grass_dirt']; //this will come from the server
  var dirt = ['dirt', 'dirt', 'dirt'];
  var bark = ['tree_side'];
  var leaves = ['leaves_opaque'];
  var materials = [grass, dirt, bark, leaves];
  var size = 20;

  // <------ GAME ------>
  //voxel-engine: base module
  var createGame = window.voxelEngine;
  var game = createGame({
    generate: function(x, y, z) {
      return (y === 0 && x >= 0 && x <= size && z >= 0 && z <= size) ? 1 : 0;
    },
    materials: materials,
    texturePath: '../textures/',
    controls: {
      discreteFire: true
    },
    // // lightsDisabled: true
  });

  game.appendTo(document.body)
  window.game = game;

  var camera = new game.THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000)
  window.camera = camera;
  camera.position.set(18, 8, 50);

  var target = new game.THREE.Vector3(10, 0, 10)
  camera.lookAt(target)
  var radius = 50,
    theta = 90,
    phi = 90;
  var isMouseDown = false;
  var onMouseDownPosition = new game.THREE.Vector2(),
    onMouseDownPhi = -10,
    onMouseDownTheta = -10

  camera.position.x = (radius * Math.sin(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360))
  camera.position.y = radius * Math.sin(phi * Math.PI / 360)
  camera.position.z = (radius * Math.cos(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360))

  game.view.renderer.domElement.addEventListener('DOMMouseScroll', mousewheel, false);
  game.view.renderer.domElement.addEventListener('mousewheel', mousewheel, false);
  game.view.renderer.domElement.addEventListener('resize', onWindowResize, false);
  game.view.renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false)
  game.view.renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false)
  game.view.renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false)


  function mousewheel(event) {
    event.preventDefault()
      // prevent zoom if a modal is open
    zoom(event.wheelDeltaY / 4 || event.detail)
  }


  function zoom(delta) {
    var origin = {
      x: 10,
      y: 0,
      z: 10
    }
    var distance = camera.position.distanceTo(origin)
    var tooFar = distance > 100
    var tooClose = distance < 5
    if (delta > 0 && tooFar) return
    if (delta < 0 && tooClose) return
    radius = distance // for mouse drag calculations to be correct
    camera.translateZ(delta)
    render();
  }

  function setIsometricAngle() {

    theta += 90

    camera.position.x = radius * Math.sin(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360)
    camera.position.y = radius * Math.sin(phi * Math.PI / 360)
    camera.position.z = radius * Math.cos(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360)
      // camera.updateMatrix()
  }

  function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    game.view.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  function onDocumentMouseMove(event) {
    event.preventDefault()
    if (true) {}
    if (isMouseDown) {
      theta = -((event.clientX - onMouseDownPosition.x) * 0.5) + onMouseDownTheta
      phi = ((event.clientY - onMouseDownPosition.y) * 0.5) + onMouseDownPhi

      phi = Math.min(180, Math.max(0, phi))



      // theta is x; phi is y;
      camera.position.x = (radius * Math.sin(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360))+10
      camera.position.y = radius * Math.sin(phi * Math.PI / 360)
      camera.position.z = (radius * Math.cos(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360))+10
        // camera.updateMatrix()
      console.log(Math.pow(camera.position.x, 2) + Math.pow(camera.position.y, 2) + Math.pow(camera.position.z, 2))

      render();
    }
  }

  function onDocumentMouseDown(event) {
    event.preventDefault()
    isMouseDown = true
    onMouseDownTheta = theta
    onMouseDownPhi = phi
    onMouseDownPosition.x = event.clientX //fixed at click
    onMouseDownPosition.y = event.clientY //fixed at click
  }

  function onDocumentMouseUp(event) {
    event.preventDefault()
    isMouseDown = false
    onMouseDownPosition.x = event.clientX - onMouseDownPosition.x
    onMouseDownPosition.y = event.clientY - onMouseDownPosition.y
    console.log(camera.position)
  }


  function render() {
    camera.lookAt(target)
      // raycaster = projector.pickingRay( mouse2D.clone(), camera )
    game.view.renderer.render(game.scene, camera)
  }


  game.view.camera = camera;
  window.camera = camera;


  // <------ PLAYER ------>
  // voxel-player: add player that can move around. It needs a copy of the game
  // var createPlayer = window.voxelPlayer(game);
  // var player = createPlayer(); //creates player and provide dummy texture
  // window.player = player;
  // player.pov('third');
  // player.possess(); //camera follow player
  // player.yaw.position.set(size / 2, 10, size / 2);

  // //Toggle Camera First / Third Person View
  // window.addEventListener('keydown', function(ev) {
  //   if (ev.keyCode === 'R'.charCodeAt(0)) {
  //     player.toggle();
  //   }
  // });

  // // Make Player Fly
  // var fly = window.voxelFly;
  // var makeFly = fly(game);
  // var target = game.controls.target();
  // game.flyer = makeFly(target);

});
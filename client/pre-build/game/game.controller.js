app.controller('GameController', function($scope, $http, GameFactory) {



  var grass = ['grass', 'dirt', 'grass_dirt']; //this will come from the server
  var dirt = ['dirt', 'dirt', 'dirt'];
  var bark = ['tree_side'];
  var leaves = ['leaves_opaque'];
  var materials = [grass, dirt, bark, leaves];
  var size = 20;

  // <------ GAME ------>
  //voxel-engine: base module
  var createGame = window.VoxelEngine;
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


  // <------ PLAYER ------>
  //voxel-player: add player that can move around. It needs a copy of the game
  var createPlayer = window.voxelPlayer(game);
  var player = createPlayer(); //creates player and provide dummy texture
  window.player = player;
  player.pov('third');
  player.possess(); //camera follow player
  player.yaw.position.set(size / 2, 10, size / 2);

  //Toggle Camera First / Third Person View
  window.addEventListener('keydown', function(ev) {
    if (ev.keyCode === 'R'.charCodeAt(0)) {
      player.toggle();
    }
  });

  // Make Player Fly
  var fly = window.voxelFly;
  var makeFly = fly(game);
  var target = game.controls.target();
  game.flyer = makeFly(target);



});
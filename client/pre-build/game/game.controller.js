app.controller('GameController', function($scope, $http, WorldsFactory, CameraFactory,MapFactory) {


  // <------ GAME ------>
  //voxel-engine: base module
  var map = new MapFactory.create()
  window.Map =MapFactory.getCurrentMap(); // Working

  var createGame = window.voxelEngine;
  var game = createGame(WorldsFactory.newWorldOptions()); //World Data from factory
  game.map = map;

  game.appendTo(document.body)
  window.game = game; //For Debugging
  WorldsFactory.setCurrentGame(game);


  // <------ CAMERA ------>
  CameraFactory.set(game);

  // <------ SKY ------>
  var createSky = window.Sky({
    game: game
  });
  var sky = createSky();

  game.on('tick', sky);

  //need to debug interact
  var start = window.start(game);

  var Highlight = window.Highlight;
  var highlighter = Highlight(game);
  var positionME;
  highlighter.on('highlight', function(voxelPosArray) {
    positionME = voxelPosArray;
  });

  var Trees = window.Tree(game, {
    bark: 3,
    leaves: 4,
    densityScale: 2,
    treeType: 'subspace'
});



  $scope.save = function(){
    WorldsFactory.postWorld();
  };



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
app.controller('GameController', function($scope, $stateParams, WorldsFactory, CameraFactory, MapFactory, CreatureFactory, TimeFactory, $state, $q) {

  if ($('canvas')) $('canvas').remove();
  // <------ GAME ------>
  //voxel-engine: base module
  var map = MapFactory.getCurrentMap();
  window.Map = map; // Working

  var createGame = window.voxelEngine;
  var game = createGame(WorldsFactory.newWorldOptions()); //World Data from factory
  game.map = map;

  game.appendTo(document.body);
  window.game = game; //For Debugging
  WorldsFactory.setCurrentGame(game);
  //calling creature constructor
  var createCreature = CreatureFactory.create(game, window.voxel, window.voxelMesh);
  // var pigeon = new createCreature({
  //   name: 'pigeon',
  //   size: 5,
  //   vision: 3,
  //   isHerbivore: true
  // });
  // window.pigeon = pigeon;

  // var crocodile = new createCreature({
  //   name: 'crocodile',
  //   size: 5,
  //   vision: 5,
  //   isHerbivore: false
  // });
  // window.crocodile = crocodile;


  // var duck = new createCreature({
  //   name: 'duck',
  //   size: 5,
  //   vision: 5,
  //   isHerbivore: true
  // });
  // window.duck = duck;

  var deer = new createCreature({
    name: 'deer',
    size: 12,
    vision: 5,
    social: 2,
    isHerbivore: true 
  });
  window.deer = deer;

  // var lion = new createCreature({
  //   name: 'lion',
  //   size: 5,
  //   vision: 5,
  //   isHerbivore: false
  // });
  // window.lion = lion;

  // var turtle = new createCreature({
  //   name: 'turtle',
  //   size: 5,
  //   vision: 5,
  //   social: 7,
  //   isHerbivore: false
  // });
  // window.turtle = turtle;


   


  // <------ CAMERA ------>
  CameraFactory.set(game);

  // <------ SKY ------>
  var createSky = window.Sky({
      game: game
  });
  var sky = createSky();

  TimeFactory.setTick(game);

  var Highlight = window.Highlight;
  var highlighter = Highlight(game);
  var positionME;
  highlighter.on('highlight', function(voxelPosArray) {
      positionME = voxelPosArray;
  });

  game.trees = WorldsFactory.getCurrentWorld().trees || undefined;
  // console.log(game.trees);
  var createTrees = window.Tree(game);
  if (!game.trees) {
      createTrees({
          bark: 3,
          leaves: 4,
          densityScale: 2,
          treeType: 'subspace',
          random: function() {
              return 1;
          }
      });
  } else {
      game.trees = JSON.parse(game.trees);
      createTrees({
          bark: 3,
          leaves: 4,
          treeType: 'subspace',
          // densityScale: 2,
          random: function() {
              return 1;
          }
      })
  }

  



  var clouds = window.Clouds({
      // pass a copy of the game
      game: game,

      // how high up the clouds should be from the player
      high: 10,

      // the distance from the player the clouds should repeat
      distance: 25,

      // how many clouds to generate
      many: 10,

      // how fast the clouds should move
      speed: 0.01,

      // material of the clouds
      material: new game.THREE.MeshBasicMaterial({
          emissive: 0xffffff,
          shading: game.THREE.FlatShading,
          fog: false,
          transparent: true,
          opacity: 0.5,
      }),
  });


  // if (WorldsFactory.getCurrentWorld().environment === 'ice') {
  // var snow = window.Snow({
  //         game: game,

  //         // how many particles of snow
  //         count: 1000,

  //         // size of snowfall
  //         size: 20,

  //         // // speed it falls
  //         // speed: 0.1,

  //         // // speed it drifts
  //         // drift: 1,

  //         // // material of the particle
  //         // material: new game.THREE.ParticleBasicMaterial({
  //         //     color: 0xffffff,
  //         //     size: 1
  //         // })
  //     })
      // }
  game.on('tick', sky
      // snow.tick();
  );

  // game.on('tick', function() {
  //     snow.tick();
  // })

  // game.addEvent(snow.tick, 1 / 100);
  // game.on('tick', function() {
  //     console.log("tick");
  // })
  //render

  var start = window.start(game);

  function updateCreatureStuff(arr) {
      return $q.all(arr.map(function(creature) {
          return CreatureFactory.updateCoord(creature.position)
              .then(function() {
                  return CreatureFactory.updateCoord(creature.rotation)
              })
      }))
  }

  function postCreatureStuff(arr) {
      return $q.all(arr.map(function(creature) {
          return CreatureFactory.postCoord([creature.position, creature.rotation])
              .then(function(coords) {
                  console.log('hello', coords, creature)
                  creature.position = coords[0];
                  creature.rotation = coords[1];
                  console.log(creature)
                  return CreatureFactory.postCreature(creature); //parents will be set here
              })
      }))
  }

  TimeFactory.setEvent();

  $scope.save = function() {
      var existing = [],
          isNew = [];
      game.creatures.forEach(function(creature) {
          // deleting circular reference for JSON
          delete creature.map;
          delete creature.game;
          delete creature.item;
          if (creature._id) existing.push(creature);
          else isNew.push(creature);
      })
      updateCreatureStuff(existing)
          .then(function() {
              return postCreatureStuff(isNew)
          })
          .then(function(newCreatures) {
              var allCreatures = existing.concat(newCreatures);
              game.trees = JSON.stringify(game.trees);
              var updatedWorld = {
                  map: game.map,
                  trees: game.trees,
                  creatures: allCreatures
              };

              return WorldsFactory.updateWorld($stateParams.id, updatedWorld)
          })
          .then(function() {
              $state.go('worlds');
          })
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
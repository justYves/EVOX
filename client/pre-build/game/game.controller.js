app.controller('GameController', function($scope, $stateParams, WorldsFactory, CameraFactory, MapFactory, CreatureFactory, TimeFactory, EventsFactory, $state, $q) {

    $scope.creatures = CreatureFactory.currentCreatures;
    var createGame = window.voxelEngine; // use to create the World
    var createCreature;
    var map, game, size;
    var sky, clouds;

    initMap();
    initGame();
    initTrees();
    initCreatures();
    initEnvironment();
    startGame();

    $scope.play = function() {
        game.play();
    };
    $scope.pause = function() {
        game.pause();
    };
    $scope.speedUp = function() {
        game.speedUp();
    };
    $scope.slowDown = function() {
        game.slowDown();
    };

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
        var allCreatures
        updateCreatureStuff(existing)
            .then(function() {
                return postCreatureStuff(isNew)
            })
            .then(function(newCreatures) {
                allCreatures = existing.concat(newCreatures);
                return JSON.stringify(game.trees);
            })
            .then(function(trees) {
                var updatedWorld = WorldsFactory.getCurrentWorld();
                updatedWorld.map = game.map;
                updatedWorld.trees = trees;
                updatedWorld.creatures = allCreatures;

                return WorldsFactory.updateWorld(updatedWorld);
            })
            .then(function() {
                $state.go('worlds');
            });
    };

    function initMap() {
        map = MapFactory.getCurrentMap();
    }

    // <------ GAME ------>
    //voxel-engine: base module
    function initGame() {
        if ($('canvas')) $('canvas').remove(); //take of the canvas if it already exists;
        if (!WorldsFactory.getCurrentWorld()) $state.go('worlds');

        size = WorldsFactory.getCurrentWorld().size;
        var createGame = window.voxelEngine;
        game = createGame(WorldsFactory.newWorldOptions()); //World Data from factory
        game.map = map;
        game.appendTo(document.getElementById("container"));
        window.game = game; //For Debugging
        WorldsFactory.setCurrentGame(game);
        // var terrain = window.terrain;
        //set Camera
        CameraFactory.startCamera(game);
    }

    // <------ Creature ------>
    function initCreatures() {
        if (!$scope.creatures.length) {
            $scope.creatures = [{
                name: 'deer',
                size: 12,
                vision: 5,
                social: 2,
                isHerbivore: true
            },
            // , {
            //     name: 'turtle',
            //     size: 5,
            //     vision: 5,
            //     social: 7,
            //     isHerbivore: false
            // }
            // , {
            //     name: 'crocodile',
            //     size: 5,
            //     vision: 5,
            //     isHerbivore: false
            // }, 
            {
                name: 'lion',
                size: 5,
                vision: 7,
                isHerbivore: false
            }
            ];
        }
        createCreature = CreatureFactory.create(game, window.voxel, window.voxelMesh);
        $scope.creatures.forEach(function(creature) {
           window[creature.name] = new createCreature(creature);
        });

        // $scope.currentAnimal = CameraFactory.currentAnimal;

        //calling creature constructor

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

        // var deer = new createCreature({
        //   name: 'deer',
        //   size: 5,
        //   vision: 5,
        //   social: 2,
        //   isHerbivore: true
        // });
        // window.deer = deer;

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
    }

    function initEnvironment() {

        // Create Sky
        var createSky = window.Sky({
            game: game
        });
        sky = createSky();
        game.on('tick', sky);
        // //create clouds
        var clouds = window.Clouds({
            // pass a copy of the game
            game: game,

            // how high up the clouds should be from the player
            high: 10,

            // the distance from the player the clouds should repeat
            distance: 100,

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
        console.log(clouds);
        game.on('tick', clouds.tick.bind(clouds))
    }

    function startGame() {
        game.start();
        TimeFactory.startTime(game);
        EventsFactory.startLoop(game);
    }
    // var Highlight = window.Highlight;
    // var highlighter = Highlight(game);
    // var positionME;
    // highlighter.on('highlight', function(voxelPosArray) {
    //     positionME = voxelPosArray;
    // });

    function initTrees() {
        var createTrees = window.Tree(game);
        game.trees = WorldsFactory.getCurrentWorld().trees;
        var options = {
            bark: 3,
            leaves: 4,
            densityScale: 2,
            treeType: 'subspace',
            random: function() {
                return 1;
            }
        };
        if (!!game.trees) {
            delete options.densityScale;
            game.trees = JSON.parse(game.trees);
        }
        createTrees(options);
    }

    // var createTrees = window.Tree(game);
    // if (!game.trees) {
    //   createTrees({
    //     bark: 3,
    //     leaves: 4,
    //     densityScale: 2,
    //     treeType: 'subspace',
    //     random: function() {
    //       return 1;
    //     }
    //   });
    // } else {
    //   game.trees = JSON.parse(game.trees);
    //   createTrees({
    //     bark: 3,
    //     leaves: 4,
    //     treeType: 'subspace',
    //     random: function() {
    //       return 1;
    //     }
    //   })
    // }



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




    // game.on('tick', function() {
    //     snow.tick();
    // })

    // var start = window.start(game);

    function updateCreatureStuff(arr) {
        return $q.all(arr.map(function(creature) {
            return CreatureFactory.updateCoord(creature.position)
                .then(function() {
                    return CreatureFactory.updateCoord(creature.rotation);
                });
        }));
    }

    function postCreatureStuff(arr) {
        return $q.all(arr.map(function(creature) {
            return CreatureFactory.postCoord([creature.position, creature.rotation])
                .then(function(coords) {
                    console.log('hello', coords, creature);
                    creature.position = coords[0];
                    creature.rotation = coords[1];
                    console.log(creature);
                    return CreatureFactory.postCreature(creature); //parents will be set here
                });
        }));
    }

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
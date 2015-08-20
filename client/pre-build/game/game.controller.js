app.controller('GameController', function($scope, $stateParams, WorldsFactory, CameraFactory, MapFactory, CreatureFactory, $state, $q) {


    // <------ GAME ------>
    //voxel-engine: base module
    var map = MapFactory.getCurrentMap();
    window.Map = map; // Working

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

    game.trees = WorldsFactory.getCurrentWorld().trees || undefined;
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
        });
    }


    //calling creature constructor
    var createCreature = CreatureFactory.create(game, window.voxel, window.voxelMesh)
    var pigeon = new createCreature({
        name: 'pigeon',
        size: 1,
        vision: 3,
        isHerbivore: true
    });
    window.pigeon = pigeon;


    //render

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

    $scope.save = function() {
        var existing = [],
            isNew = [];
        game.creatures.forEach(function(creature) {
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

        // if (existing.length) {
        //     $q.all(existing.map(function(creature) {
        //         return CreatureFactory.updateCoord(creature.position)
        //             .then(function() {
        //                 return CreatureFactory.updateCoord(creature.rotation)
        //             })
        //     }))
        //         .then(function() {
        //             $q.all(isNew.map(function(creature) {
        //                 return CreatureFactory.setParents(creature.parents);
        //             }))
        //         })
        // }



        // $q.all(game.creatures.map(function(creature) {
        //     CreatureFactory.postShape(creature.shape)
        //         .then(function(shape) {
        //             if (shape) creature.shape = shape;
        //             if (!creature._id) return CreatureFactory.postParents(creature.parents);
        //             else return;
        //         })
        //         .then(function(parents) {
        //             if (parents) creature.parents = parents;
        //             if (!creature._id) return CreatureFactory.postCoord([creature.position, creature.rotation]);
        //             else {
        //                 return CreatureFactory.updateCoord(creature.position)
        //                     .then(function() {
        //                         return CreatureFactory.updateCoord(creature.rotation)
        //                     })
        //             }
        //         })
        //         .then(function(data) {
        //             if (Array.isArray(data)) {
        //                 creature.position = data[0];
        //                 creature.rotation = data[1];
        //             }
        //             if (!creature._id) return CreatureFactory.postCreature(creature);
        //         })
        // }))
        //     .then(function(creatures) {

        //     })


        // var shapes = game.creatures.map(function(creature) {
        //     return creature.shape;
        // }).filter(function(shape) {
        //     return !shape._id;
        // });

        // CreatureFactory.postShape(shapes)
        //     .then(function() {
        //         if ()
        //             CreatureFactory.postOffspring
        //     })

        // game.trees = JSON.stringify(game.trees);
        // var updatedWorld = {
        //     map: game.map,
        //     trees: game.trees,
        //     creatures: game.creatures
        // };
        // WorldsFactory.updateWorld($stateParams.id, updatedWorld)
        //     .then(function() {
        //         $state.go('worlds');
        //     })
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
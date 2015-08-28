app.controller('GameController', function($modal, $scope, $stateParams, WorldsFactory, CameraFactory, MapFactory, CreatureFactory, TimeFactory, EventsFactory, $state, $q, user) {
    console.log(user);
    $scope.creatures = CreatureFactory.currentCreatures;
    var createGame = window.voxelEngine; // use to create the World
    var createCreature;
    var map, game, size;
    var sky, clouds;

    initMap();
    initGame();
    // initTrees();
    initCreatures();
    initEnvironment();
    startGame();

    function dragMoveListener(event) {
        var target = event.target,
            // keep the dragged position in the data-x/data-y attributes
            x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
            y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        // translate the element
        target.style.webkitTransform =
            target.style.transform =
            'translate(' + x + 'px, ' + y + 'px)';

        // update the posiion attributes
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
    }

    // this is used later in the resizing demo
    window.dragMoveListener = dragMoveListener;

    interact('.drag-and-resize')
        .draggable({
            onmove: window.dragMoveListener
        })
        .resizable({
            edges: {
                left: true,
                right: true,
                bottom: true,
                top: true
            }
        })
        .on('resizemove', function(event) {
            var target = event.target,
                x = (parseFloat(target.getAttribute('data-x')) || 0),
                y = (parseFloat(target.getAttribute('data-y')) || 0);

            // update the element's style
            target.style.width = event.rect.width + 'px';
            target.style.height = event.rect.height + 'px';

            // translate when resizing from top or left edges
            x += event.deltaRect.left;
            y += event.deltaRect.top;

            target.style.webkitTransform = target.style.transform =
                'translate(' + x + 'px,' + y + 'px)';

            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        });


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
        WorldsFactory.setCurrentGame(game, WorldsFactory.getCurrentWorld());
        // var terrain = window.terrain;
        //set Camera
        CameraFactory.startCamera(game);
    }

    // <------ Creature ------>
    function initCreatures() {
        // if (!$scope.creatures.length) {
        //     $scope.creatures = [{
        //             name: 'deer',
        //             size: 12,
        //             vision: 5,
        //             social: 2,
        //             isHerbivore: true,
        //             spawner: true
        //         },
        //         // , {
        //         //     name: 'turtle',
        //         //     size: 5,
        //         //     vision: 5,
        //         //     social: 7,
        //         //     isHerbivore: false
        //         // }
        //         // , {
        //         //     name: 'crocodile',
        //         //     size: 5,
        //         //     vision: 5,
        //         //     isHerbivore: false
        //         // },
        //         {
        //             name: 'lion',
        //             size: 5,
        //             vision: 7,
        //             isHerbivore: false
        //         }
        //     ];
        // }

        if (user.creature.length) {
            user.creature.forEach(function(thing) {
                $scope.creatures.push(thing.creature);
            })
        }
        console.log("CREATURES TO LOAD", $scope.creatures)
        createCreature = CreatureFactory.create(game, window.voxel, window.voxelMesh);
        $scope.creatures.forEach(function(creature) {
            new createCreature(creature);
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
//         var map = game.THREE.ImageUtils.loadTexture( "../textures/jolicraft/rose.png" );
//                 var material = new game.THREE.SpriteMaterial( { map: map, color: 0xffffff, fog: true ,depthTest: false,alphaTest: 0.5} );
//                 var sprite = new game.THREE.Sprite( material );
//                         sprite.position.set(10, 1, 10);
//         sprite.isFront = true;
//         sprite.position.set(3, 2, 3);

// sprite.scale.set(2, 4, 2);

// sprite.alphaTest = 0.5;

// sprite.rotation = 0;

// sprite.renderDepth = 1;
                // game.scene.add( sprite );
                // window.sprite = sprite;
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
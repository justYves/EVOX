app.directive('controlPanel', function() {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: "pre-build/common/directives/control-panel/control-panel.html",
        controller: "PanelController"
    };

})
    .controller("PanelController", function($modal, $scope, WorldsFactory, CreatureFactory, CameraFactory, $q, $stateParams, $state, $rootScope, PointerFactory, $timeout, UserFactory) {
        $scope.user = UserFactory.currentUser;
        $scope.creatures = game.creatures;
        $scope.selected;
        $scope.world = WorldsFactory.getCurrentWorld();
        $scope.stats = false;
        
        var createTree = window.OneTree(game);
        var createCreature = CreatureFactory.create(game, window.voxel, window.voxelMesh);

        $scope.getPercentages = function(creature) {
            $scope.creature.healthPercentage = Math.round((creature.hp / creature.hpMax) * 100);
            $scope.creature.hungerPercentage = Math.round((creature.hunger / creature.hpMax) * 100);
        };

        $scope.statsShow = function() {
            $scope.stats = !$scope.stats;
        };

        $scope.toggleObj = function() {
            $scope.obj = !$scope.obj;
        };

        $scope.killCreature = function() {
            $scope.creature.die();
            $scope.stats = false;
        };

        $scope.procreate = function() {
            $scope.creature.procreate();
        };

        $scope.fertilize = function() {
            CameraFactory.setGrass(true);
        };

        $scope.$on("currentCreature", function(event, creature) {
            $scope.stats = true;
            $scope.creature = creature;
            $scope.getPercentages($scope.creature);
            $scope.$digest();
        });

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

        $scope.$on('clicked', function() {
            var pos = PointerFactory.getPos();
            var x = pos.x - 0.5;
            var y = pos.y - 0.5;
            var z = pos.z - 0.5;
            if (x >= 0 && x < game.map.size && y >= 0 && y < game.map.size && z >= 0 && z < game.map.size) {
                processClick(x, y, z);
            }
        });

        var food = [{
            name: 'pigeon',
            size: 5,
            vision: 3,
            isHerbivore: true,
            isFood: true
        }, {
            name: 'chick',
            size: 5,
            vision: 3,
            isHerbivore: true,
            isFood: true
        }, {
            name: 'duck',
            size: 5,
            vision: 3,
            isHerbivore: true,
            isFood: true
        }];

        function processClick(x, y, z) {
            switch ($scope.selected) {

                case "grass":
                    game.map.spawnGrass(x, y, z);
                    $scope.user.points -= 2;
                    break;

                case "dirt":
                    game.map.empty(x, y, z);
                    break;

                case "tree":
                    var newTree = createTree(x, y, z);
                    $scope.user.points -= 10;
                    break;

                case "shovel":
                    game.setBlock([x, y, z], 0);
                    $scope.user.points -= 2;
                    break;


                case "food":
                    var pickedFood = food[Math.floor(Math.random() * 3)];
                    pickedFood.spawnPos = {
                        x: x,
                        z: z
                    };
                    new createCreature(pickedFood);
                    $scope.user.points -= 5;
                    break;
                
                default:
                    game.creatures.forEach(function(creature) {
                        if (x === creature.position.x - 0.5 && z === creature.position.z - 0.5) {
                            $scope.stats = true;
                            $scope.creature = creature;
                            $scope.getPercentages($scope.creature);
                            updateStats();
                        }
                    });

            }
        }

        function updateStats() {
            "called";
            if (!game.creatures.length) $scope.gameOver();
            if (!$scope.creature || !$scope.stats) {
                $scope.stats = false;
                $scope.$digest;
                return;
            };
            $scope.getPercentages($scope.creature);
            $scope.$digest;
            $timeout(updateStats, 1000);
        }

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
            });
            var allCreatures;
            updateCreatureStuff(existing)
                .then(function() {
                    return postCreatureStuff(isNew);
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
        };

        $scope.gameOver = function() {
            var modalInstance = $modal.open({
                animation: true,
                controller: 'gameOverInstanceCtrl',
                templateUrl: 'game-over.html'
            });
        };

        $scope.info = function() {
            var modalInstance = $modal.open({
                animation: true,
                controller: 'infoInstanceCtrl',
                templateUrl: 'info.html'
            });
        };

    });

app.controller('gameOverInstanceCtrl', function($scope, $modalInstance, $state) {
    $scope.toHome = function() {
        $state.go('home');
        $modalInstance.dismiss('cancel');
    };

    $scope.toWorlds = function() {
        $state.go('worlds');
        $modalInstance.dismiss('cancel');
    };
});

app.controller('infoInstanceCtrl', function($scope, $modalInstance, $state) {
    $scope.close = function() {
        $modalInstance.dismiss('cancel');
    };

    $scope.toWorlds = function() {
        $state.go('worlds');
        $modalInstance.dismiss('cancel');
    };
});
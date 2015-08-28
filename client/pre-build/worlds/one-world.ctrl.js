app.controller('OneWorldCtrl', function($scope, WorldsFactory, $state, MapFactory, $stateParams, worlds, CreatureFactory, UserFactory) {
    function getWorld() {
        if (!WorldsFactory.getCurrentWorld()) {
            for (var i = 0; i < worlds.length; i++) {
                if (worlds[i]._id === $stateParams.id) {
                    $scope.currentWorld = worlds[i];
                    WorldsFactory.setCurrentWorld($scope.currentWorld);
                    break;
                }
            }
        } else $scope.currentWorld = WorldsFactory.getCurrentWorld();
    };

    $scope.loadGame = function() {
        getWorld();
        MapFactory.create($scope.currentWorld.size, $scope.currentWorld.map, $scope.currentWorld.flat, $scope.currentWorld.grassPercent);
        CreatureFactory.currentCreatures = $scope.currentWorld.creatures;
        $state.go('game', {
            id: $stateParams.id
        });
    };

    $scope.deleteWorld = function() {
        WorldsFactory.removeWorld($stateParams.id)
            .then(function() {
                $state.go('worlds', {}, {
                    reload: true
                });
            });
    };

    $scope.levels = UserFactory.currentUser.levels;

    $scope.playLevel = function(idx) {
        var environs = ["land", "desert", "ice"];
        var world = {
            name: "Level" + (idx + 1),
            environment: environs[idx],
            flat: true,
            size: 30,
            grassPercent: 50
        };
        WorldsFactory.postWorld(world, true)
            .then(function(data) {
                console.log('received from postworld', data)
                WorldsFactory.setCurrentWorld(data);
                MapFactory.create(data.size, data.map, data.flat, data.grassPercent);
                CreatureFactory.currentCreatures = data.creatures;
                console.log("Creatures", CreatureFactory.currentCreatures);
                $state.go('game.level', {
                    id: data._id,
                    currentLevel: idx + 1
                });
            });
    };
});
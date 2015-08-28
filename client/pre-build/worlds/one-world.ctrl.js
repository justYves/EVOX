app.controller('OneWorldCtrl', function($scope, WorldsFactory, $state, MapFactory, $stateParams, worlds, CreatureFactory, UserFactory) {
    function getWorld() {
        if (!WorldsFactory.getCurrentWorld()) {
            for (var i = 0; i < worlds.length; i++) {
                if (worlds[i]._id === $stateParams.id) {
                    $scope.currentWorld = worlds[i];
                    WorldsFactory.setCurrentWorld($scope.currentWorld);
                    break;
                }
            };
        } else $scope.currentWorld = WorldsFactory.getCurrentWorld();
    }
    $scope.loadGame = function() {
        getWorld();
        MapFactory.create($scope.currentWorld.size, $scope.currentWorld.map, $scope.currentWorld.flat, $scope.currentWorld.grassPercent);
        CreatureFactory.currentCreatures = $scope.currentWorld.creatures;
        $state.go('game', {
            id: $stateParams.id
        });
    }
    $scope.deleteWorld = function() {
        WorldsFactory.removeWorld($stateParams.id)
            .then(function() {
                $state.go('worlds', {}, {
                    reload: true
                });
            })
    };

    $scope.levels = UserFactory.currentUser.levels
    $scope.playLevel = function(idx) {
        var environs = ["land", "desert", "ice"];
        var world = {
            name: "Level" + (idx + 1),
            environment: environs[idx],
            flat: true,
            size: 30
        };
        WorldsFactory.postWorld(world)
            .then(function(data) {
                var playWorld = data;
                console.log("PLAY WORLD", playWorld)
                $state.go('game.level', {
                    id: playWorld._id,
                    currentLevel: idx + 1
                });
            });
    };
});
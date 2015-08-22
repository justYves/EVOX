app.controller('OneWorldCtrl', function($scope, WorldsFactory, $state, MapFactory, $stateParams, worlds) {
    if (!WorldsFactory.getCurrentWorld()) {
        for (var i = 0; i < worlds.length; i++) {
            if (worlds[i]._id === $stateParams.id) {
                $scope.currentWorld = worlds[i];
                WorldsFactory.setCurrentWorld($scope.currentWorld);
                break;
            }
        };
    } else $scope.currentWorld = WorldsFactory.getCurrentWorld();

    $scope.loadGame = function() {
        console.log('world', $scope.currentWorld)
        MapFactory.create($scope.currentWorld.size, $scope.currentWorld.map, $scope.currentWorld.flat);
        $state.go('game', {
            id: $stateParams.id
        });
    }
    $scope.deleteWorld = function() {
        WorldsFactory.removeWorld($stateParams.id)
            .then(function() {
                $state.go('worlds');
            })
    }
});
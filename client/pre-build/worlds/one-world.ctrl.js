app.controller('OneWorldCtrl', function($scope, WorldsFactory, $state, MapFactory, $stateParams) {
    $scope.currentWorld = WorldsFactory.getCurrentWorld();

    $scope.loadGame = function() {
        MapFactory.create($scope.currentWorld.size, $scope.currentWorld.map);
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
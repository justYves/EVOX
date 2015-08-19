app.controller('OneWorldCtrl', function($scope, WorldsFactory, $state, MapFactory) {
    $scope.currentWorld = WorldsFactory.getCurrentWorld();

    $scope.loadGame = function() {
        MapFactory.create($scope.currentWorld.size, $scope.currentWorld.map);
        $state.go('game', {
            id: $scope.currentWorld._id
        });
    }
});
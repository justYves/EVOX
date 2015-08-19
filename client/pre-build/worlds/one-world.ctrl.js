app.controller('OneWorldCtrl', function($scope, WorldsFactory, $state, MapFactory) {
    $scope.currentWorld = WorldsFactory.getCurrentWorld();

    $scope.loadGame = function() {
        console.log($scope.currentWorld.map)
        MapFactory.create($scope.currentWorld.size, $scope.currentWorld.map);
        $state.go('game')
    }
});
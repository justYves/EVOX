app.controller('WorldsListCtrl', function($rootScope, $scope, $http, worlds, WorldsFactory, $state) {
    if ($rootScope.fromState.name === 'game' || $rootScope.fromState.name === 'builder') {
        window.location.reload();
    }

    $scope.worlds = worlds;

    $scope.currentWorld = function(world) {
        WorldsFactory.setCurrentWorld(world);
        $state.go('worlds.world', {
            id: world._id
        });
    }
});
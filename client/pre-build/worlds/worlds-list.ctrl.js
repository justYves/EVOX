app.controller('WorldsListCtrl', function($scope, $http, worlds, WorldsFactory, $state) {
    $scope.worlds = worlds;

    $scope.currentWorld = function(world) {
        WorldsFactory.setCurrentWorld(world);
        $state.go('worlds.world', {
            id: world._id
        });
    }
});
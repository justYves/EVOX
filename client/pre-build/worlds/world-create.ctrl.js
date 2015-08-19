app.controller('WorldCreateCtrl', function($scope, WorldsFactory, $state) {
    $scope.environments = ['ice', 'water', 'land'];
    $scope.ice = [10, 15, 20, 25, 30];
    $scope.water = [50, 55, 60, 65, 70];
    $scope.land = [60, 65, 70, 75, 80];

    $scope.postWorld = function() {
        WorldsFactory.postWorld($scope.world)
            .then(function() {
                $state.go('worlds')
            })
    };
})
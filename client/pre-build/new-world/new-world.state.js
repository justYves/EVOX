app.config(function($stateProvider) {
    $stateProvider.state('worlds.newWorld', {
        url: '/new',
        templateUrl: '/pre-build/new-world/new.html',
        controller: 'createWorldCtrl'
    });
});

app.controller('createWorldCtrl', function($scope, $modal, $log) {
    $scope.newWorld = function() {
        var worldInstance = $modal.open({
            animation: true,
            templateUrl: 'newWorld.html',
            controller: 'worldInstanceCtrl'
        });

        worldInstance.result.then(null, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }
    $scope.newWorld();
})

app.controller('worldInstanceCtrl', function($scope, $modalInstance, WorldsFactory, $state) {
    $scope.environments = ['ice', 'water', 'land'];
    $scope.percents = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

    $scope.postWorld = function() {
        WorldsFactory.postWorld($scope.world)
            .then(function() {
                $modalInstance.close();
                $state.go('worlds')
            })
    };

    $scope.cancel = function() {
        $state.go('worlds');
        $modalInstance.dismiss('cancel');
    };
});
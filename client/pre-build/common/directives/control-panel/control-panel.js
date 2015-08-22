app.directive('controlPanel', function() {

    return {
        restrict: 'E',
        scope: {
            creatures: "="
        },
        templateUrl: "pre-build/common/directives/control-panel/control-panel.html",
        controller: "PanelController"
    };

})
    .controller("PanelController", function($scope, AuthService, WorldsFactory) {
        AuthService.getLoggedInUser()
            .then(function(user) {
                $scope.user = user;
            })
        $scope.world = WorldsFactory.getCurrentWorld();
        $scope.points = 25;
        $scope.stats = false;
        $scope.control = true;

        $scope.controlHide = function() {
            $scope.control = !$scope.control;
        };

        $scope.statsShow = function() {
            $scope.stats = !$scope.stats;
        };
    });
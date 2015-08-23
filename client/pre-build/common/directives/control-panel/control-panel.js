app.directive('controlPanel', function() {

    return {
        restrict: 'E',
        scope: {
            creatures: "=",
            creature: "="
        },
        templateUrl: "pre-build/common/directives/control-panel/control-panel.html",
        controller: "PanelController"
    };

})
    .controller("PanelController", function($scope, AuthService, WorldsFactory, CreatureFactory) {
        AuthService.getLoggedInUser()
            .then(function(user) {
                $scope.user = user;
            })
        $scope.world = WorldsFactory.getCurrentWorld();
        $scope.points = 25;
        $scope.stats = false;
        $scope.control = true;
        $scope.creatureSelected = false;

        $scope.controlHide = function() {
            $scope.control = !$scope.control;
        };

        $scope.statsShow = function() {
            $scope.stats = !$scope.stats;
        };

        $scope.makeCreature = function() {
            if ($scope.creatureSelected) {
                CreatureFactory.$scope.creature.name.procreate();
            }
        }

        $scope.killCreature = function() {
            if ($scope.creatureSelected) {
                CreatureFactory.$scope.creature.name.die();
            }
        }
    });
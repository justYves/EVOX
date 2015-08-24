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
    .controller("PanelController", function($scope, AuthService, WorldsFactory, CreatureFactory, CameraFactory) {
        AuthService.getLoggedInUser()
            .then(function(user) {
                $scope.user = user;
            });
        $scope.world = WorldsFactory.getCurrentWorld();
        $scope.points = 25;
        $scope.stats = false;
        $scope.control = true;

        $scope.healthPercentage = function(creature) {
            $scope.creature.healthPercentage =  Math.floor(creature.hpMax / creature.hp) * 100;
        };

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
        };

        $scope.killCreature = function() {
            if ($scope.creatureSelected) {
                CreatureFactory.$scope.creature.name.die();
            }
        };

        $scope.setCreature = function(name) {
             $scope.creatures.forEach(function(creature){
                if (creature.name === name) {
                    $scope.creature = creature;
                    $scope.healthPercentage($scope.creature);
                    $scope.$digest();
                }
             });
        };

        $scope.$on("currentCreature", function(event, creature){
            $scope.creature = creature;
            $scope.healthPercentage($scope.creature);
            console.log($scope.creature.healthPercentage);
            $scope.$digest();
        });

    });
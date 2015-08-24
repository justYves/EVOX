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

        $scope.getPercentages = function(creature) {
            $scope.creature.healthPercentage =  Math.round((creature.hp / creature.hpMax) * 100);
            $scope.creature.hungerPercentage = Math.round((creature.hunger / creature.hpMax) * 100);
        };

        $scope.statsShow = function() {
            $scope.stats = !$scope.stats;
        };

        $scope.setCreature = function(name) {
             $scope.creatures.forEach(function(creature){
                if (creature.name === name) {
                    $scope.creature = creature;
                    $scope.getPercentages($scope.creature);
                    $scope.$digest();
                }
             });
        };

        $scope.fertilize = function(){
            console.log(game.map);
        };

        $scope.$on("currentCreature", function(event, creature){
            $scope.stats = true;
            $scope.creature = creature;
            $scope.getPercentages($scope.creature);
            $scope.$digest();
        });

        $scope.$on("creaturesUpdate", function(event, creatures){
            $scope.creatures = creatures;
            $scope.getPercentages($scope.creature);
            $scope.$digest();
        });

    });


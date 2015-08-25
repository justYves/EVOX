app.directive('controlPanel', function() {

    return {
        restrict: 'E',
        scope: {},
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
            $scope.creature.healthPercentage = Math.round((creature.hp / creature.hpMax) * 100);
            $scope.creature.hungerPercentage = Math.round((creature.hunger / creature.hpMax) * 100);
        };

        $scope.statsShow = function() {
            $scope.stats = !$scope.stats;
        };

        $scope.killCreature = function() {
            $scope.creature.die();
            $scope.stats = false;
        }

        //this function crashes browser!
        // $scope.procreate = function() {
        //     $scope.creature.procreate();
        // }

        $scope.fertilize = function() {
            console.log(game.map);
        };

        $scope.$on("currentCreature", function(event, creature) {
            $scope.stats = true;
            $scope.creature = creature;
            $scope.getPercentages($scope.creature);
            $scope.$digest();
        });

        $scope.$on("creaturesUpdate", function() {
            $scope.creatures = game.creatures;
            if ($scope.creature) $scope.getPercentages($scope.creature);
            $scope.$digest();
        });

    });
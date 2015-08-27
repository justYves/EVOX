app.controller('LevelController', function($scope, $state, CreatureFactory, user, MapFactory, WorldsFactory) {
    $scope.selectedCreature = undefined;
    user.levels.forEach(function(level) {
        console.log(level);
    });

    $scope.world = WorldsFactory.getCurrentWorld
    $scope.levels = user.levels;

    $scope.playLevel = function(idx) {
        var environs = ["land", "desert", "ice"];
        var world = {
            name: "Level" + (idx + 1),
            environment: environs[idx],
            flat: true,
            size: 30
        };
        WorldsFactory.postWorld(world)
        $state.go('game.level', {
            id: "55de456f922875564d86c145",
            currentLevel: idx + 1
        });
    };
    // console.log($scope.selectedCreature);
    // console.log($scope.levels);
});
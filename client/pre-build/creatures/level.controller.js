app.controller('LevelController', function($scope, $state, CreatureFactory, $stateParams, user) {
    var creatureId = $stateParams.id;
    console.log(creatureId)
    $scope.selectedCreature = undefined;
    user.creature.forEach(function(item){
        console.log(item);
        if(item._id ===creatureId);
        $scope.selectedCreature = item;
    });


    $scope.levels = [{
        name: "Level 1",
        levelNum: 1,
        img: "land-icon.png",
        completed: true
    }, {
        name: "Level 2",
        img: "desert-icon.png",
        levelNum: 2,
        completed: true
    }, {
        name: "Level 3",
        img: "ice-icon.png",
        levelNum:3,
        completed: true
    }, {
        name: "Level 4",
        img: "land-icon.png",
        levelNum:4,
        completed: false
    }, {
        name: "Level 5",
        img: "desert-icon.png",
        levelNum:5,
        completed: false
    }, {
        name: "Level 6",
        img: "ice-icon.png",
        levelNum:6,
        completed: false
    }];

    // console.log($scope.selectedCreature);
    // console.log($scope.levels);
    $scope.levels.forEach(function(level){
        level.completed = $scope.selectedCreature.levels[level.levelNum];
    });

});

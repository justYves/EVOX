app.directive('controlPanel', function() {

    return {
      restrict: 'E',
      scope: {},
      templateUrl: "pre-build/common/directives/control-panel/control-panel.html",
      controller: "PanelController"
    };

  })
  .controller("PanelController", function($scope, AuthService, WorldsFactory, CreatureFactory, CameraFactory, $q,$stateParams,$state) {
    AuthService.getLoggedInUser()
      .then(function(user) {
        $scope.user = user;
      });

    $scope.world = WorldsFactory.getCurrentWorld();
    $scope.points = 25;
    $scope.stats = false;
    $scope.creatures;

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
    };

    // this function crashes browser!
    $scope.procreate = function() {
      $scope.creature.procreate();
    };

    $scope.fertilize = function() {
      CameraFactory.setGrass(true);
      console.log(game.map);
    };

    $scope.$on("currentCreature", function(event, creature) {
      $scope.stats = true;
      $scope.creature = creature;
      $scope.getPercentages($scope.creature);
      $scope.$digest();
    });

    $scope.play = function() {
      game.play();
    };
    $scope.pause = function() {
      game.pause();
    };
    $scope.speedUp = function() {
      game.speedUp();
    };
    $scope.slowDown = function() {
      game.slowDown();
    };

    $scope.save = function() {
      var existing = [],
        isNew = [];
      game.creatures.forEach(function(creature) {
        // deleting circular reference for JSON
        delete creature.map;
        delete creature.game;
        delete creature.item;
        if (creature._id) existing.push(creature);
        else isNew.push(creature);
      })
      var allCreatures
      updateCreatureStuff(existing)
        .then(function() {
          return postCreatureStuff(isNew)
        })
        .then(function(newCreatures) {
          allCreatures = existing.concat(newCreatures);
          return JSON.stringify(game.trees);
        })
        .then(function(trees) {
          var updatedWorld = WorldsFactory.getCurrentWorld();
          updatedWorld.map = game.map;
          updatedWorld.trees = trees;
          updatedWorld.creatures = allCreatures;

          return WorldsFactory.updateWorld(updatedWorld);
        })
        .then(function() {
          $state.go('worlds');
        });
    };


    function updateCreatureStuff(arr) {
        return $q.all(arr.map(function(creature) {
            return CreatureFactory.updateCoord(creature.position)
                .then(function() {
                    return CreatureFactory.updateCoord(creature.rotation);
                });
        }));
    }

    function postCreatureStuff(arr) {
        return $q.all(arr.map(function(creature) {
            return CreatureFactory.postCoord([creature.position, creature.rotation])
                .then(function(coords) {
                    console.log('hello', coords, creature);
                    creature.position = coords[0];
                    creature.rotation = coords[1];
                    console.log(creature);
                    return CreatureFactory.postCreature(creature); //parents will be set here
                });
        }));
    }

    function updateScope() {
      $scope.creatures = game.creatures;
    };

  });
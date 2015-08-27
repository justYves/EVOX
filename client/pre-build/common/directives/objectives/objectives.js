app.directive('objectives', function() {

    return {
        restrict: 'E',
        templateUrl: "pre-build/common/directives/objectives/objectives.html",
        controller: "ObjectivesCTRL"
    };

});
app.controller('ObjectivesCTRL', function($scope) {
    $scope.objectives = ["build a creature", "eat some grass", "procreate", "procreate three times"];

});
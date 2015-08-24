app.controller('CreaturesController', function($scope, $state, CreatureFactory) {
    $scope.builder = function(slide) {
        CreatureFactory.currentHash = slide.hash;
        $state.go('builder');
    }
});
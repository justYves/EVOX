app.directive('creatureStats', function(){
	return {
		restrict: 'E',
		templateUrl: 'pre-build/common/directives/creature-stats.html',
		controller: "GameController"
	};
});
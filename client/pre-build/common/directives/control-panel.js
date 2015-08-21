app.directive('controlPanel', function(){
	return {
		restrict: 'E',
		templateUrl: 'pre-build/common/directives/control-panel.html',
		controller: "GameController"
	};
});
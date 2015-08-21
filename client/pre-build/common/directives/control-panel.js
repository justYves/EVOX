app.directive('controlPanel', function(){
	return {
		restrict: 'E',
		templateUrl: 'pre-build/common/directives/control-panel.html',
		scope: {},
		controller: "panelCTRL"
	};
});

app.controller('panelCTRL', function($scope, creatureFactory){
	$scope.game = creatureFactory.game || undefined;
});
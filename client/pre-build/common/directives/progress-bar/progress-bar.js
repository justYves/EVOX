app.directive('progressBar', function(){
	return {
		restrict: "E",
		templateUrl: 'pre-build/common/directives/progress-bar/progress-bar.html',
		controller: 'PanelController'
	}
});
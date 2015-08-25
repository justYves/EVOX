app.controller('HomeController', function($scope, $http) {
	$scope.toLogin = function() {
		$state.go('login');
	};
});
app.controller('LoginCtrl', function($scope, AuthService, $state) {
    $scope.error = null;

    $scope.sendLogin = function(loginInfo) {
        AuthService.login(loginInfo).then(function() {
            return AuthService.getLoggedInUser();
        }).then(function(user) {
            $state.go('worlds');
        }).catch(function() {
            $scope.error = 'Invalid login credentials.';
        });
    };

});
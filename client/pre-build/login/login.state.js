app.config(function($stateProvider) {
    $stateProvider.state('home.login', {
        url: 'login',
        templateUrl: '/pre-build/login/login.html',
        controller: 'loginCtrl'
    });
});

app.controller('loginCtrl', function($scope, $modal, $log) {

    $scope.open = function() {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'log.html',
            controller: 'LoginInstanceCtrl'
        });

        modalInstance.result.then(null, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.open();
});

app.controller('LoginInstanceCtrl', function($scope, $modalInstance, $modal, $state, $log, AuthService, UserFactory) {

    $scope.ok = function() {
        AuthService.login($scope.credentials).then(function() {
            return AuthService.getLoggedInUser();
        }).then(function(user) {
            UserFactory.currentUser = user;
            $modalInstance.close();
            $state.go('worlds');
        }).catch(function() {
            $scope.error = 'Invalid login credentials.';
        });
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
        $state.go('home');
    };

    $scope.goSignup = function() {
        $scope.cancel();
        $state.go('home.signup');
    }
});
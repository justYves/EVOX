app.config(function($stateProvider) {
    $stateProvider.state('home.signup', {
        url: 'signup',
        templateUrl: '/pre-build/signup/signup.html',
        controller: 'signupCtrl',

    });
});

app.controller('signupCtrl', function($scope, $modal, $log) {
    $scope.openSignup = function() {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'sign.html',
            controller: 'SignupInstanceCtrl'
        });

        modalInstance.result.then(null, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }

    $scope.openSignup();
});

app.controller('SignupInstanceCtrl', function($scope, $state, $modalInstance, UserFactory, AuthService) {

    $scope.ok = function() {
        var credentials = {
            email: $scope.newUser.email,
            password: $scope.newUser.password
        };
        UserFactory.postUser($scope.newUser)
            .then(function(user) {
                UserFactory.currentUser = user;
                return AuthService.login(credentials)
            })
            .then(function() {
                $modalInstance.close();
                $state.go('creatures.select');
            })
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
        $state.go('home');
    };
});
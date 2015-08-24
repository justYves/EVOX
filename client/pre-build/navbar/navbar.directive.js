app.directive("navbar", function(AuthService, $state, $rootScope, AUTH_EVENTS, CreatureFactory, $modal, $log) {
    return {
        restrict: "E",
        templateUrl: "/pre-build/navbar/navbar.html",
        link: function(scope, elem, attr) {
            // scope.isLoggedIn = function() {
            //     return AuthService.isAuthenticated();
            // };
            scope.logout = function() {
                AuthService.logout().then(function() {
                    $state.go('home');
                });
            };
            scope.reset = function() {
                CreatureFactory.currentHash = null;
            }

            var setUser = function() {
                AuthService.getLoggedInUser().then(function(user) {
                    scope.user = user;
                });
            };
            var removeUser = function() {
                scope.user = null;
            };

            setUser();

            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);



            scope.open = function() {

                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'login.html',
                    controller: 'LoginInstanceCtrl'
                });

                modalInstance.result.then(null, function() {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };

            scope.newWorld = function() {
                var worldInstance = $modal.open({
                    animation: true,
                    templateUrl: 'newWorld.html',
                    controller: 'worldInstanceCtrl'
                });

                worldInstance.result.then(null, function() {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            }
        }
    };
});

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

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
    };

    $scope.openSignup = function() {
        $scope.cancel();

        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'signup.html',
            controller: 'SignupInstanceCtrl'
        });

        modalInstance.result.then(null, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }
});

app.controller('SignupInstanceCtrl', function($scope, $modalInstance, UserFactory) {

    $scope.ok = function() {
        UserFactory.postUser($scope.newUser)
            .then(function(user) {
                $modalInstance.close();
            })
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});

app.controller('worldInstanceCtrl', function($scope, $modalInstance, WorldsFactory, $state) {
    $scope.environments = ['ice', 'water', 'land'];
    $scope.percents = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

    $scope.postWorld = function() {
        WorldsFactory.postWorld($scope.world)
            .then(function() {
                $modalInstance.close();
                $state.go('worlds')
            })
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});
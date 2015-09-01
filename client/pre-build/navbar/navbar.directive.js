app.directive("navbar", function(AuthService, $state, $rootScope, AUTH_EVENTS, CreatureFactory, PointerFactory) {
    return {
        restrict: "E",
        templateUrl: "/pre-build/navbar/navbar.html",
        link: function(scope, elem, attr) {

            scope.logout = function() {
                AuthService.logout().then(function() {
                    $state.go('home');
                });
            };
            scope.reset = function() {
                CreatureFactory.currentHash = null;
            };

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

        }
    };
});
app.config(function($stateProvider) {
    $stateProvider.state('multiplayer', {
        url: '/users',
        templateUrl: '/pre-build/multiplayer/multiplayer.html',
        controller: 'MultiplayerController',
        resolve: {
            user: function(AuthService) {
                if (AuthService.isAuthenticated) return AuthService.getLoggedInUser();
            },
            users: function(UserFactory) {
                return UserFactory.getUsers();
            }
        },
        data: {
            authenticate: true
        }
    })
});
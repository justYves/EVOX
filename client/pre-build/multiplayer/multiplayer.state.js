app.config(function($stateProvider) {
    $stateProvider.state('multiplayer', {
        url: '/users',
        abstract: true,
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
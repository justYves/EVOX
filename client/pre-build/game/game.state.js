app.config(function($stateProvider) {
    $stateProvider.state('game', {
        url: '/worlds/:id/play',
        templateUrl: '/pre-build/game/game.html',
        controller: 'GameController',
        resolve: {
            user: function(UserFactory) {
                return UserFactory.getUser(UserFactory.currentUser._id)
            }
        },
        data: {
            authenticate: true
        }
    });

    $stateProvider.state('game.level', {
        url: '/:currentLevel',
        templateUrl: '/pre-build/game/game.html'
    })

});
app.config(function($stateProvider) {
    $stateProvider.state('game', {
        url: '/worlds/:id/play',
        templateUrl: '/pre-build/game/game.html',
        controller: 'GameController'
    });

    $stateProvider.state('game.level', {
        url: '/:currentLevel',
        templateUrl: '/pre-build/game/game.html'
    })

});
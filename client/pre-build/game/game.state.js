app.config(function($stateProvider) {
    $stateProvider.state('game', {
        url: '/game',
        templateUrl: '/pre-build/game/game.html',
        controller: 'GameController'
    });
});
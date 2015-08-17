app.config(function($stateProvider) {
    $stateProvider.state('play', {
        url: '/play',
        templateUrl: '/pre-build/play/play.html',
        controller: 'PlayController'
    });
});
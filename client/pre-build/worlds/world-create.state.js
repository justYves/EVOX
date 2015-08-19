app.config(function($stateProvider) {
    $stateProvider
        .state('createWorld', {
            url: '/worlds/create',
            templateUrl: '/pre-build/worlds/create.html',
            controller: 'WorldCreateCtrl'
        })
});
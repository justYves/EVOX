app.config(function($stateProvider) {
    $stateProvider
        .state('worlds', {
            url: '/worlds',
            templateUrl: '/pre-build/worlds/worlds.html',
            controller: 'WorldsListCtrl',
            resolve: {
                worlds: function(WorldsFactory) {
                    return WorldsFactory.getWorlds();
                }
            },
            data: {
                authenticate: true
            }
        })
        .state('worlds.world', {
            url: '/:id',
            controller: 'OneWorldCtrl',
            templateUrl: '/pre-build/worlds/oneWorld.html',
            data: {
                authenticate: true
            }
        })
});
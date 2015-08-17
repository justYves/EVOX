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
            }
        })
        .state('worlds.world', {
            url: '/:id',
            templateUrl: '/pre-build/worlds/oneWorld.html'
        })
});
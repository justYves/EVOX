app.config(function($stateProvider) {
    $stateProvider.state('builder', {
        url: '/builder',
        templateUrl: '/pre-build/builder/builder.html',
        controller: 'BuilderController',
        data: {
            authenticate: true
        }
    });
});
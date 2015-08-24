app.config(function($stateProvider) {
    $stateProvider.state('creatures', {
        url: '/creatures',
        templateUrl: '/pre-build/creatures/creatures.html',
        controller: 'CreaturesController',
    });
});
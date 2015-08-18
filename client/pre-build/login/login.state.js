app.config(function($stateProvider) {
    $stateProvider.state('logIn', {
        url: '/login',
        templateUrl: '/pre-build/login/login.html',
        controller: 'LoginCtrl'
    });

});
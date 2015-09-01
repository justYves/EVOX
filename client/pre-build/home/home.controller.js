app.controller('HomeController', function($rootScope, $state) {
    if ($rootScope.fromState.name === 'game' || $rootScope.fromState.name === 'builder') {
        window.location.reload();
    }
})
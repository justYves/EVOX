app.config(function($stateProvider) {
    $stateProvider.state('creatures', {
        url: '/creatures',
        templateUrl: '/pre-build/creatures/creatures.html',
        controller: 'CreaturesController',
        resolve: {
            user: function($http, UserFactory) {
                return $http.get('/api/users/' + UserFactory.currentUser._id)
                    .then(function(res) {
                        return res.data;
                    })
            }
        }
    });
});
app.config(function($stateProvider) {
    $stateProvider
    .state('creatures',{
        url:'/creatures',
        templateUrl: '/pre-build/creatures/index.html',
        controller: 'CreaturesController',
        resolve: {
            user: function($http, UserFactory) {
                return $http.get('/api/users/' + UserFactory.currentUser._id)
                    .then(function(res) {
                        return res.data;
                    })
            }
        }
    })
    .state('creatures.select', {
        url: '/select',
        templateUrl: '/pre-build/creatures/creatures.html',

    })
    .state('creatures.level',{
        url:'/level/{id}',
        templateUrl:'/pre-build/creatures/level.html',
        controller: "LevelController"
    });
});
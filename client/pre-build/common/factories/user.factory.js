app.factory('UserFactory', function($http) {
    return {
        postUser: function(user) {
            return $http.post('/api/users', user)
                .then(function(res) {
                    return res.data
                })
        }
    };
});
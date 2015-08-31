app.factory('UserFactory', function($http) {
    return {
        getUser: function(id) {
            return $http.get('/api/users/' + id)
                .then(function(res) {
                    return res.data
                })
        },
        getUsers: function() {
            return $http.get('/api/users')
                .then(function(res) {
                    return res.data
                })
        },
        postUser: function(user) {
            return $http.post('/api/users', user)
                .then(function(res) {
                    return res.data
                })
        }, //currentUser set in navbar directive
        updateUser: function(user) {
            return $http.put('/api/users/' + user._id, user)
        }
    };
});
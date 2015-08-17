app.factory('WorldsFactory', function($http) {
    return {
        getWorlds: function() {
            return $http.get('/api/worlds')
                .then(function(res) {
                    return res.data;
                })
        },
        getWorld: function(id) {
            return $http.get('/api/worlds/' + id)
                .then(function(res) {
                    return res.data;
                })
        },
        postWorld: function(world) {
            return $http.post('/api/worlds', world)
                .then(function(res) {
                    return res.data;
                })
        },
        updateWorld: function(id) {
            return $http.put('/api/worlds/' + id)
                .then(function(res) {
                    return res.data;
                })
        },
        removeWorld: function(id) {
            return $http.delete('/api/worlds/' + id)
                .then(function(res) {
                    return res.data;
                })
        }
    }
})
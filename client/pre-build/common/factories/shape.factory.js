app.factory('ShapeFactory', function($http, AuthService, UserFactory) {
    return {
        getShape: function(name, shape) {
            if (shape) {
                return $http.get('/api/shapes/id/' + id)
                    .then(function(res) {
                        return res.data;
                    });
            } else {
                return $http.get('/api/shapes/' + name)
                    .then(function(res) {
                        return JSON.parse(res.data);
                    });
            }
        },
        getMany: function(arr) {
            return $http.post('/api/shapes/many', arr)
                .then(function(res) {
                    return res.data
                })
        },
        saveShape: function(data, creature) {
            data.shape = JSON.stringify(data.shape);
            var tempCreatureId, tempShapeId;
            return $http.post('/api/shapes', data)
                .then(function(res) {
                    return res.data._id;
                })
                .then(function(shapeId) {
                    tempShapeId = shapeId;
                    creature.shape = shapeId;
                    return $http.post('/api/creatures/', creature)
                })
                .then(function(res) {
                    tempCreatureId = res.data._id;
                    return AuthService.getLoggedInUser();
                })
                .then(function(user) {
                    var obj = {
                        creature: tempCreatureId,
                        shape: tempShapeId
                    }
                    return $http.put('api/users/' + user._id + '/creatures', obj);
                })
                .then(function() {
                    return "update succesfull";
                });
        },
        updateShape: function(data) {
            data.user = UserFactory.currentUser._id;
            var shapeId = data.shape._id
            data.shape.shape = JSON.stringify(data.shape.shape);
            var creature;
            return $http.put('/api/shapes/' + shapeId, data)
                .then(function(res) {
                    return res.data._id;
                })
                .then(function() {
                    return "update succesfull";
                });
        },
        updateDefault: function(shape) {
            return $http.put('/api/shapes/default/' + shape._id, shape)
                .then(function(res) {
                    return res.data
                })
        }
    };
});
app.factory('ShapeFactory', function($http) {
    return {
        getShape: function(name) {
            return $http.get('/api/shapes/'+name)
                .then(function(res) {
                    return JSON.parse(res.data);
                    console.log(res.data);
                });
        }
    };
})
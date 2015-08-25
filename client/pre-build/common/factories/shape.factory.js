app.factory('ShapeFactory', function($http,AuthService) {
    return {
        getShape: function(name) {
            return $http.get('/api/shapes/'+name)
                .then(function(res) {
                    return JSON.parse(res.data);
                    console.log(res.data);
                });
        },
        saveShape: function(data) {
          data.shape = JSON.stringify(data.shape);
          var creature;
            return $http.post('/api/shapes',data)
              .then(function(res){
                return res.data._id;
              })
              .then(function(creatureId){
                creature = creatureId
                return  AuthService.getLoggedInUser();
              })
              .then(function(user){
                console.log(user._id);
                return $http.put('api/users/'+ user._id+'/creatures',{creature: creature});
              })
              .then(function(){
                return "update succesfull";
              });
        }
    };
});
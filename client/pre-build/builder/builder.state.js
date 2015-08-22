app.config(function($stateProvider) {
    $stateProvider.state('builder', {
      url: '/builder',
      templateUrl: '/pre-build/builder/builder.html',
      controller: 'BuilderController',
      // resolve: {
      //   user: function(AuthService) {
      //     if(AuthService.isAuthenticated) return AuthService.getLoggedInUser();
      //   }
      // }
  });
});
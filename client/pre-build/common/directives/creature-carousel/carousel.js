app.directive('creatureCarousel', function(UserFactory) {

    return {
        restrict: 'E',
        scope: {
            fcn: "=",
            height: '=',
            width: '=',
            slides: '=',
            file: '=',
            showLevel: '='
        },
        link: function(scope, elem, attr) {
            scope.isAdmin = UserFactory.currentUser.isAdmin;
            scope.creatures = [];
            for (var i = 0; i < scope.slides.length; i += 3) {
                scope.creatures.push(scope.slides.slice(i, i + 3));
            };
            if (!scope.creatures.length) {
                scope.creatures = [
                    []
                ];
                scope.add = true;
            }
            scope.creatures = scope.creatures.reverse();
            scope.myInterval = 0;
            scope.noWrapSlides = false;
        },
        templateUrl: "pre-build/common/directives/creature-carousel/carousel.html"
    };

})
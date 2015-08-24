app.directive('creatureCarousel', function() {

    return {
        restrict: 'E',
        scope: {
            fcn: "=",
            height: '=',
            width: '=',
            slides: '=',
            file: '='
        },
        link: function(scope, elem, attr) {
            scope.creatures = [];
            for (var i = 0; i < scope.slides.length; i += 3) {
                scope.creatures.push(scope.slides.slice(i, i + 3));
            };
            console.log(scope.creatures);
            scope.myInterval = 0;
            scope.noWrapSlides = false;
        },
        templateUrl: "pre-build/common/directives/creature-carousel/carousel.html"
    };

})
app.controller('CreaturesController', function($scope, $state, CreatureFactory, user, shapes) {
    $scope.mySlides = user.creature;

    function findMatch(arr, name) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].name === name) return {
                _id: arr[i]._id,
                hash: arr[i].hash
            }
        };
    }

    $scope.slides = [{
        name: 'beaver',
        vision: 3,
        category: 'small',
        size: 3,
        shape: findMatch(shapes, 'beaver')
    }, {
        name: 'chick',
        vision: 1,
        category: 'small',
        size: 1,
        shape: findMatch(shapes, 'chick')
    }, {
        name: 'crocodile',
        vision: 5,
        category: 'medium',
        size: 4,
        shape: findMatch(shapes, 'crocodile')
    }, {
        name: 'deer',
        vision: 4,
        category: 'medium',
        size: 7,
        shape: findMatch(shapes, 'deer')
    }, {
        name: 'duck',
        vision: 1,
        category: 'small',
        size: 2,
        shape: findMatch(shapes, 'duck')
    }, {
        name: 'elephant',
        vision: 4,
        category: 'large',
        size: 8,
        shape: findMatch(shapes, 'elephant')
    }, {
        name: 'fox',
        vision: 5,
        category: 'medium',
        size: 3,
        shape: findMatch(shapes, 'fox')
    }, {
        name: 'lion',
        vision: 6,
        category: 'large',
        size: 5,
        shape: findMatch(shapes, 'lion')
    }, {
        name: 'penguin',
        vision: 2,
        category: 'small',
        size: 2,
        shape: findMatch(shapes, 'penguin')
    }, {
        name: 'pigeon',
        vision: 1,
        category: 'small',
        size: 2,
        shape: findMatch(shapes, 'pigeon')
    }, {
        name: 'turtle',
        vision: 10,
        category: 'small',
        size: 4,
        shape: findMatch(shapes, 'turtle')
    }, {
        name: 'wolf',
        vision: 6,
        category: 'medium',
        size: 6,
        shape: findMatch(shapes, 'wolf')
    }];

    $scope.builder = function(slide) {
        CreatureFactory.currentCreature = slide;
        console.log(slide)
        $state.go('builder');
    };


})
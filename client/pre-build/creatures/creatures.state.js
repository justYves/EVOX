app.config(function($stateProvider) {
    $stateProvider
        .state('creatures', {
            url: '/creatures',
            templateUrl: '/pre-build/creatures/index.html',
            controller: 'CreaturesController',
            resolve: {
                user: function(UserFactory) {
                    return UserFactory.getUser(UserFactory.currentUser._id)
                },
                shapes: function(ShapeFactory) {
                    var arr = ['beaver', 'chick', 'crocodile', 'deer', 'duck', 'elephant',
                        'fox', 'lion', 'penguin', 'pigeon', 'turtle', 'wolf'
                    ];
                    return ShapeFactory.getMany(arr)
                },
                worlds: function(WorldsFactory) {
                    return WorldsFactory.getWorlds();
                }
            },
            data: {
                authenticate: true
            }
        })
        .state('creatures.select', {
            url: '/select',
            templateUrl: '/pre-build/creatures/creatures.html',

        })
        .state('creatures.level', {
            url: '/level/{id}',
            templateUrl: '/pre-build/creatures/level.html',
            controller: "OneWorldCtrl"
        });
});
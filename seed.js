var mongoose = require('mongoose');
var startDb = require('./server/db');
var Promise = require('bluebird');
var chalk = require('chalk');
var shape = require('./shape');

// Models
var Cell = mongoose.model('Cell');
var CellRow = mongoose.model('CellRow');
var Coordinate = mongoose.model('Coordinate');
var Creature = mongoose.model('Creature');
var Shape = mongoose.model('Shape');
var User = mongoose.model('User');
var World = mongoose.model('World');

var shapes = [];
for (var key in shape) {
    if (typeof shape[key] !== "function") {
        var newShape = new Shape({
            name: key,
            shape: JSON.stringify(shape[key])
        });
        shapes.push(newShape);
    }
}

// var cow = new Creature({
//   name: 'cow',
//   size: 5,
//   vision: 3
// });
// map.creatures.push(cow);

// var basic = new Creature({
//   name: 'basic',
//   size: 2,
//   vision: 3
// });
// map.creatures.push(basic);


// var spider = new Creature({
//   name: 'spider',
//   size: 3,
//   vision: 5
// });
// map.creatures.push(spider);

function findMatch(arr, name) {
    var id;
    arr.forEach(function(elem) {
        if (elem.name === name) id = elem._id;
    })
    return id;
}

var creatures = [];

var elephant = new Creature({
    shape: findMatch(shapes, 'elephant'),
    name: 'elephant',
    size: 10,
    vision: 3
});
creatures.push(elephant);

var giraffe = new Creature({
    shape: findMatch(shapes, 'giraffe'),
    name: 'giraffe',
    size: 7,
    vision: 5
});
creatures.push(giraffe);

var fox = new Creature({
    shape: findMatch(shapes, 'fox'),
    name: 'fox',
    size: 3,
    vision: 5
});
creatures.push(fox);

var lion = new Creature({
    shape: findMatch(shapes, 'lion'),
    name: 'lion',
    size: 6,
    vision: 6
});
creatures.push(lion);

var turtle = new Creature({
    shape: findMatch(shapes, 'turtle'),
    name: 'turtle',
    size: 1,
    vision: 2
});
creatures.push(turtle);

var penguin = new Creature({
    shape: findMatch(shapes, 'penguin'),
    name: 'penguin',
    size: 2,
    vision: 3
});
creatures.push(penguin);

var deer = new Creature({
    shape: findMatch(shapes, 'deer'),
    name: 'deer',
    size: 5,
    vision: 3
});
creatures.push(deer);

var chick = new Creature({
    shape: findMatch(shapes, 'chick'),
    name: 'chick',
    size: 1,
    vision: 1
});
creatures.push(chick);

var wildDog = new Creature({
    shape: findMatch(shapes, 'wildDog'),
    name: 'wildDog',
    size: 3,
    vision: 5
});
creatures.push(wildDog);

var crocodile = new Creature({
    shape: findMatch(shapes, 'crocodile'),
    name: 'crocodile',
    size: 4,
    vision: 3
});
creatures.push(crocodile);

var beaver = new Creature({
    shape: findMatch(shapes, 'beaver'),
    name: 'beaver',
    size: 2,
    vision: 2
});
creatures.push(beaver);

var pigeon = new Creature({
    shape: findMatch(shapes, 'pigeon'),
    name: 'pigeon',
    size: 1,
    vision: 3
});
creatures.push(pigeon);

var duck = new Creature({
    shape: findMatch(shapes, 'duck'),
    name: 'duck',
    size: 2,
    vision: 3
});
creatures.push(duck);



var users = [
    new User({
        name: {
            first: 'Justin',
            last: 'Kim'
        },
        email: 'jkim430@gmail.com',
        password: 'cowgoesmoo',
        isAdmin: true
    }),
    new User({
        name: {
            first: 'Charles',
            last: 'Darwin'
        },
        email: 'darwin@gmail.com',
        password: 'evolution',
        isAdmin: false
    })
]


var models = [Shape, Creature, User];
var data = [shapes, creatures, users];

startDb.then(function() {
    return Promise.all(models.map(function(model) {
        return model.find().remove()
    }))
})
    .then(function(shapes) {
        return Promise.all(models.map(function(model, index) {
            return model.create(data[index]);
        }))
    })
    .then(function() {
        console.log(chalk.green('Database seeded. Goodbye!'));
        process.exit(0);
    });
module.exports = function(done) {

    var mongoose = require('mongoose');
    var Promise = require('bluebird');
    var chalk = require('chalk');
    var shape = require('./testshape');

    // Models
    var Creature = mongoose.model('Creature');
    var Shape = mongoose.model('Shape');
    var User = mongoose.model('User');
    var World = mongoose.model('World');
    var Level = mongoose.model('Level');

    var shapes = [];
    var hashes = {
        fox: '#C/2ecc713498db34495ee67e22ecf0f1:A/fkikkShYfYfYfYfaihYffhhffYfYiYdahhYhbfhfYhdffiYhadediifYhcehYhYhYhddffYjdhfiYbVhfUhclfUhSfYfYfYfYfYfVhfYhcfhYhcjfYhcfhYhVcicbfUhVhfYlabfaihSfaihYfSfaehSfUhYhYhYhYhUfUfYbUickfWfhYfYfYfSfYhYhYhdhfhafhYfYfYfaffYkYfYfYffjjffYfYfchdYfcfhUhYjSfWfhYeYhSfWhhYfSfYhSfUhSfahiSfadiSfYhSfahhehedSfedfhUhehfjSfSfSfSfahkSfSfSfSfWhiSfSfSfaflSfSfSfSfSfWhiSfSfaflSfSfSfSfSfehhjSfafiSfSfSfSfeifjSfSfSfahkSfSfUhWffUhafhSfahfUfUfadhehffYhehjjUeYdSdfjfmhSfUhaffYhUfSfSdShThfSdSfWhhSfWhhSfWhhSfadhaifYfYfeifhUeYfahfYfehhhSfYfchhafhSfafhSfWfhSfWfhSfTihShSiShShShWhfSffhideSfahfThhaffaheYfahfYfSfYhSfYfTffZhhTffYfahfYffhfmhSfSfSfafjSfSfSfSfZhfSfSfYfShfidnhUfYdUhWfnUhcjfUh',
        lion: '#C/e83a98b0732c273645e67e22ecf0f18f2121ebce36:A/ehjaShaefUhYfYiUfYeShUhcifYfUhYhafeeefhShekijcdeYfUhYhYhYhYhcefYhYhcfiYfeehjShYlcbdUhUhcleUhUheeeaafhchhefffYfehhhcffUhSfeifkUhUhefefUhWfhUhYfUhShcieYfYfchhYhWfhYfYfchhYfchhYfchheideShWhfUhWfhUhWfhUfUicffWhfehhhWddUhUhcehejeiUfacfSfUhYfUhShUeShUhUhYlcaeShUhSfUhShXchhYhYhYhYhYhYhYhYhYXUhUhUhUhUhUhcpbUhUhUhUhUhfceffcehYiaeefecjhQUhchfYjYhYhYhcfhYfYfYecehQShehffchhYfefhhahfWfhYhahfYhYhYhchfUhUhUhYfYfYfYfYfYfchfQShahfYhYhYhafhYfacfQUhchhYhYhWfhUhchfWhfYhYhafhYhahfYZcmhYfYfYfYfYfYfejdhclhcffUdchfcekcdjcfeYfYeUfchhUhYhUbYhchfciiYhUfchkUhYdcfbccfcmjYhYhUfchfUhUhUhcajckecchcfecfeYiYicheUhYfUfYjYfYachicffYfUhUhcjdYfcklfddhfYjYfYfcfhUhUhYjUfUfcfiaehUfUfYhYhUfYfYfeiihYfcffYhYhUfYfYfeffeYiYfYiYhcchUhUhUhdmdhUhUhYZUfUfUfcfjUecheYhYhYhYhYhYhchhefldYfYfYfYfYfajfYfYfYjaffYffecfffdekhShUhSfUhShUhSfUhShUhSfUhaifahfahfahffhepfYfaffaiiYfaffUfYhYhffiiichfbefeXhhiYicefYhUffffejYhYhcefYhYhXmccehhfYfYfYfYfejffYfYfahfaciYoeZeicmcUhUhUhUheeicYeahfWhhShcifYccjhYeSiYhYhefehYhYhcfhYecffWhfYfcefchhcihckfUhchfYhcYfYpfdfjhYcficijYfYifheSfYhYbaenYnYhfYijdUifhcWjfjoddfifulYfYdbhfbThlehffWdeehhhcffUhShUhShUhehefeeiiYhehffUhShadhYhYhYhYhachYhYhYhYhachUfUfYhcjhUfYfedfcShShWfhShekheWfhSheefeYhYhYdYfShYhYhYhYhShYfYfYfYfeihcShaffShaffShShWkeUfUfShUhShUfWhhUfckhSfSfSfUhWeiSfSfSjWfeSfWfiaffSfahhSfeiebWhhSfWhhSfUhShUhSfUhShUhabfYhYhYhYhYhadfYhYhecffYhYhUhYhYhWffYbYhcfhYhYhYhYhYhYaahiahfYfYfShShShYfSfUaUhchfThefjkWiUhUhUhejeoSfWffShShWfeSiSfWfhSfSfWejUhfchibYhbjelWfhUheaffelhhYfahfSfSfSfSfSfSfSfSfafoSfSfSfYfahfSfSfYfahfSfafhafoSfSfSfSfSfSfSfaheafhaflSfSfSfSfSfSfYhaemahhafeSiahiSfYfShYfSfWhhSfWhhSfUhShahcShShchfaffSfSiUfSfSfakfahfShefhfahhSfWhhYcYhYhYhahdShShaffShSeafhWfhcfhYhaffafhSfWeiSfWhhSeShSeSfeffhShWffShehffYfchfYfeljfYfYfYfYfchhYiYhUhYfYfShYfSfYfShckfShehffShUfSfcfeYhUhShaffaaoahZYhYkabnfkjnfYfYfXfhfYi',
        turtle: "#C/2ecc710c822d34495ee67e22ecf0f100000058a8328c5b11614612000000a66a11:A/bphhVhlTfkTfeTffTfjXhjdSdThhThiSdTleVhfTfjTfeXfjZUhWfhUhcffYfYfYfajfYfYfYfSiejhfYfYfYfSfYiYhYebffmVfhVeZVhlTfkTfeTffTfjXhjdTfjTfeWhhThiXfddTfjbjleYfYfaifYfYfcifYfYfaifYfYfSfSfahhYhSfYfehikYfYfVhfYiXffhYfYfeiffYfYfchhYhYeXhhiYibefeYiafhThifidbcYcdkfbYcehioYhYhYhdchjYkZdlZhYZhoVhbYhYcYhZhiaifSfachSfahhSfahhSfYhShVhbSfaehYhaffYhfhdcnYfYfaifYfYffhiifeiffYcbkfhYcaihYfYiUhYeZhiXffeUhchfYedihfYefiffjYeZhechfYfYfdhfZSfVhpZfdYifffff",
    }
    for (var key in shape) {
        var newShape = new Shape({
            name: key,
            shape: JSON.stringify(shape[key]),
            hash: hashes[key]
        });
        shapes.push(newShape);
    }

    function findMatch(arr, name) {
        var id;
        arr.forEach(function(elem) {
            if (elem.name === name) id = elem._id;
        })
        return id;
    }

    var creatures = [];

    var God = new Creature({
        name: 'God'
    })
    creatures.push(God);

    var Darwin = new Creature({
        name: 'Darwin'
    })
    creatures.push(Darwin);

    var turtle = new Creature({
        shape: findMatch(shapes, 'turtle'),
        name: 'turtle',
        category: 'small',
        size: 1,
        vision: 2
    });
    creatures.push(turtle);

    var fox = new Creature({
        shape: findMatch(shapes, 'fox'),
        name: 'fox',
        category: 'medium',
        isHerbivore: false,
        size: 3,
        vision: 5
    });
    creatures.push(fox);

    var lion = new Creature({
        shape: findMatch(shapes, 'lion'),
        name: 'lion',
        category: 'large',
        isHerbivore: false,
        size: 6,
        vision: 6
    });
    creatures.push(lion);

    var levels = [
        new Level({
            number: 1,
            objectives: [{
                text: 'eat grass',
                completed: false
            }, {
                text: 'eat grass 3X',
                completed: false
            }, {
                text: 'procreate',
                completed: false
            }, {
                text: 'procreate 3x',
                completed: false
            }],
            available: true,
            img: "land-icon.png"
        }),
        new Level({
            number: 2,
            objectives: [{
                text: 'eat an animal',
                completed: false
            }, {
                text: 'eat 5 animals',
                completed: false
            }, {
                text: 'procreate',
                completed: false
            }, {
                text: 'procreate 3x',
                completed: false
            }],
            available: false,
            img: "desert-icon.png"
        }),
        new Level({
            number: 3,
            available: false,
            img: "ice-icon.png"
        }),
        new Level({
            number: 4,
            available: false,
            img: "land-icon.png"
        }),
        new Level({
            number: 5,
            available: false,
            img: "desert-icon.png"
        }),
        new Level({
            number: 6,
            available: false,
            img: "ice-icon.png"
        })
    ];

    var users = [
        new User({
            name: {
                first: 'Charles',
                last: 'Darwin'
            },
            email: 'darwin@gmail.com',
            password: 'evolution',
            isAdmin: false,
            levels: levels,
            creature: [{
                creature: creatures[2],
                shape: shapes[2]
            }]
        })
    ];

    var worlds = [
        new World({
            name: 'Test World',
            map: 'this should be a stringified array of cells',
            creatures: [creatures]
        })
    ]

    var models = [Shape, Creature, User, Level, World];
    var data = [shapes, creatures, users, levels, worlds];

    Promise.all(models.map(function(model) {
        return model.find().remove()
    }))
        .then(function() {
            return Promise.all(models.map(function(model, index) {
                return model.create(data[index]);
            }))
        })
        .then(function() {
            done();
        })
        .then(null, function(err) {
            done(err)
        });

}
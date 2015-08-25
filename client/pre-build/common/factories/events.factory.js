app.factory('EventsFactory', function($rootScope) {
    function setEvent(game) {
        // var cow = creatures.cow[0];

        //Notified that an Creature is eating grass at position x,z
        // game.on('eat', function(x, z, creature) {
        //     // console.log(x, z);
        //     // if(creature.isHerbivore){
        //     //     map.empty(creature.food.x, creature.food.z);
        //     // }
        //     // else{
        //         console.log('die event', creature.name)
        //         creature.die();
        //     // }
        // });

        //Creature is procreating
        game.on('procreate', function(x, z, type) {
            console.log(type);
        });
        game.on('speed', function() {
            console.log(game.speed);
        });

        game.on('speed2', function() {
            console.log(speed);
        });



        // <------ TICK ------>
        //Game.add Event takes a function that will be called at every 10 game time unit.
        game.map.growGrass(game);
        game.addEvent(function() {
            game.map.growGrass(game);
        }, 10);

    }
    return {
        startLoop: setEvent
    };
});

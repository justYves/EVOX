app.factory('TimeFactory', function() {
    function setTick(game, opt) {

        var nextTick;
        var paused = false;
        game.events = []; //store events
        game.speed = 1000; //1ms -> this is the basic unit
        game.time = 0;
        game.day = 1;
        game.year = 1;
        processTick(); //start the tick process

        game.addEvent = function(func, unit, id) {
            this.events.push({
                func: func,
                unit: unit * 100,
                elapsed: 0,
                id: id
            });
        };

        game.removeEvent = function(id) {
            game.events.forEach(function(eventObj, index) {
                if (eventObj.id === id) {
                    game.events.splice(index, 1);
                }
            });
        };

        //save dates
        game.addEvent(function() {
            if (++game.time === 24) {
                game.time = 0;
                if (++game.day % 365 == 0) {
                    ++game.year;
                    game.day = 1;
                }
            }
        }, 15);
var i = 0;
game.addEvent(function(){
    console.log(++i);
},1)

        function processTick() {
            game.events.forEach(function(event, index) {
                event.elapsed++;
                if (event.elapsed > event.unit) {
                    event.elapsed -= event.unit;
                    event.func();
                }
            });
            console.log(game.speed);
            nextTick = game.setTimeout(processTick, game.speed / 100);
        }

        game.setSpeed = function(unit) {
            this.speed = unit * 1000;
        };

        game.speedUp = function() {
            this.speed /= 2;
            console.log("game speed: " + 1 / game.speed * 1000 + 'X');
        };

        game.slowDown = function() {
            this.speed *= 2;
            console.log("game speed: " + 1 / game.speed * 1000 + 'X');
        };

        game.resetSpeed = function() {
            this.speed = 1000;
            console.log("game speed: 1X");
        };

        game.pause = function() {
            if (!paused) {
                console.log("game paused");
                nextTick(); //the game.setTimeout returns a delete itself function. see voxel-engine/modules/tic/index.js
                paused = !paused;
            }
        };

        game.play = function() {
            if (paused)
                console.log("game resumed");
            processTick();
            paused = !paused;
        }

        game.getDate = function() {
            console.log("Day " + game.day + " of Year " + game.year)
        }

        game.getTime = function() {
            console.log("Current Time: " + game.time + "h.")
        }
    }

    /* Event loop settings */
    function setEvent() {
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
        game.addEvent(function() {
            game.map.growGrass(game);
        }, 10);
        game.creatures.forEach(function(creature) {
            console.log('exists creature ', creature);

            console.log('exists creature item', creature.item);
            console.log('exists creature item avatar', creature.item.avatar);
            console.log('exists creature avatar id', creature.item.avatar.id);

            game.addEvent(function() {
                creature.exist();
            }, creature.speed, creature.item.avatar.id);
        });
    }

    return {
        setTick: setTick,
        setEvent: setEvent
    }
})
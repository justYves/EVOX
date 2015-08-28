app.factory('BehaviorFactory', function(MoveWorker, utilitiesFactory, $rootScope, $timeout) {
    //Creature constructor
    function Creature() {};

    var stateIcon = {
        dead: 'dead.png',
        normal: '',
        food: 'dead.png',
        hunting: 'look.png',
        procreating: 'love.png',
        eating: 'eating.png',
        herd: 'herd.png',
        fight: 'attack.png'
    };

    Creature.prototype.changeState = function(state) {
        if (!!this.isFood) return;
        if (this.state === state) return;
        this.state = state;
        this.updateSprite();
        // console.log(this.state);
    };

    Creature.prototype.updateSprite = function() {
        if(this.state ==="dead") return;
        this.sprite.material.map = this.game.THREE.ImageUtils.loadTexture("../textures/" + stateIcon[this.state]);
        console.log(this.name, this.state);
    };

    Creature.prototype.setPosition = function(x, y, z) {
        parseXYZ(x, y, z);
        this.position.y = y;
        this.position.x = x + 0.5;
        this.position.z = z + 0.5;
    };

    Creature.prototype.die = function() {
        this.changeState('dead');
        this.alive = false;
        // this.dieAnimation();
            var self = this;
        // setTimeout(function(){
            var ind;
            //Delete the creature from the game creatures
            self.game.creatures.forEach(function(creature, index) {
                if (self.item.avatar.id === creature.item.avatar.id) {
                    ind = index;
                    self.game.creatures.splice(ind, 1);
                }
            });
            self.game.removeEvent(self.item.avatar.id); self.game.scene.remove(self.item.avatar); self.game.removeItem(self);
        // }, 10000)
};

Creature.prototype.dieAnimation = function() {
    var x = this.sprite.position.x;
    var y = this.sprite.position.y;
    var z = this.sprite.position.z;
    this.sprite.position.set(x, z, -y);
    this.item.forces.y = 0;
    this.rotation.x = (this.position.x > 0) ? -Math.PI / 2 : Math.PI / 2;
    this.rotation.z = (this.position.y < 0) ? -Math.PI / 2 : Math.PI / 2;
};

Creature.prototype.procreate = function() {
    this.changeState("procreating");
    var newCreature = new this.constructor(this.game, {
        name: this.name,
        size: this.size,
        vision: this.vision,
        social: this.social,
        isHerbivore: this.isHerbivore,
        spawnPos: {
            x: this.position.x - 0.5,
            z: this.position.z - 0.5
        }
    }, voxel, voxelMesh);
};

Creature.prototype.move = function(x, y, z) {
    var data = {
        x: x,
        y: y,
        z: z,
        currentX: this.position.x,
        currentY: this.position.y,
        currentZ: this.position.z,
        size: this.map.size
    };
    if (!this.game.flat) {
        if (this.game.getBlock(x, 1, z) && this.game.map.getCell(x, 0, z).obstructed) {
            if (data.currentX < data.x) {
                data.x += 1;
            } else {
                data.x -= 1;
            }
        }
    } else if (this.game.map.getCell(x, 0, z).obstructed) {
        if (data.currentX < data.x) {
            data.x += 1;
        } else {
            data.x -= 1;
        }
    }
    var myWorker = new Worker(MoveWorker);
    myWorker.postMessage(data);
    var self = this;
    myWorker.onmessage = function(result) {
        var y = result.data.y;
        var x = result.data.x - 0.5;
        var z = result.data.z - 0.5;
        var block = self.game.getBlock(result.data.x - 0.5, self.position.y, result.data.z - 0.5);
        if (!self.game.flat) {
            if (x > 0 && x < self.game.map.size - 1 && z > 0 && z < self.game.map.size - 1) {
                if (block && self.game.map.getCell(x, self.position.y, z).legit) {
                    self.position.y = self.position.y + 2;
                    self.position.x = result.data.x;
                    self.position.z = result.data.z;
                } else {
                    self.position.y = result.data.y;
                    self.position.x = result.data.x;
                    self.position.z = result.data.z;
                }
            } else {
                self.position.y = result.data.y;
                self.position.x = result.data.x;
                self.position.z = result.data.z;
            }
        } else {
            self.position.y = result.data.y;
            self.position.x = result.data.x;
            self.position.z = result.data.z;
        }
        self.rotation.y = Number(result.data.rotY) || self.rotation.y;
    };
};

Creature.prototype.moveRandomly = function(amt) {
    // this.changeState('normal');
    var x = Math.round((Math.random() * amt) - amt / 2);
    var z = Math.round((Math.random() * amt) - amt / 2);
    this.move(x, 0, z);
};


Creature.prototype.jump = function(x) {
    if (x === undefined) x = 1;
    this.move(0, x, 0);
};


Creature.prototype.lookAt = function(obj) {
    var a = obj.position || obj;
    var b = this.position;

    this.rotation.y = Math.atan2(a.x - b.x, a.z - b.z) + Math.random() * 1 / 4 - 1 / 8;
};

// Creature.prototype.notice = function(target, opts) {
//     var self = this;
//     if (!opts) opts = {};
//     if (opts.radius === undefined) opts.radius = 500;
//     if (opts.collisionRadius === undefined) opts.collisionRadius = 25;
//     if (opts.interval === undefined) opts.interval = 1000;
//     var pos = target.position || target;

//     return setInterval(function() {
//         var dist = self.position.distanceTo(pos);
//         if (dist < opts.collisionRadius) {
//             self.emit('collide', target);
//         }

//         if (dist < opts.radius) {
//             self.noticed = true;
//             self.emit('notice', target);
//         } else {
//             self.noticed = false;
//             self.emit('frolic', target);
//         }
//     }, opts.interval);
// };



Creature.prototype.moveTowardsObjective = utilitiesFactory.moveToEat;

Creature.prototype.herd = function() {
    this.changeState('herd');
    var x = this.position.x - 0.5;
    var z = this.position.z - 0.5;
    var currentPos = [x, z]
    var foundNeighbor = false;
    var min;
    // var nearestNeighbor;
    //finding the closest neighbor cell
    var nearest = utilitiesFactory.findCreature(this.game.creatures, currentPos, this.vision, this);
    // console.log('HEARD NEAREST',nearest);
    if (nearest) {
        var dist = utilitiesFactory.distance(currentPos, nearest.position);
    }
    if (nearest && dist > this.social && nearest.name === this.name) {
        //move towards herd

        // console.log('just herdin');
        this.move(step(x, nearest.position.x - 0.5), 0, step(z, nearest.position.z - 0.5));
    } else {
        this.moveRandomly(2);


    }
};

Creature.prototype.exist = function() {
    if (this.alive || this.state !== 'dead') {
        // if (this.spawner) {
        //     // console.log("spawner", this.name)
        //     this.game.map.fertilized.push(this.game.map.getCell(this.position.x - 0.5, this.position.y - 1, this.position.z - 0.5));
        // }
        this.growOld();
        this.getHungry();
        // console.log("NAME: " + this.name + ", Hunger: " + this.hunger + ", HP: " + this.hp);
    } else {
        this.changeState('dead');
    }
};

Creature.prototype.growOld = function() {
    this.age++;
    if (this.age < this.maturity) {
        this.item.avatar.scale.x *= 1.01;
        this.item.avatar.scale.y *= 1.01;
        this.item.avatar.scale.z *= 1.01;
    }
    this.lifeCycle--;
    if (this.lifeCycle === 0) {
        // console.log(this.name + ' is procreating');
        if (Math.random() < 0.2) {
            this.procreate();
            this.lifeCycle = this.size * 4;
        }
    }
};


Creature.prototype.getHungry = function() {
    if (this.hunger <= this.hpMax && this.appetite >= 2) {
        this.hunger += 3;
    } else if (this.hunger <= this.hpMax) {
        this.hunger++
    }

    if (this.hunger >= Math.floor(this.hpMax) && this.hunger > 0) this.hp--;
    if (this.hp <= 0 || this.age > this.deathAge) this.die();

    if (this.hunger >= Math.floor(this.hp / 2)) {
        // console.log(this.name + " is looking for food");
        this.getFood();
    } else {
        // console.log(this.name + " is herding");
        this.herd();
    }
}

/**** Eating behavior *****/
Creature.prototype.getFood = function() {
    this.changeState('hunting');
    var x = this.position.x - 0.5;
    var z = this.position.z - 0.5;
    var currentPos = [x, z];
    var min;
    var closestCell;
    var objective;

    var foodSource;
    //determine closest cell
    if (!this.isHerbivore) {
        var nearest = utilitiesFactory.findCreature(this.game.creatures, currentPos, this.vision, this);
        if (nearest && nearest.name !== this.name) {
            this.changeState('fight');
            // console.log("moving to food", this.name)
            this.moveTowardsObjective(nearest);
        } else {
            // console.log("just moving", this.name)
            this.herd()
        }
    }
    if (this.isHerbivore) {
        // console.log('getFood HERB', this.name)
        this.moveTowardsObjective("grass");
    }
}; Creature.prototype.eat = function(target) {
    this.changeState('eating');
    console.log(this.name + " ate ", target);
    if (this.hunger > 10) {
        this.hunger -= 10;
    } else {
        this.hunger = 0;
    }
    // console.log('INSIDE THE EAT FUNC',target)
    if (this.isHerbivore) this.map.empty(target.x, target.y, target.z);
    else target.die();
};

function step(dir, objective) {
    if (dir < objective) return 1;
    else if (dir > objective) return -1;
    else return 0;
};


function parseXYZ(x, y, z) {
    if (typeof x === 'object' && Array.isArray(x)) {
        return {
            x: x[0],
            y: x[1],
            z: x[2]
        };
    } else if (typeof x === 'object') {
        return {
            x: x.x || 0,
            y: x.y || 0,
            z: x.z || 0
        };
    }
    return {
        x: Number(x),
        y: Number(y),
        z: Number(z)
    };
}


return Creature;

})
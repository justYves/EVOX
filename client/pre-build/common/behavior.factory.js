app.factory('BehaviorFactory', function(MoveWorker) {
  //Creature constructor
  function Creature() {
  }

  Creature.prototype.setPosition = function(x, y, z) {
    parseXYZ(x, y, z);
    this.position.y = y;
    this.position.x = x + 0.5;
    this.position.z = z + 0.5;
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

  Creature.prototype.die = function() {
    this.isAlive = false;
    var ind;
    var self = this;
    this.game.creatures.forEach(function(creature, index) {
      if (self.item.avatar.id === creature.item.avatar.id) {
        ind = index;
        self.game.creatures.splice(ind, 1);
      }
    });
    game.removeItem(this);
    game.scene.remove(this.item.avatar);
    game.removeEvent(this.item.avatar.id)
  };

  Creature.prototype.procreate = function() {
    this.game.emit("procreate", 5.5, this.position.z - 0.5, this.name);
    var newCreature = new this.constructor({
      name: this.name,
      size: this.size,
      vision: this.vision,
      isHerbivore: this.isHerbivore
    });
    this.game.creatures.push(newCreature);
    render(newCreature, this.map);
    newCreature.setPosition(this.position.x - 0.5, 10, this.position.z - 0.5);
    game.addEvent(function() {
      newCreature.exist();
    }, 1);
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

    var myWorker = new Worker(MoveWorker);
    myWorker.postMessage(data);
    var self = this;
    myWorker.onmessage = function(result) {
      self.position.x = result.data.x;
      self.position.y = result.data.y;
      self.position.z = result.data.z;
      self.rotation.y = Number(result.data.rotY) || self.rotation.y;
    };
  };

  Creature.prototype.moveRandomly = function(amt) {
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


  Creature.prototype.step = function(dir, objective) {
    if (dir < objective) return 1;
    else if (dir > objective) return -1;
    else return 0;
  };

  Creature.prototype.moveTowardsObjective = function(objv) {
    var x = this.position.x - 0.5;
    var z = this.position.z - 0.5;
    var self = this;
    //if moving 0 in all directions
    //this.rotation.y / (Math.PI / 180)
    var ard = [
      [x - 1, z],
      [x + 1, z],
      [x + 1, z - 1],
      [x + 1, z - 1],
      [x - 1, z - 1],
      [x - 1, z + 1],
      [x, z - 1],
      [x, z + 1]
    ];

    var foundFood = false;
    if(this.isHerbivore === false){
        ard.forEach(function(coords){
            if(coords[0] === objv.position.x - 0.5 && coords[1] === objv.position.z - 0.5 && !foundFood){
                console.log('killer: ',self.name,"target: ", objv.name);
                foundFood = true;
                self.lookAt(objv);
                self.eat(objv);
            }
        });
        if(foundFood === false){
            this.move(this.step(x, objv.position.x - 0.5), 0, this.step(z, objv.position.z - 0.5));
        }

    }
    if(this.isHerbivore){
        var count = 0;
         ard.forEach(function(coords){
            if(self.map.getCell(coords[0], coords[1]).material === objv){
                if(count <= self.appetite){
                    count++;
                    foundFood = true;
                    self.lookAt(this.map.getCell(coords[0], coords[1]));
                    self.eat(this.map.getCell(coords[0], coords[1]));
                }
            }
        });
    }
  };

  Creature.prototype.herd = function() {
    var x = this.position.x - 0.5;
    var z = this.position.z - 0.5;
    var foundNeighbor = false;
    var self = this;
    var min;

    //finding the closest neighbor cell
    this.game.creatures.forEach(function(creature){
       if(creature !== self && creature.name === self.name){
          var dist = Math.sqrt(Math.pow((creature.position.x - x), 2) + Math.pow((creature.position.z - z), 2)) ;
          if(dist < self.social){  
              foundNeighbor = true;  
              if(!min){
                  min = dist;
                  nearestNeighbor = creature;
              }else if(dist < min){
                  min = dist;
                  nearestNeighbor = creature;
              }
          }
      }


        });
    if(foundNeighbor){
        futureX = x + this.step(x, nearestNeighbor.position.x - 0.5);
        futureZ = z + this.step(z, nearestNeighbor.position.z - 0.5);
        if(futureX !== nearestNeighbor.position.x && futureZ !== nearestNeighbor.position.z){
            //move towards herd
            this.move(this.step(x, nearestNeighbor.position.x - 0.5), 0, this.step(z, nearestNeighbor.position.z - 0.5));
        }
    }


    else this.moveRandomly(2);
  };

  Creature.prototype.exist = function() {
    if (this.alive) {
      console.log("NAME: " + this.name + ", Hunger: " + this.hunger + ", HP: " + this.hp);
      this.hunger++;
      this.age++;
      this.lifeCycle--;
      if (this.hunger >= Math.floor(this.hp)) this.hp--;

      if (this.hp <= 0) this.die();

      if (this.hunger >= Math.floor(this.hp / 2)) {
        console.log(this.name + " is looking for food");
        this.getFood();
      }
      if (this.lifeCycle === 0) {
        console.log(this.name + ' is procreating');
        if (Math.random() < 0.2) {
          this.procreate();
          this.lifeCycle === this.hpMax * 4;
        }
      } 
      if(this.hunger < Math.floor(this.hp / 2)){
        console.log(this.name + " is herding");
        this.herd();
      }
    }
  };
/**** Eating behavior *****/
Creature.prototype.getFood = function() {
    var x = this.position.x - 0.5;
    var z = this.position.z - 0.5;
    var min;
    var closestCell;
    var objective;
   
    var foodSource;

    //determine closest cell
    if(!this.isHerbivore){
        var self = this;
        this.game.creatures.forEach(function(creature){
             if(creature !== self){
                var dist = Math.sqrt(Math.pow((creature.position.x - x), 2) + Math.pow((creature.position.z - z), 2)) ;
                if(dist < self.vision){  
                    if(!min){
                        min = dist;
                        closestCell = creature;
                    }else if(dist < min && dist){
                        min = dist;
                        closestCell = creature;
                    }
                }
            }
        });
        this.moveTowardsObjective(closestCell); 
    }

    if(this.isHerbivore){
        this.moveTowardsObjective("grass");
    }
};
Creature.prototype.eat = function(target) {
    // console.log(this.name + " ate " + this.food.material, this.food.hasAnimal);
    // this.game.emit('eat', this.position.x - 0.5, this.position.z - 0.5, target);
    if(this.hunger > 0){
        this.hunger -= 10; 
    }
    if(this.isHerbivore) this.map.empty(target.x, target.z);
    else target.die()
};


  return Creature;

})
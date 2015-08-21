app.factory('utilitiesFactory',function(){
	var nearest;
	var min;
	function findCreature(mapCreatures, currentPoint,radius, self){
		// console.log("the factory is working", self);
		mapCreatures.forEach(function(creature){
	       if(creature !== self && creature.name === self.name){
	       	  var dist = distance(currentPoint, creature.position);
	       	  // console.log("distance: ", dist);
 	          //var dist = Math.sqrt(Math.pow((creature.position.x - x), 2) + Math.pow((creature.position.z - z), 2)) ;
	          if(dist < radius){   
	              if(!min){
	                  min = dist;
	                  nearest = creature;
	              }else if(dist < min){
	                  min = dist;
	                  nearest = creature;
	              }
	          }
	          // console.log("factory nearest",nearest);
	      }
	    });
	    if(nearest){
	    	return nearest;
	    }
	}
	function distance(pointA,pointB){
	  // console.log("distance pointA: ", typeof pointA[0], "B", typeof pointB.x)
	  return Math.floor(Math.sqrt(Math.pow((pointB.x - pointA[0]), 2) + Math.pow((pointB.z - pointA[1]), 2)));
	}
	return{
		findCreature: findCreature,
		distance: distance,
	};

});
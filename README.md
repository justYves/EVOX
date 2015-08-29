# EVOX

##Contributors
- [Richard Michels](https://github.com/richardalexandermichels)
- [Justin Kim](https://github.com/jkim430)
- [Pete Steele](https://github.com/celanajaya)
- [Yves Yuen](https://github.com/justYves)

##Time
At 1X speed, a second IRL equals to 4 minutes IG.
1 day ig = 1 month ig

|IG      | 1x            | 2X            | 4X    |
|--------| :------------- |:-------------:| -----:|
| 1 day  | 6 m     | 3m | 90s |
| 1 month| 6 m      | 3m     |   90s|
| 1 year| 1h12m| 36m    |    18m |


##Basic File Structiure
##Creature (in folder 'creature')
index.js - the constructor for all creatures
render.js - three.js rendering for creatures
shape.js - a collection of objects for each creature's shape
BEHAVIOR (folder)
index.js - shared creature behaviors
Eating.js - eating behaviors (separate behaviors for herbivores and carnivores)
moveWorker.js - a web worker to handle movement calculations (saves us a few frames)
The creature constructor takes an object of options. 

##Forest
function and models for building a forest of trees (modded from npm module 'voxel-forest')
##Tree
functions and models for building trees (mostly modded code from npm module 'voxel-tree')

##root folder
index.js - building the game, rendering and placing initial generation of creatures
map.js - constructs an array of cell objects that correspond to the play field
moving-map.js ??? legacy code?

<div class="modal-body" style="margin: 5%; width: 90%">
	<h3 class="text-center">Welcome to Your World!</h3> 
	<hr>
    <p>You can interact with the world using the control panel on 
    the right of the screen!</p>
    <p>Use the setting buttons to control gameplay!</p>
    <div class="img-container col-lg-6">
      <i id="settings-icon"  class="fa fa-backward"></i> Slow down time.
    </div>
      <div class="img-container col-lg-6">
      <i id="settings-icon"  class="fa fa-forward"></i> Speed up time.
    </div>
    <div class="img-container col-lg-6">
        <i id="settings-icon"  class="fa fa-pause"></i> Pause the game.
    </div>
    <div class="img-container col-lg-6">
      <i id="settings-icon"  class="fa fa-play"></i> Resume the game.
    </div>
    <div class="img-container col-lg-12">
      <i id="settings-icon"  class="fa fa-save"></i> Save your game.
    </div>
    <h4 class=text-center>land and food icons modify your environment!</h4>
    <div class="img-container col-lg-6">
        <img class="img-responsive" id="icon-pic" ng-src="3D-Grass-icon.png"/>
        Spawn Grass
    </div>
    <div class="img-container col-lg-6">
        <img class="img-responsive" id="icon-pic" ng-src="3D-Dirt-icon.png"/>
        Remove Grass
    </div>
    <div class="img-container col-lg-6">
        <img class="img-responsive" id="icon-pic" ng-src="Stone-Hoe-icon.png"/>
        Remove a block.
    </div>
    <div class='img-container col-lg-6'>
      <img class="img-responsive" id="icon-pic" ng-src="food.png"/>
      Feeder critters!
    </div>
    <div class='img-container col-lg-12'>
      <i id="settings-icon"  class="fa fa-info-circle" style="display:block;"></i>Get game info
    </div>
    <p>Click on a creature to get their stats. Remember to feed them if they are hungry!</p>
    <h4>Icons above a creature indicate their current behavior.</h4> 
    <div class='img-container col-lg-6'>
      <img class="img-responsive" id="icon-pic" ng-src="textures/look.png"/>
      Searching for food.
    </div>
    <div class='img-container col-lg-6'>
      <img class="img-responsive" id="icon-pic" ng-src="textures/eating.png"/>
      A creature is eating.
    </div>
    <div class='img-container col-lg-6'>
      <img class="img-responsive" id="icon-pic" ng-src="textures/herd.png"/>
      Searching for other animals to herd with.
    </div>
    <div class='img-container col-lg-6'>
      <img class="img-responsive" id="icon-pic" ng-src="textures/dead.png"/>
      The animal has died! :(
    </div>
    <div class='img-container col-lg-6'>
      <img class="img-responsive" id="icon-pic" ng-src="textures/love.png"/>
      If animals are healthy and the timing is right, animals will procreate!
    </div>

	<div class="modal-footer">
		<button class="btn btn-success pull-left" ng-click="close()">Back to Game</button>
		<button style="margin-top:0;" class="btn btn-danger" ng-click="toWorlds()">Exit to My Worlds</button>
	</div>
</div>
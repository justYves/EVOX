# EVOX

##What is it?
EVOX is a 3D life simulator game where you can create your own landscapes and populate them with creatures. Each creature has its own set of abilities on top of basic behaviors such as procreation and death, and you can observe over time how the combination of these skillsets affect the balance of the ecosystem. EVOX is inspired by Conway's Game of Life, and the fundamental concept is to visualize the theory of evolution. To learn more:

Play the game: www.evox.life  
Watch an overview: https://www.youtube.com/watch?v=sVJ3vTde7nQ

##How to play
After creating an account, head to the Creatures page and choose between building your own creature from scratch, or modifying one of the available default creatures. This will lead you to the creature builder.

####Builder
Click anywhere on the grid to place a voxel. The default color (![](client/textures/block.png)) is a placeholder and will not render in the game. Use this to fill up any parts of the creature that will never be exposed (e.g. inside) to assist you with construction and reduce rendering time during gameplay. The grid clearly indicates which way the creature should be facing in order for it to move around sensibly on the map.  
To delete a voxel, hold down shift and click.  
To create many voxels by clicking and dragging, hold down alt.  
To change a color on the palette, right click to open the color picker.

####Worlds
Once you've created a creature that you want to proceed with, navigate to the Worlds page and create your own environment. After providing a name, you'll be presented with three types of environments, each one with its own versions of predator and prey:

|Environment      | Predator            | Prey            |
|--------| :------------- |:-------------|
| Grassland  | Fox     | Turtle |
| Desert | Crocodile, Lion      | Giraffe, Elephant     |
| Ice | Wolf| Penguin, Deer, Beaver    |

Define the size of the landscape, the terrain type (flat/multilevel), then save. To play the world, select it and click play.

####Gameplay
You can interact with the world using the control panel on the top right.  
Game Settings: Slow down, pause, or speed up time, and save the game at any point.

![](server/images/controlpanel.png)

Actions: Spawn grass, remove grass, plant a tree, remove a voxel, add small prey, and view game info.

Click on a creature to get its stats, which are updated in real time. If they are a carnivore and get too hungry, you can feed them with small prey in the control panel. In addition to creature stats, you can observe their activity from the icons that appear above them:

|Icon      | Meaning            |
|--------| :------------- |
| ![](client/textures/look.png)  | Searching for food due to high hunger |
| ![](client/textures/eating.png) | Eating      |
| ![](client/textures/herd.png) | Attempting to herd with same species - exhibited by prey to reduce attack by predators|
| ![](client/textures/love.png) | Procreating - occurs when animals are healthy and life cycles are in sync|
| ![](client/textures/dead.png) | Death (next version release) |

####Time
At 1X speed, a second IRL equates to 4 minutes IG.
1 day cycle IG = 1 month IG

|IG      | 1x            | 2X            | 4X    |
|--------| :------------- |:-------------:| -----:|
| 1 day cycle | 6 m     | 3m | 90s |
| 1 month| 6 m      | 3m     |   90s|
| 1 year| 1h12m| 36m    |    18m |

##Contributors
- [Richard Michels](https://github.com/richardalexandermichels)
- [Justin Kim](https://github.com/jkim430)
- [Pete Steele](https://github.com/celanajaya)
- [Yves Yuen](https://github.com/justYves)


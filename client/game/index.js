var createGame = require('voxel-engine');
//options should be coming from Factory
var game = createGame({
    generate: function(x, y, z) {
        return (y === 0 && x >= 0 && x <= size && z >= 0 && z <= size) ? map.getMaterial(x, z) : 0;
    },
    materials: materials,
    texturePath: './textures/',
    controls: {
        discreteFire: true
    },
    // // lightsDisabled: true
});

game.appendTo(document.body)

var shout = function(){
  alert("shout");
}
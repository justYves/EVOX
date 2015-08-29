app.factory('SpriteFactory', function() {
  var game;
  var stateIcons = {
    dead: 'dead.png',
    normal: '',
    food: 'dead.png',
    hunting: 'look.png',
    procreating: 'love.png',
    eating: 'eating.png',
    herd: 'herd.png',
    fight: 'attack.png'
  };

  function setIcon(ref) {
    game = ref;
    Object.keys(stateIcons).forEach(function(icon) {
      stateIcons[icon] = new game.THREE.ImageUtils.loadTexture("../textures/" + stateIcons[icon] );
    })
  };

  function getIcon(state){
    return stateIcons[state];
  }

  return {
    setIcon: setIcon,
    getIcon: getIcon
  };

});
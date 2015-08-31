app.controller('MultiplayerPlayController', function(user, $scope, mySocket, $state) {

  var createGame = window.voxelEngine;

  mySocket.on('fight', function(roomId) {
    $scope.roomId = roomId;
    launchGame();
  });


  function launchGame() {
    var game = createGame({
      materials: ['grass', 'yellow'],
      generate: function(x, y, z) {
        if (y === 5 && x === 5 && z === 5) {
          return 2;
        }
        if (y === 4 && (x > 3 && x < 7) && (z > 3 && z < 7)) {
          return 2;
        }
        if (y === 3 && (x > 2 && x < 8) && (z > 2 && z < 8)) {
          return 2;
        }
        if (y === 2 && (x > 1 && x < 9) && (z > 1 && z < 9)) {
          return 2;
        }
        if (y === 1 && (x > 0 && x < 10) && (z > 0 && z < 10)) {
          return 2;
        }
        return y === 0 ? 1 : 0
      }
    });

    game.appendTo(document.body);


    //create player
    var player = window.voxelPlayer;
    var createPlayer = player(game);
    var avatar = $scope.player = createPlayer('../textures/player.png');
    // $scope.player = avatar;
    avatar.possess();
    avatar.yaw.position.set(0, 1, 4);


    function sendState() {
            var player = self.game.controls.target()
      var state = {
        position: player.yaw.position,
        rotation: {
          y: player.yaw.rotation.y,
          x: player.pitch.rotation.x
        }
      }
      mySocket.emit('state', state)

      mySocket.emit('created');
    }
  }


  mySocket.on('data', function(state) {
    var interacting = false
    Object.keys(state).map(function(control) {
      if (state[control] > 0) interacting = true
    });
    if (interacting) sendState()
  });

  mySocket.emit("room", $scope.room, 'ready');


  Client.prototype.updatePlayerPosition = function(id, update) {
    var pos = update.position
    var player = this.others[id]
    if (!player) {
      var playerSkin = skin(this.game.THREE, 'player.png', {
        scale: new this.game.THREE.Vector3(0.04, 0.04, 0.04)
      })
      var playerMesh = playerSkin.mesh
      this.others[id] = playerSkin
      playerMesh.children[0].position.y = 10
      this.game.scene.add(playerMesh)
    }
    var playerSkin = this.others[id]
    var playerMesh = playerSkin.mesh
    playerMesh.position.copy(playerMesh.position.lerp(pos, this.lerpPercent))

    // playerMesh.position.y += 17
    playerMesh.children[0].rotation.y = update.rotation.y + (Math.PI / 2)
    playerSkin.head.rotation.z = scale(update.rotation.x, -1.5, 1.5, -0.75, 0.75)
  }



  // Handle entering a command
  window.addEventListener('keyup', function(e) {
    if (e.keyCode !== 13) return;
    var el = document.getElementById('cmd');
    if (document.activeElement === el) {
      mySocket.emit('message', {
        user: name,
        text: el.value
      })
      el.value = '';
      el.blur();
    } else {
      el.focus();
    }
  });

  mySocket.on('message', showMessage)

  function showMessage(message) {
    var li = document.createElement('li')
    li.innerHTML = message.user + ': ' + message.text
    messages.appendChild(li)
    messages.scrollTop = messages.scrollHeight
  }
});
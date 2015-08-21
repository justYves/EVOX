app.controller('MultiplayerController', function(user, $scope, mySocket, $state) {
  $scope.user = user || {name: 'Anonymous'};
  mySocket.emit('ready', $scope.user.name);
  mySocket.on('foundPlayers', function(player) {
    console.log("You're playing with", player);
    $state.go('multiplayer.play');
  });
});
app.controller('MultiplayerController', function(user, $scope, mySocket, $state, users) {
    $scope.user = user || {
        name: 'Anonymous'
    };
    $scope.users = users;
    console.log(users)
    mySocket.emit('ready', $scope.user.name);
    mySocket.on('foundPlayers', function(player) {
        console.log("You're playing with", player);
        $state.go('multiplayer.play');
    });
});
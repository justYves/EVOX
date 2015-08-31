app.controller('MultiplayerController', function(user, $scope, mySocket, $state, users) {
    $scope.user = user || {
        name: 'Anonymous'
    };
    $scope.users = users;
    mySocket.emit('ready', $scope.user.name);
    mySocket.on('foundPlayers', function(player) {
        $state.go('multiplayer.play');
    });
});
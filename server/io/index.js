'use strict';
var socketio = require('socket.io');
var chalk = require('chalk');
var uuid = require('node-uuid');
var io = null;
module.exports = function(server) {

  //CHALK GUIDELINES TO FOLLOW
  //GREEN CONNECTION
  //YELLOW WAITING ROOM
  //RED DISCONNECT
  //PURPLE GAME MECHANICS

  //Create server
  if (io) return io;
  io = socketio(server);
  var waiting = {}; //player waiting to play
  var clients = {}; //all connected clients
  var rooms = {}; // Object are easier to delete obj[key]
  var interval = 2000; //ms for note to appear

//1.User connected
  var connectedUser = 0;
  io.on('connection', function(client) {
    clients[client.id] = client;
    client.emit('connection successfull', client.id);

    //Connection Status
    console.log(chalk.green('socket.io:: player ' + client.id + ' connected'));
    //Print How many users are connected
    console.log(chalk.blue("Total connected user: ", ++connectedUser));

    //Triggered when player accepted get Media print out the name we received
    //Print out number of users in waiting Room
    client.on('ready', function(from) {
      client.name = from;
      waiting[client.id] = client;
      console.log("server received Ready status: from",from);
      // console.log("received image:", img); //Working
      console.log(chalk.yellow("Users in waiting Room:", Object.keys(waiting).length));
      matchUsers();
    });

    //Matches player against each other <---- Put in another file--->
    function matchUsers() {
      if (Object.keys(waiting).length >= 2) {

        //<---- Random ---> NOT WORKING
        var user1 = waiting[Object.keys(waiting)[Math.floor((Math.random()) * (Object.keys(waiting).length - 1))]];
        delete waiting[user1.id];
        var user2 = waiting[Object.keys(waiting)[Math.floor((Math.random()) * (Object.keys(waiting).length - 1))]];
        delete waiting[user2.id];

        // var index = Object.keys(waiting).length-1;
        // Object.keys(waiting)[index]


        console.log('opponents Found! ', user1.name + ' is fighting ' + user2.name + '.');

        //Create a room for the fight
        var newRoom = new Room(user1, user2);
        rooms[newRoom.id] = newRoom;

        //notify user1
        user1.join(newRoom.id);
        user1.room = newRoom.id;
        user1.emit('foundPlayers', user2.name); //change angular state

        //notify user2
        user2.join(newRoom.id);
        user2.room = newRoom.id;
        console.log("sending user1 img",user1.img);
        user2.emit('foundPlayers', user1.name); //change angular state

        io.sockets.in(newRoom.id).on('leave', function() {
          console.log("someone left the room!");
        });

        setTimeout(function() {
          io.to(newRoom.id).emit('fight', newRoom.id);
        }, interval);
      }
    }

    function Room(user1, user2) {
      this.id = uuid.v4().toString();
      this.round = 1;
      this.players = [{
        name: user1.name,
        id: user1.id
      }, {
        name: user2.name,
        id: user2.id
      }];
    }


    //Emit to a specific room:
    client.on('room', function(roomId, msg) {
      client.broadcast.to(roomId).emit(msg);
      if (msg === 'pitchSlap') {
        setTimeout(function() {
          io.to(roomId).emit('new note', randNote());
        }, interval);
      }
    });

    // Opponent disconnected
    client.on('return to Waiting', function() {
      client.leave(client.room);
    });



    //player disconnects
    client.on('disconnect', function() {
      console.log(chalk.red('\t socket.io:: client disconnected ' + client.id));
      console.log(chalk.blue("Total connected user: ", --connectedUser));

      //delete from room
      if (client.room) {
        console.log(client.id + " left room " + client.room);
        client.leave(client.room);
        delete rooms[client.room];
        io.sockets.in(client.room).emit('leave');
      }
      //delete from waiting Room
      delete waiting[client.id];

      //delet from connected client
      delete clients[client.id];
    });

    // <----- ADMIN ---->
    client.on('admin', function() {
      //Return clients ID and Name
      var filterClients = [];
      Object.keys(clients).forEach(function(client) {
        filterClients.push({
          name: clients[client].name,
          id: clients[client].id
        });
      });

      //Return Name with User in it
      var filterRooms = [];
      Object.keys(rooms).forEach(function(id) {
        filterRooms.push({
          id: rooms[id].id,
          players: rooms[id].players
        });
      });

      var waitingRoom = [];
      Object.keys(waiting).forEach(function(player) {
        waitingRoom.push({
          name: waiting[player].name,
          id: waiting[player].id
        });
      });

      client.emit('data', filterRooms, filterClients, waitingRoom);
    });


  });
  return io;
};
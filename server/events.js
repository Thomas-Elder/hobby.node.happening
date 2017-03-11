
var includes = require('thombsaway-includes');

var events = function(server) {
  io = require('socket.io')(server);

  var users = [];
  var rooms = [];

  io.on('connection', function(socket){
    
    if (!includes.includes(users, socket.id))
      users.push({id:socket.id});

    io.emit('user-connected', users);

    socket.on('disconnect', function(){

      var index = users.findIndex(function(user){ return user.id === socket.id });
      users.splice(index, 1);

      var roomIndex = rooms.findIndex(function(room){ return includes.includes(room.users, socket.id); });

      // If they're in a room, splice them from the users list
      if (roomIndex != -1){
        
        var userIndex = rooms[roomIndex].users.findIndex(function(user){ return user === socket.id });
        rooms[roomIndex].users.splice(userIndex, 1);

        // If they're the last user in the room, splice the room and emit 'room-closed' event
        if (rooms[roomIndex].users.length === 0) {
          var id = rooms[roomIndex].id;
          
          rooms.splice(roomIndex, 1);
          io.emit('room-closed', id, rooms);
        }
      }

      io.emit('user-disconnected');
    });

    socket.on('login', function(name){

      var index = users.findIndex(function(user){ return user.id === socket.id });
      users[index].name = name;

      socket.broadcast.emit('new-login', name);
    });

    socket.on('logout', function(){

      var index = users.findIndex(function(user){ return user.id === socket.id });
      var name = users[index].name;

      delete users[index].name;

      socket.broadcast.emit('new-logout', name);
    });

    socket.on('open', function(){

      rooms.push({ id:socket.id, users: [socket.id] });
      socket.join(socket.id);
      socket.broadcast.emit('new-room', socket.id, rooms);
    });

    socket.on('join', function(id){

      var roomIndex = rooms.findIndex(function(room){ return room.id === id });
      rooms[roomIndex].users.push(socket.id);

      var user = users.find(function(user){ return user.id === socket.id });
      var usersInRoom = rooms[roomIndex].users;
      usersInRoom.sort();

      socket.join(id);
      socket.broadcast.to(id).emit('user-joined', user.name, usersInRoom);
    });

    socket.on('bail', function(){

      var roomIndex = rooms.findIndex(function(room){ return includes.includes(room.users, socket.id); });

      if (rooms[roomIndex].users.length > 0) {

        // Find the user's index in the rooms user array
        var userIndex = rooms[roomIndex].users.findIndex(function(user){ return user === socket.id });
        var id = rooms[roomIndex].id;  

        // Remove the user from the rooms' user array
        rooms[roomIndex].users.splice(userIndex, 1);

        // Tidy up room if necessary
        if (rooms[roomIndex].users.length === 0) {

          rooms.splice(roomIndex, 1);
          io.emit('room-closed', id, rooms);
        } else { 

          // Find the user in the user array
          var user = users.find(function(user){ return user.id === socket.id });
          var name = user.name;

          socket.broadcast.to(id).emit('user-bailed', name, rooms[roomIndex].users);
        }
      }
    });
  
    socket.on('new-message', function(text){
      var roomIndex = rooms.findIndex(function(room){ return includes.includes(room.users, socket.id); });
      var id = rooms[roomIndex].id;
      var user = users.find(function(user){ return user.id === socket.id });

      var message = {};
      message.name = user.name;
      message.text = text;

      socket.broadcast.to(id).emit('new-message', message);
    });
  });
};

module.exports = events;
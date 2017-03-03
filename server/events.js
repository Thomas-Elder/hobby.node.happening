
var events = function(server) {
  io = require('socket.io')(server);

  var users = [];

  io.on('connection', function(socket){
    
    users.push({id:socket.id});

    io.emit('user-connected');

    socket.on('disconnect', function(){

      io.emit('user-disconnected');
    });

    socket.on('login', function(name){

      users.find(function(user){ return user.id === socket.id; }).name = name;
      socket.broadcast.emit('new-login', name);
    });

    socket.on('logout', function(){

      var index = users.findIndex(function(user){ return user.id === socket.id; });
      var name = users[index].name;

      users.splice(index, 1);

      socket.broadcast.emit('new-logout', name);
    });

    socket.on('open', function(){

      users.find(function(user){ return user.id === socket.id; }).roomid = socket.id;

      socket.join(socket.id);
      socket.broadcast.emit('new-room', socket.id);
    });

    socket.on('join', function(id){

      var index = users.findIndex(function(user){ return user.id === socket.id; });
      var name = users[index].name;
      users[index].roomid = id;

      socket.join(id);
      socket.broadcast.to(id).emit('user-joined', name);
    });

    socket.on('bail', function(){

      var index = users.findIndex(function(user){ return user.id === socket.id; });
      var name = users[index].name;
      id = users[index].roomid;

      // If the room id is this socket's id (ie this socket is the host)
      if(users[index].id === id) {

        // Then for each current user 
        for(var user in users) {

          // If their roomid equals this id (ie they are in this room)
          if (user.roomid === id) {

            // Disconnect them from the socket, and delete their roomid property
            io.sockets.sockets[user.id].disconnect();
            delete user.roomid;
          }
        }

        // Then let everyone know this room is closed.
        socket.broadcast.to(id).emit('room-closed');
      } else {

        socket.leave(id);
        delete users[index].roomid; 
        socket.broadcast.to(id).emit('user-bailed', name);
      }
    });
  
    socket.on('new-message', function(text){

      var index = users.findIndex(function(user){ return user.id === socket.id; });
      var id = users[index].roomid;

      var message = {};
      message.name = users[index].name;
      message.text = text;

      socket.broadcast.to(id).emit('new-message', message);
    });
  });
};

module.exports = events;
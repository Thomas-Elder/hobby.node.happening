
var includes = require('thombsaway-includes');

var events = function(server) {
  io = require('socket.io')(server);

  var users = [];
  var rooms = [];

  io.on('connection', function(socket){
    
    if (!includes.includes(users, socket.id))
      users.push({id:socket.id});
 
    io.emit('user-connected');

    socket.on('disconnect', function(){

      io.emit('user-disconnected');
    });

    socket.on('login', function(name){

      socket.broadcast.emit('new-login', name);
    });

    socket.on('logout', function(){

      socket.broadcast.emit('new-logout');
    });

    socket.on('open', function(){

      socket.join(socket.id);
      socket.broadcast.emit('new-room', socket.id);
    });

    socket.on('join', function(id){

      socket.join(id);
      socket.broadcast.to(id).emit('user-joined');
    });

    socket.on('bail', function(){

      //socket.broadcast.to(id).emit('user-bailed');
    });
  
    socket.on('new-message', function(text){

      //socket.broadcast.to(id).emit('new-message', text);
    });
  });
};

module.exports = events;
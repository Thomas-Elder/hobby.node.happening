
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
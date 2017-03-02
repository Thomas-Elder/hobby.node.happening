
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
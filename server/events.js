
var events = function(server) {
  io = require('socket.io')(server);

  io.on('connection', function(socket){
    console.log('user connected...');

    io.emit('user-connected');

    socket.on('disconnect', function(){
      console.log('user disconnected...');

      io.emit('user-disconnected');
    });

    socket.on('new-message', function(data){
      console.log('message received...', data);

      io.emit('new-message', data);
    });

    socket.on('login', function(user){
      console.log('new login received...', user);

      socket.broadcast.emit('new-login', user);
    });

    socket.on('open', function(data){
      console.log('new room created: ', data);
      data.room = {};
      data.room.id = socket.id;
      data.users = [];
      data.users.push(socket.id);

      socket.join(socket.id);

      socket.broadcast.emit('new-room', data);
    });
  });
};

module.exports = events;
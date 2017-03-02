
var events = function(server) {
  io = require('socket.io')(server);

  io.on('connection', function(socket){
    console.log('user connected...');

    io.emit('user-connected');

    socket.on('disconnect', function(){
      console.log('user disconnected...');

      io.emit('user-disconnected');
    });

    socket.on('new-message', function(message){
      console.log('message received for room:', message);

      socket.broadcast.to(message.room.id).emit('new-message', message);
    });

    socket.on('login', function(user){
      console.log('new login received...', user);

      socket.broadcast.emit('new-login', user);
    });

    socket.on('open', function(room){
      console.log('new room created: ', room);

      socket.join(socket.id);

      socket.broadcast.emit('new-room', room);
    });

    socket.on('join', function(room, user){
      console.log('new room created: ', room, user);

      socket.join(room.id);
      room.users.push(user);
      socket.broadcast.to(room.id).emit('user-joined', room);
    });
  });
};

module.exports = events;
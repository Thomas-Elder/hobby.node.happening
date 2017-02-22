
var events = function(server) {
  io = require('socket.io')(server);

  io.on('connection', function(socket){
    console.log('user connected...');

    io.emit('user-connected');

    socket.on('disconnect', function(){
      console.log('user disconnected...');

      io.emit('user-disconnected');
    });

    socket.on('new-message', function(msg){
      console.log('message received...', msg);

      io.emit('new-message', msg);
    });

    socket.on('login', function(user){
      console.log('new login received...', user);

      socket.broadcast.emit('new-login', user);
    });
  });
};

module.exports = events;
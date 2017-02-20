
var events = function(server) {
  io = require('socket.io')(server);

  io.on('connection', function(socket){
    console.log('user connected...');

    io.emit('user-connected');

    socket.on('disconnect', function(){
      io.emit('user-disconnected');
    });

    socket.on('new-message', function(msg){
      io.emit('new-message', msg);
    });
  });
};

module.exports = events;
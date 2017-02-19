
var events = function(server) {
  io = require('socket.io')(server);

  io.on('connection', function(socket){
    console.log('user connected...');

    io.emit('connect');

    socket.on('disconnect', function(){
      console.log('user disconnected');
      io.emit('disconnect');
    });
  });
};

module.exports = events;
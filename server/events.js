
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
      console.log('message received...');

      io.emit('new-message', msg);
    });
  });
};

module.exports = events;
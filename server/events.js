
var events = function(server) {
  io = require('socket.io')(server);

  io.on('connection', function(socket){
    console.log('user connected.');

    socket.emit('connected', {msg:'connection successful.'});
  });
};

module.exports = events;
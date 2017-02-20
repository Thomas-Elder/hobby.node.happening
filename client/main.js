window.onload = function(){
  var socket = io();

  socket.on('user-connected', function(){

    console.log('new user joined');
    $('#chat').append('<li>A new user has joined</li>');
  });

  socket.on('user-disconnected', function(){

    console.log('user left');
    $('#chat').append('<li>A user has left</li>');
  });

  socket.on('new-message', function(msg){
    console.log(msg);
    $('#chat').append('<li>' + msg + '</li>');
  });

  $('#send').click(function(){

    var msg = $('#message').val();
    console.log(msg);
    socket.emit('new-message', msg);
  });
};
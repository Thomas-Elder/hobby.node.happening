window.onload = function(){
  var socket = io();

  io.on('user-connected', function(){

    console.log('new user joined');
    $('#chat').append('<li>A new user has joined</li>');
  });

  io.on('user-disconnected', function(){

    console.log('user left');
    $('#chat').append('<li>A user has left</li>');
  });

  $('#send').click(function(){

    var msg = $('message').val();

    io.emit('new-message', msg);
  });
};
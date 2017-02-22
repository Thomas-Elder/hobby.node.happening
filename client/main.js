window.onload = function(){
  var socket = io();
  
  var name = "";

  $('#login-section').show();
  $('#chat-section').hide();
  
  $('#login').click(function(){
    name = $('#name').val();

    $('#login-section').hide();
    $('#chat-section').show();

    socket.emit('login', name);
  });
  
  $('#send').click(function(){
    var msg = $('#message').val();
    socket.emit('new-message', msg);
  });
  socket.on('user-connected', function(){
    $('#chat').append('<li>A new user has joined</li>');
  });

  socket.on('user-disconnected', function(){
    $('#chat').append('<li>A user has left</li>');
  });

  socket.on('new-message', function(msg){
    $('#chat').append('<li>' + msg + '</li>');
  });

  socket.on('new-login', function(user){
    $('#chat').append('<li>User: ' + user + ' has joined the chat.</li>');
  });
};
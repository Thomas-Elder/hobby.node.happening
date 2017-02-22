window.onload = function(){
  var socket = io();
  
  var name = "";

  $('#login-section').show();
  $('#chat-section').hide();
  
  $('#login').click(function(){
    var data = {};
    name = $('#name').val();
    data.name = name;

    $('#login-section').hide();
    $('#chat-section').show();

    socket.emit('login', data);
  });
  
  $('#send').click(function(){
    var data = {};
    data.name = name;
    data.msg = $('#message').val();

    socket.emit('new-message', data);
  });
  
  socket.on('user-connected', function(){
    $('#chat').append('<li>A new user has joined</li>');
  });

  socket.on('user-disconnected', function(){
    $('#chat').append('<li>A user has left</li>');
  });

  socket.on('new-login', function(data){
    $('#chat').append('<li>User: ' + data.name + ' has joined the chat.</li>');
  });

  socket.on('new-message', function(data){
    $('#chat').append('<li>' + data.name + ":" + data.msg + '</li>');
  });
};
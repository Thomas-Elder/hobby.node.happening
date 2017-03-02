window.onload = function(){
  var socket = io();
  
  var name = "";

  $('#login-section').show();
  $('#browse-section').hide();
  $('#chat-section').hide();
  
  $('#login').click(function(){
    var data = {};
    name = $('#name').val();
    data.name = name;

    $('#login-section').hide();
    $('#browse-section').show();

    socket.emit('login', data);
  });
  
  $('#open').click(function(){

    $('#browse-section').hide();
    $('#chat-section').show();

    socket.emit('open');
  });

  $('#rooms').on('click', 'button', function(){

    $('#browse-section').hide();
    $('#chat-section').show();

    var id = $(this).attr('id');

    socket.emit('join', id);
  });

  $('#send').click(function(){
    var data = {};
    data.name = name;
    data.msg = $('#message').val();

    socket.emit('new-message', data);
  });

  socket.on('new-room', function(id){
    $('#rooms').append('<li>' + id + '<button id ="' + id + '">J O I N </button><li>');
  });

  socket.on('new-message', function(message){
    $('#chat').append('<li>' + message.name + ":" + message.text + '</li>');
  });


  /**
   * These events are sent by the server, but I don't have a use for them at
   * the moment.
   */
  socket.on('new-login', function(name){  });

  socket.on('new-logout', function(name){  });

  socket.on('user-connected', function(){  });

  socket.on('user-disconnected', function(){  });
};
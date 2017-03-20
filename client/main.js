window.onload = function(){
  var socket = io();
  
  var name = "";

  $('#login-section').show();
  $('#browse-section').hide();
  $('#chat-section').hide();
  
  $('#login').click(function(){

    name = $('#name').val();

    $('#login-section').hide();
    $('#browse-section').show();

    socket.emit('login', name);
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

    text = $('#message').val();

    $('#chat').append('<li>' + name + ":" + text + '</li>');

    socket.emit('new-message', text);
  });

  $('#bail').click(function(){

    $('#browse-section').show();
    $('#chat-section').hide();

    socket.emit('bail');
  });

  socket.on('logged-in', function(rooms){

    for(var i = 0; i < rooms.length; i++) {
      $('#rooms').append('<li>' + rooms[i].id + '<button id ="' + rooms[i].id + '">J O I N </button></li>');
    }
  });

  socket.on('new-room', function(id){
    
    $('#rooms').append('<li>' + id + '<button id ="' + id + '">J O I N </button></li>');
  });

  socket.on('room-closed', function(id){
    id = '#' + id;
    $(id).parent().remove();
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
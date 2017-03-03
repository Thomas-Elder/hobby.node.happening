var Server = require('../../../server/server');

var io_client = require('socket.io-client');

describe('chat', function(){

  var server;

  var url = 'http://localhost:8888/';
  var socketOptions = {
        'reconnection delay' : 0, 
        'reopen delay' : 0, 
        'force new connection' : true
      };
  var client_a;
  var client_b;

  server = new Server();
  server.start();

  beforeEach(function(done){

    // Connect a client socket to the server
    client_a = io_client(url, socketOptions);
    client_b = io_client(url, socketOptions);

    // Log connection
    client_a.on('connect', function(){
        
        client_b.on('connect', function(){
          done();
      });
    });

    // Log connection error
    client_a.on('connect_error', function(err){
      console.log('client_a not connected, there was an error.', err);

      client_b.on('connect_error', function(err){
        console.log('client_b not connected, there was an error.', err);
        done();
      });
    });
  });
  
  afterEach(function(done){
    client_a.disconnect(true);
    client_b.disconnect(true);
    done();
  });

  describe('messages', function(){

    it('should send a "new-message" event when a "new-message" event is received', function(done){

      // Assert
      client_a.on('new-message', function(message){
        expect(true).toEqual(true);
        done();
      });

      // Arrange
      var expected = {};
      expected.name = 'Tim';
      expected.text = 'Oh shit son.';

      // Act
      client_a.emit('login', 'Tom');
      client_b.emit('login', 'Tim');

      client_a.emit('open');
      client_b.emit('join', client_a.id);

      client_b.emit('new-message', 'Oh shit son.');

    });

    it('should forward the message sent to the other client', function(done){

      // Assert
      client_a.on('new-message', function(message){
        expect(message).toEqual(expected);
        done();
      });

            // Arrange
      var expected = {};
      expected.name = 'Tim';
      expected.text = 'Oh shit son.';

      // Act
      client_a.emit('login', 'Tom');
      client_b.emit('login', 'Tim');

      client_a.emit('open');
      client_b.emit('join', client_a.id);

      client_b.emit('new-message', 'Oh shit son.');

    });
  });
});
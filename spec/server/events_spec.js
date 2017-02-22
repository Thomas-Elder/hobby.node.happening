var Server = require('../../server/server');

var io_client = require('socket.io-client');

describe('Events', function(){

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
  console.log('Starting the server...');
  server.start();

  beforeEach(function(done){

    // Connect a client socket to the server
    client_a = io_client(url, socketOptions);
    client_b = io_client(url, socketOptions);

    // Log connection
    client_a.on('connect', function(){
        console.log('client_a connected.');
        
        client_b.on('connect', function(){
          console.log('client_b connected.');
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

  describe('connection', function(){

    it('should emit "connect" event back to this client on connection', function(done){           
      client_a.on('connect', function(){
        expect(true).toEqual(true);
        done();
      });

      // Disconnect and reconnect the client_a to fire event.
      client_a.disconnect();
      client_a.connect(url, socketOptions); 
    });

    it('should emit "disconnect" event back to this client on disconnection', function(done){           
      client_a.on('disconnect', function(){
        expect(true).toEqual(true);
        done();
      });

      // Disconnect the client_a to fire event.
      client_a.disconnect();
    });

    it('should emit "user-connected" event to other clients on connection', function(done){    
      client_b.on('user-connected', function(){
        expect(true).toEqual(true);
        done();
      });

      // Disconnect and reconnect the client_a to fire event.
      client_a.disconnect();
      client_a.connect(url, socketOptions);      
    });

    it('should emit "user-disconnected" event to other clients on disconnection', function(done){           
      client_b.on('user-disconnected', function(){
        expect(true).toEqual(true);
        done();
      });

      // Disconnect the client_a to fire event.
      client_a.disconnect();
    });
  });

  describe('chat', function(){

    it('should send a "new-login" event when a "login" event is received', function(done){
      client_a.on('new-login', function(expected){
        expect(true).toEqual(true);
        done();
      });

      var expected = {};
      expected.name = 'Tom';

      client_b.emit('login', expected);
    });

    it('should the user details to other users when a "login" event is received', function(done){
      client_a.on('new-login', function(data){
        expect(data).toEqual(expected);
        done();
      });

      var expected = {};
      expected.name = 'Tom';

      client_b.emit('login', expected);
    });

    it('should send a "new-message" event when a "new-message" event is received', function(done){
      client_a.on('new-message', function(data){
        expect(true).toEqual(true);
        done();
      });

      var expected = {};
      expected.name = 'Tom';
      expected.msg = 'Blah de blah';

      client_b.emit('new-message', expected);
    });

    it('should forward the message sent to the other client', function(done){
      client_a.on('new-message', function(data){
        expect(data).toEqual(expected);
        done();
      });

      var expected = {};
      expected.name = 'Tom';
      expected.msg = 'Blah de blah';

      client_b.emit('new-message', expected);
    });
  });
});
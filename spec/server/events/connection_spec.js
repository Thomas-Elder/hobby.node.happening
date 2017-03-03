var Server = require('../../../server/server');

var io_client = require('socket.io-client');

describe('connection', function(){

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

  describe('connection', function(){

    it('should emit "connect" event back to this client on connection', function(done){           
      
      // Assert
      client_a.on('connect', function(){
        expect(true).toEqual(true);
        done();
      });

      // Act
      client_a.disconnect();
      client_a.connect(url, socketOptions); 
    });

    it('should emit "disconnect" event back to this client on disconnection', function(done){           
      
      // Assert
      client_a.on('disconnect', function(){
        expect(true).toEqual(true);
        done();
      });

      // Act
      client_a.disconnect();
    });

    it('should emit "user-connected" event to other clients on connection', function(done){    
      
      // Assert
      client_b.on('user-connected', function(){
        expect(true).toEqual(true);
        done();
      });

      // Act
      client_a.disconnect();
      client_a.connect(url, socketOptions);      
    });

    it('should emit "user-disconnected" event to other clients on disconnection', function(done){           
     
     // Assert
     client_b.on('user-disconnected', function(){
        expect(true).toEqual(true);
        done();
      });

      // Act
      client_a.disconnect();
    });
  });
});
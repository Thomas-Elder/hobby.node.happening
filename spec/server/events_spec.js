var Server = require('../../server/server');

var io_client = require('socket.io-client');

describe('Single events', function(){

  var server;

  var url = 'http://localhost:8888/';
  var socketOptions = {
        'reconnection delay' : 0, 
        'reopen delay' : 0, 
        'force new connection' : true
      };
  var client;

  server = new Server();
  console.log('Starting the server...');
  server.start();

  beforeEach(function(done){

    // Connect a client socket to the server
    client = io_client(url, socketOptions);

    // Log connection
    client.on('connect',
      function(){
        console.log('client connected.');
        done();
    });

    // Log connection error
    client.on('connect_error', function(err){
      console.log('client not connected, there was an error.', err);
      done();
    });
  });
  
  afterEach(function(done){
    client.disconnect(true);
    done();
  });

  describe('connection', function(){

    it('should emit "connect" event to this client on connection', function(done){           
      client.on('connect', function(){
        expect(true).toEqual(true);
        done();
      });

      // Disconnect and reconnect the client to fire event.
      client.disconnect();
      client.connect(url, socketOptions); 
    });

    it('should emit "disconnect" event to this client on connection', function(done){           
      client.on('disconnect', function(){
        expect(true).toEqual(true);
        done();
      });

      // Disconnect the client to fire event.
      client.disconnect();
    });
  });
});
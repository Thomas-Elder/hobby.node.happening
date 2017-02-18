var request = require('request');
var io_client = require('socket.io-client');
var Server = require('../../server/server');

describe('Events', function(){

  var url = 'http://localhost:8888/';
  var socketOptions = {
        'reconnection delay' : 0, 
        'reopen delay' : 0, 
        'force new connection' : true
      };

  var client_emit;
  var client_rcv;
  
  server = new Server();
  console.log('Starting the server...');
  server.start();

  beforeEach(function(done){

    // Connect a client socket to the server
    client_emit = io_client(url, socketOptions);

    // Connect a separate client socket to the server
    client_rcv = io_client(url, socketOptions);

    // Log connection
    client_emit.on('connect', function(){
      console.log('socket_emit connected.');
    });

    client_rcv.on('connect', function(){
      console.log('client_rcv connected.');
      done();
    });
  });
  
  afterEach(function(done){
      
    // Disconnect both sockets
    client_emit.disconnect(0);
    client_rcv.disconnect(0);

    done();
  });

  it('should respond with a "connected" event on connection', function(done){

    client_emit.on('connected', function(msg){
      expect(true).toEqual(true);
      done();
    });
  });
});
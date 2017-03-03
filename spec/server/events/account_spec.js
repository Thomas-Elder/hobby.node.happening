var Server = require('../../../server/server');

var io_client = require('socket.io-client');

describe('account', function(){

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
      done();
    });

    client_b.on('connect_error', function(err){
      console.log('client_b not connected, there was an error.', err);
      done();
    });
  });
  
  afterEach(function(done){
    client_a.disconnect(true);
    client_b.disconnect(true);
    done();
  });

  describe('login', function(){
    
    it('should send a "new-login" event when a "login" event is received', function(done){

      // Assert
      client_a.on('new-login', function(expected){
        expect(true).toEqual(true);
        done();
      });

      // Arrange
      var expected = 'Tom';

      // Act
      client_b.emit('login', 'Tom');
    });

    it('should pass the user details to other users when a "login" event is received', function(done){

      // Assert
      client_a.on('new-login', function(data){
        expect(data).toEqual(expected);
        done();
      });

      // Arrange
      var expected = 'Tom';

      // Act
      client_b.emit('login', 'Tom');
    });
  });

  describe('logout', function(){
    
    it('should send a "new-logout" event when a "logout" event is received', function(done){

      // Assert
      client_a.on('new-logout', function(expected){
        expect(true).toEqual(true);
        done();
      });

      // Arrange
      var expected = 'Tom';

      // Act
      client_b.emit('login', 'Tom');
      client_b.emit('logout');
    });

    it('should pass the user details to other users when a "logout" event is received', function(done){

      // Assert
      client_a.on('new-logout', function(data){
        expect(data).toEqual(expected);
        done();
      });

      // Arrange
      var expected = 'Tom';

      // Act
      client_b.emit('login', 'Tom');
      client_b.emit('logout');
    });
  });
});
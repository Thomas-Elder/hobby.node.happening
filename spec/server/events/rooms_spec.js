var Server = require('../../../server/server');

var io_client = require('socket.io-client');

describe('rooms', function(){

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

  describe('new', function(){

    it('should emit a "new-room" event when an "open" event is received', function(done){
      
      // Assert
      client_a.on('new-room', function(expected){
        expect(true).toEqual(true);
        done();
      });

      // Act
      client_b.emit('open');
    });

    it('should pass the room id on to other users when an "open" event is received', function(done){
      
      // Assert
      client_a.on('new-room', function(room){
        expect(room).toEqual(expected);
        done();
      });

      // Arrange
      var expected = client_b.id;

      // Act
      client_b.emit('open');
    });
  });

  describe('join', function(){

    it('should emit a "user-joined" event when a "join" event is received', function(done){
      
      // Assert
      client_a.on('user-joined', function(){
        expect(true).toEqual(true);
        done();
      });
      
      // Arrange
      var expected = 'Tom';

      // Act
      client_a.emit('login', 'Tom');
      client_b.emit('login', 'Tim');

      client_a.emit('open');
      client_b.emit('join', client_a.id);
    });

    it('should pass the new users name on to other clients in the room when a "join" event is received', function(done){
      
      // Assert
      client_a.on('user-joined', function(name){
        expect(name).toEqual(expected);
        done();
      });

      // Arrange
      var expected = 'Tim';

      // Act
      client_a.emit('login', 'Tom');
      client_b.emit('login', 'Tim');
      
      client_a.emit('open');
      client_b.emit('join', client_a.id);

    });
  }); 

  describe('bail', function(){

    it('should emit a "user-bailed" event when a "bail" event is received', function(done){
      
      // Assert
      client_a.on('user-bailed', function(name){
        expect(true).toEqual(true);
        done();
      });
      
      // Arrange
      var expected = 'Tim';

      // Act
      client_a.emit('login', 'Tom');
      client_b.emit('login', 'Tim');

      client_a.emit('open');

      client_b.on('new-room', function(room){
        client_b.emit('join', room);

        client_a.on('user-joined', function(){
          client_b.emit('bail');
        });
      }); 
    });

    it('should pass the bailing users name on to other clients in the room when a "bail" event is received', function(done){
      
      // Assert
      client_a.on('user-bailed', function(name){
        expect(name).toEqual(expected);
        done();
      });
      
      // Arrange
      var expected = 'Tim';

      // Act
      client_a.emit('login', 'Tom');
      client_b.emit('login', 'Tim');

      client_a.emit('open');

      client_b.on('new-room', function(room){
        client_b.emit('join', room);

        client_a.on('user-joined', function(){
          client_b.emit('bail');
        });
      }); 
    });

    it('should emit a "room-closed" event when the bailing user is the "host"', function(done){
      
      // Assert
      client_a.on('room-closed', function(){
        expect(true).toEqual(true);
        done();
      });
      
      // Arrange
      var expected = 'Tim';

      // Act
      client_a.emit('login', 'Tom');
      client_b.emit('login', 'Tim');

      client_b.emit('open');

      client_a.on('new-room', function(room){
        client_a.emit('join', room);

        client_b.on('user-joined', function(){
          client_b.emit('bail');
        });
      });      
    });
  }); 
});
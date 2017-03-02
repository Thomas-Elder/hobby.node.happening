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

  describe('rooms', function(){

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
        client_b.emit('join', client_a.id);
        client_b.emit('bail');
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
        client_b.emit('join', client_a.id);
        client_b.emit('bail');
      });
    }); 
  });
  
  describe('chat', function(){

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
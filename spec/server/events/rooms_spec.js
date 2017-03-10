var async = require('async');

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
  var client_c;

  server = new Server();
  server.start();

  beforeEach(function(done){

    // Connect a client socket to the server
    client_a = io_client(url, socketOptions);
    client_b = io_client(url, socketOptions);
    client_c = io_client(url, socketOptions);

    client_a.on('connect', function(){      
      client_b.on('connect', function(){
        client_c.on('connect', function(){
          client_a.emit('login', 'Tom');
          client_b.emit('login', 'Tim');
          client_c.emit('login', 'Tum');
          done();
        })
      });
    });
  });
  
  afterEach(function(done){
    client_a.emit('bail');
    client_b.emit('bail');
    client_c.emit('bail');

    client_a.disconnect(true);
    client_b.disconnect(true);
    client_c.disconnect(true);
    done();
  });

  describe('new', function(){

    it('should emit a "new-room" event when an "open" event is received', function(done){
      
      // Assert
      client_a.on('new-room', function(room, rooms){
        expect(true).toEqual(true);
        done();
      });

      // Act
      client_b.emit('open');
    });

    it('should pass the room id on to other users when an "open" event is received', function(done){
      
      // Assert
      client_a.on('new-room', function(room, rooms){
        expect(room).toEqual(expected);
        done();
      });

      // Arrange
      var expected = client_b.id;

      // Act
      client_b.emit('open');
    });

    it('should keep track of the new room when an "open" event is received', function(done){
      
      // Assert
      client_a.on('new-room', function(room, rooms){
        expect(rooms).toEqual(expected);
        done();
      });

      // Arrange
      var expected = [{ id:client_b.id, users:[client_b.id] }];

      // Act
      client_b.emit('open');
    });

    it('should keep track of the new rooms when a second "open" event is received', function(done){
      
      // Assert
      client_b.on('new-room', function(room, rooms){
        expect(rooms).toEqual(expected);
        done();
      });

      // Arrange
      var expected = [{id:client_b.id, users:[client_b.id]}, {id:client_a.id, users:[client_a.id]}];

      // Act
      client_b.emit('open');
      client_a.on('new-room', function(){
        client_a.emit('open');
      });
    });
  });

  describe('join', function(){

    it('should emit a "user-joined" event when a "join" event is received', function(done){
      
      // Assert
      client_a.on('user-joined', function(name, usersInRoom){
        expect(true).toEqual(true);
        done();
      });
      
      // Arrange
      var expected = 'Tom';

      // Act
      client_a.emit('open');
      client_b.on('new-room', function(room){
        client_b.emit('join', room);
      });      
    });

    it('should pass the new users name on to other clients in the room when a "join" event is received', function(done){
      
      // Assert
      client_a.on('user-joined', function(name, usersInRoom){
        expect(name).toEqual(expected);
        done();
      });

      // Arrange
      var expected = 'Tim';

      // Act
      client_a.emit('open');

      client_b.on('new-room', function(){
        client_b.emit('join', client_a.id);
      });
    });

    it('should maintain a list of the users in the room', function(done){
      
      // Assert
      client_a.on('user-joined', function(name, usersInRoom){
        expect(usersInRoom).toEqual(expected);
        done();
      });

      // Arrange
      var expected = [client_b.id, client_a.id];
      expected.sort();

      // Act
      client_a.emit('open');

      client_b.on('new-room', function(){
        client_b.emit('join', client_a.id);
      });
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
      client_a.emit('open');

      client_b.on('new-room', function(room){
        client_b.emit('join', room);

        client_a.on('user-joined', function(){
          client_b.emit('bail');
        });
      }); 
    });

    it('should maintain a list of the users in the room', function(done){
      
      // Assert
      client_a.on('user-bailed', function(name, usersInRoom){
        expect(usersInRoom).toEqual(expected);
        done();
      });

      // Arrange
      var expected = [client_a.id];
      expected.sort();

      // Act
      client_a.emit('open');

      client_b.on('new-room', function(room){
        client_b.emit('join', room);

        client_a.on('user-joined', function(){
          client_b.emit('bail');
        });
      }); 
    });

    it('should emit a "room-closed" event when there are no users left in the room', function(done){
      
      // Assert
      client_b.on('room-closed', function(room, rooms){
        expect(true).toEqual(true);
        done();
      });

      client_a.on('new-room', function(room){
        client_a.emit('join', room);

        client_b.on('user-joined', function(){
          client_b.emit('bail');

          client_a.on('user-bailed', function(){
            client_a.emit('bail')
          });
        });
      });

      client_b.emit('open');      
    });

    it('should send the room id along with the "room-closed" event', function(done){
      
      // Assert
      client_b.on('room-closed', function(room, rooms){
        expect(room).toEqual(expected);
        done();
      });

      var expected = client_b.id;

      client_a.on('new-room', function(room){
        client_a.emit('join', room);

        client_b.on('user-joined', function(){
          client_b.emit('bail');

          client_a.on('user-bailed', function(){
            client_a.emit('bail')
          });
        });
      });

      client_b.emit('open');      
    });

    it('should send a list of still open rooms when a room closes', function(done){
      
      // Assert
      client_a.on('room-closed', function(room, rooms){
        expect(rooms).toEqual(expected);
        done();
      });
      
      // Arrange
      var expected = [{id:client_c.id, users:[client_c.id]}];

      client_c.on('new-room', function(room){
        client_a.emit('join', room);

        client_b.on('user-joined', function(){
          client_b.emit('bail');

          client_a.on('user-bailed', function(){
            client_a.emit('bail')
          });
        });
      });

      client_b.emit('open');
      client_c.emit('open');      
    });
  }); 
});
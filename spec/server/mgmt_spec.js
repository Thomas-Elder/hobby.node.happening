var Manager = require('../../server/mgmt').Manager;
var User = require('../../server/mgmt').User;
var Room = require('../../server/mgmt').Room;

describe('Mgmt', function(){

  beforeEach(function(done){

    done();
  });

  afterEach(function(done){

    done();
  });
  
  describe('sorting', function(){

    it('should maintain a sorted array of User objects', function(done){

      var manager = new Manager();

      var user_a = new User('123', 'Tom');
      var user_b = new User('456', 'Tim');
      var user_c = new User('789', 'Tum');

      manager.AddUser(user_c);
      manager.AddUser(user_b);
      manager.AddUser(user_a);

      var expected = [user_a, user_b, user_c];
      var result = manager.users;

      expect(result).toEqual(expected);
      done();
    });

    it('should maintain a sorted array of Room objects', function(done){

      var manager = new Manager();

      var user_a = new User('147', 'Tom');
      var user_b = new User('258', 'Tim');
      var user_c = new User('369', 'Tum');

      var room_a = new Room('123', user_a);
      var room_b = new Room('456', user_b);
      var room_c = new Room('789', user_c);

      manager.AddRoom(room_c);
      manager.AddRoom(room_b);
      manager.AddRoom(room_a);

      var expected = [room_a, room_b, room_c];
      var result = manager.rooms;

      expect(result).toEqual(expected);
      done();
    });
  });

  describe('addUserToRoom', function(){

    it('should add users to specifed rooms', function(done){

      var manager = new Manager();

      var user_a = new User('147', 'Tom');
      var user_b = new User('258', 'Tim');
      var user_c = new User('369', 'Tum');

      var room_a = new Room('123', user_a);
      var room_b = new Room('789', user_c);

      manager.AddUser(user_c);
      manager.AddUser(user_b);
      manager.AddUser(user_a);

      manager.AddRoom(room_b);
      manager.AddRoom(room_a);

      manager.AddUserToRoom(room_a, user_b);

      var expected_a = [user_a, user_b];
      var expected_b = [user_c];

      var result_a = room_a.users;
      var result_b = room_b.users;

      expect(result_a).toEqual(expected_a);
      expect(result_b).toEqual(expected_b);
      done();
    });

    it('should not add users to specifed rooms if they\'re already assigned to a room', function(done){

      var manager = new Manager();

      var user_a = new User('147', 'Tom');
      var user_b = new User('258', 'Tim');
      var user_c = new User('369', 'Tum');

      var room_a = new Room('123', user_a);
      var room_b = new Room('789', user_c);

      manager.AddUser(user_c);
      manager.AddUser(user_b);
      manager.AddUser(user_a);

      manager.AddRoom(room_b);
      manager.AddRoom(room_a);

      manager.AddUserToRoom(room_a, user_b);
      manager.AddUserToRoom(room_a, user_c);

      var expected_a = [user_a, user_b];
      var expected_b = [user_c];

      var result_a = room_a.users;
      var result_b = room_b.users;

      expect(result_a).toEqual(expected_a);
      expect(result_b).toEqual(expected_b);
      done();
    });
  });

  describe('RmUser', function(){
    it('should rm users from specifed rooms', function(done){

      var manager = new Manager();

      var user_a = new User('147', 'Tom');
      var user_b = new User('258', 'Tim');
      var user_c = new User('369', 'Tum');

      var room_a = new Room('123', user_a);
      var room_b = new Room('789', user_c);

      manager.AddUser(user_c);
      manager.AddUser(user_b);
      manager.AddUser(user_a);

      manager.AddRoom(room_b);
      manager.AddRoom(room_a);

      manager.AddUserToRoom(room_a, user_b);

      var expected_a = [user_a, user_b];
      var expected_b = [user_c];

      var result_a = room_a.users;
      var result_b = room_b.users;

      expect(result_a).toEqual(expected_a);
      expect(result_b).toEqual(expected_b);
      done();
    });
  });

  describe('User', function(){

    it('should maintain the properties of the user', function(done){
     
      var user = new User('123', 'Tom');

      expect(user.id).toEqual('123');
      expect(user.name).toEqual('Tom');
      done();
    });

    it('should set the user\'s name to "None" if no name is passed in to the constructor', function(done){
      
      var user = new User('123');

      expect(user.id).toEqual('123');
      expect(user.name).toEqual('None');
      done();
    });

    it('should change the user\'s name when the name() function is called', function(done){
      
      var user = new User('123');
      var name = user.Name('Tom');

      expect(user.id).toEqual('123');
      expect(user.name).toEqual('Tom');
      expect(name).toEqual('Tom');
      done();
    });

    it('should return null as the property user.roomId when a room hasn\'t been set', function(done){
      
      var user = new User('123');
      var result = user.roomId;

      expect(result).toEqual(null); 
      done();
    });

    it('should return the room id of the room the user has created', function(done){
      
      var user = new User('123', 'Tom');
      var room = new Room('456', user);

      expect(user.roomId).toEqual(room.id); 
      done();
    });
  });

  describe('Room', function(){

    it('should maintain the properties of the room', function(done){
      
      var user = new User('123', 'Tom');
      var room = new Room('456', user);
      
      expect(room.id).toEqual('456');
      expect(room.creator).toEqual(user);
      expect(room.users).toEqual([user]);
      expect(room.empty).toEqual(false);
      done();
    });

    it('should add a user to the room.users array when Add() is called', function(done){
      
      var user = new User('123', 'Tom');
      var room = new Room('456', user);
      
      var newUser = new User('789', 'Tim');

      room.Add(newUser);

      expect(room.users).toEqual([user, newUser]);
      done();
    });

    it('should remove a user from the room.users array when Rm() is called', function(done){
      
      var user = new User('123', 'Tom');
      var room = new Room('456', user);
      
      var newUser = new User('789', 'Tim');

      room.Add(newUser);
      room.Rm(newUser);

      expect(room.users).toEqual([user]);
      done();
    });
  });
});
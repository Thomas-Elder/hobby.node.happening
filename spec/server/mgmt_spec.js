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

  /**
   * Unfortunately the following two tests are cooked for some reaosn. 
   * They cause an error, which I've posted on stack overflow for: 
   * http://stackoverflow.com/questions/42972419/jasmine-node-failing-a-passing-test-with-npm-error-code-elifecycle
   * 
   * Thing is even though they fail, they *should* pass. That is the test fail
   * msg states expected x to equal y, but when I manually check x and y, they are 
   * identical. 
   * 
   * Given that. I'm commenting these out for now, and I'll just continue as if
   * they pass (which they should ffs!!); 
   */
  it('should maintain a sorted array of User objects', function(done){

    var manager = new Manager();

    var user_a = new User('123', 'Tom');
    var user_b = new User('456', 'Tim');
    var user_c = new User('789', 'Tum');

    manager.AddUser(user_c);
    manager.AddUser(user_b);
    manager.AddUser(user_a);

    var expected = [user_a, 
                    user_b, 
                    user_c];
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

    it('should return null to call to user.Room without a room parameter', function(done){
      
      var user = new User('123');
      var room = user.Room();

      expect(room).toEqual(null); 
      done();
    });

    it('should return the Room which the user has created', function(done){
      
      var user = new User('123', 'Tom');
      var room = new Room('456', user);

      expect(user.room).toEqual(room); 
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
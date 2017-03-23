var Mgmt = require('../../server/mgmt').Mgmt;
var User = require('../../server/mgmt').User;
var Room = require('../../server/mgmt').Room;

describe('Mgmt', function(){

  beforeEach(function(done){

    done();
  });

  afterEach(function(done){

    done();
  });

  iit('should maintain a sorted array of User objects', function(done){

    var manager = new Mgmt();

    var user_a = new User('123', 'Tom');
    var user_b = new User('456', 'Tim');
    var user_c = new User('789', 'Tum');

    manager.AddUser(user_c);
    manager.AddUser(user_b);
    manager.AddUser(user_a);

    var expected = [{id:'123', name:'Tom'}, 
                    {id:'456', name:'Tim'}, 
                    {id:'789', name:'Tum'}];
    var result = manager.users;

    expect(result).toEqual(expected);
    done();
  });

  it('should maintain a sorted array of Room objects', function(done){

    var manager = new Mgmt();

    var user_a = new User('147', 'Tom');
    var user_b = new User('258', 'Tim');
    var user_c = new User('369', 'Tum');

    var room_a = new Room('123', user_a);
    var room_b = new Room('456', user_b);
    var room_c = new Room('789', user_c);

    manager.AddRoom(room_c);
    manager.AddRoom(room_b);
    manager.AddRoom(room_a);

    var expected = [{id:'123', creator: {id:'147', name:'Tom'}, users: [{id:'147', name:'Tom'}], empty: false}, 
                    {id:'456', creator: {id:'258', name:'Tim'}, users: [{id:'258', name:'Tim'}], empty: false}, 
                    {id:'789', creator: {id:'369', name:'Tum'}, users: [{id:'369', name:'Tum'}], empty: false}];
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
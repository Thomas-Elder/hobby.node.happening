var mgmt = require('../../server/mgmt');

describe('mgmt', function(){

  beforeEach(function(done){

    done();
  });

  afterEach(function(done){

    done();
  });

  describe('user', function(){

    iit('should maintain the properties of the user', function(done){
     
      var user = new mgmt.User('123', 'Tom');

      expect(user.id).toEqual('123');
      expect(user.name).toEqual('Tom');
      done();
    });

    iit('should set the user\'s name to "None" if no name is passed in to the constructor', function(done){
      
      var user = new mgmt.User('123');

      expect(user.id).toEqual('123');
      expect(user.name).toEqual('None');
      done();
    });

    iit('should change the user\'s name when the name() function is called', function(done){
      
      var user = new mgmt.User('123');
      var name = user.Name('Tom');

      expect(user.id).toEqual('123');
      expect(user.name).toEqual('Tom');
      expect(name).toEqual('Tom');
      done();
    });
  });

  describe('room', function(){

    iit('should maintain the properties of the room', function(done){
      
      var user = new mgmt.User('123', 'Tom');
      var room = new mgmt.Room('456', user);
      
      expect(room.id).toEqual('456');
      expect(room.creator).toEqual(user);
      expect(room.users).toEqual([user]);
      expect(room.empty).toEqual(false);
      done();
    });

    iit('should add a user to the room.users array when Add() is called', function(done){
      
      var user = new mgmt.User('123', 'Tom');
      var room = new mgmt.Room('456', user);
      
      var newUser = new mgmt.User('789', 'Tim');

      room.Add(newUser);

      expect(room.users).toEqual([user, newUser]);
      done();
    });

    iit('should remove a user from the room.users array when Rm() is called', function(done){
      
      var user = new mgmt.User('123', 'Tom');
      var room = new mgmt.Room('456', user);
      
      var newUser = new mgmt.User('789', 'Tim');

      room.Add(newUser);
      room.Rm(newUser);

      expect(room.users).toEqual([user]);
      done();
    });
  });
});
var mgmt = require('../../server/mgmt');

describe('mgmt', function(){

  beforeEach(function(done){

    done();
  });

  afterEach(function(done){

    done();
  });

  describe('user', function(){

    iit('should do the thing', function(done){
      var user = new mgmt.User('123');

      expect(user.id).toEqual('123');
      done();
    });
  });

  describe('room', function(){

    it('should also do the thing', function(done){

      done();
    });
  });
});
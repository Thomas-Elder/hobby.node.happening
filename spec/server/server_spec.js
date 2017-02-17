var Server = require('../../server/server');

var request = require('request');

describe('Server', function(){
    
  var server;
  
  var port = 8888;
  var url = 'http://localhost:' + port;

  beforeEach(function(done){
    server = new Server();
    console.log('Starting the server...');
    server.start();
    done();
  });
  
  afterEach(function(done){
    server.stop();
    done();
  });
    
  describe('connection', function(){
      
    it('should return OK statusCode to a request for "/"', function(done){
        
      request.get(
      {
        'url':url + "/"
      },
      function(err, res){

        if(res === undefined)
          throw new Error(err);
        
        expect(res.statusCode).toBe(200);
        done();
      });
    });

    it('should return OK statusCode to a request for "/gibberish"', function(done){
      request.get(
        {
          'url':url + "/gibberish"
        },
        function(err, res){

          if(res === undefined)
            throw new Error(err);
          
          expect(res.statusCode).toBe(200);
          done();
      });
    });   
  });  

  describe('resources', function(){
      
    it('should return OK statusCode to a request for "/static/style.css"', function(done){
        
      request.get(
      {
        'url':url + "/"
      },
      function(err, res){

        if(res === undefined)
          throw new Error(err);
        
        expect(res.statusCode).toBe(200);
        done();
      });
    });   
  });  
});
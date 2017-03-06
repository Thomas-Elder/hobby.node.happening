var Server = require('../../../server/server');

var io_client = require('socket.io-client');

describe('connection', function(){

  var server;

  var url = 'http://localhost:8888/';
  var socketOptions = {
        'reconnection delay' : 0, 
        'reopen delay' : 0, 
        'force new connection' : true,
      };
  var client_a;
  var client_b;

  server = new Server();
  server.start();

  describe('connection', function(){

    iit('should emit "connect" event back to this client on connection', function(done){           
      
      client_a = io_client(url, socketOptions);

      client_a.on('connect', function(){
        
        client_a.on('disconnect', function(){

          client_a.on('connect', function(){
            expect(true).toEqual(true);

            client_a.disconnect();
            done();
          });

          client_a.connect(url, socketOptions);
        });

        client_a.disconnect();
      });
    });

    iit('should emit "disconnect" event back to this client on disconnection', function(done){           

      client_a = io_client(url, socketOptions);

      client_a.on('connect', function(){
        
        client_a.on('disconnect', function(){
          expect(true).toEqual(true);

          client_a.disconnect();
          done();
        });

        client_a.disconnect();
      });
    });

    iit('should emit "user-connected" event to other clients on connection', function(done){    
      
      client_a = io_client(url, socketOptions);
      client_b = io_client(url, socketOptions);

      client_a.on('connect', function(){

        client_b.on('connect', function(){

          client_a.on('disconnect', function(){

            client_b.on('user-connected', function(){
              expect(true).toEqual(true);

              client_a.disconnect();
              client_b.disconnect();
              done();
            });

            client_a.connect(url, socketOptions);
          });

          client_a.disconnect();
        });
      });
    });

    iit('should emit "user-disconnected" event to other clients on disconnection', function(done){           
     
      client_a = io_client(url, socketOptions);
      client_b = io_client(url, socketOptions);

      client_a.on('connect', function(){
        
        client_b.on('connect', function(){

          client_a.on('disconnect', function(){

            client_b.on('user-disconnected', function(){
              expect(true).toEqual(true);

              client_a.disconnect();
              client_b.disconnect();
              done();
            });
          });

          client_a.disconnect();
        });
      });
    });
  });
});

var express = require('express');
var app = express();

var server = require('http').createServer(app);

var path = require('path');

var events = require('./events')(server);

var Server = function(){

  app.set('port', 8888);

  app.set('views', path.join(__dirname, './views'));
  app.set('view engine', 'pug');

  app.use('/static', express.static(path.join(__dirname, '../client')));
  
  app.get('/', function(req, res){
    res.render('index', {title: "H A P P E N I N G"})
  });

  app.get('*', function(req, res){
    res.render('none', {title: "N O T H I N G T O S E E H E R E"})
  });
};

Server.prototype.start = function() {
  server.listen(app.get('port'), function(){
    console.log('Express server listening on port: ' + app.get('port'));
  })
};

Server.prototype.stop = function() {
  server.close();
};

module.exports = Server;
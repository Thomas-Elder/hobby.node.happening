
var http = require('http');
var express = require('express');
var app, server;

var path = require('path');

var Server = function(){
  app = express();
  server = http.createServer(app);

  app.set('port', 8888);

  app.set('views', path.join(__dirname, './views'));
  app.set('view engine', 'pug');

  app.get('/', function(req, res){
    res.render('index', {title: "H A P P E N I N G"})
  });

  app.get('*', function(req, res){
    res.render('none', {title: "N O T H I N G T O S E E H E R E"})
  });

  app.use('/static', express.static(path.join(__dirname, '../client')));
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
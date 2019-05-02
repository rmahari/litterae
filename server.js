var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
// var io = require('socket.io')(http);

var application_root = process.env.application_root || process.cwd();
var port = process.env.port || 3000;


app.use(express.static(path.resolve('./gr4')));
app.get('/', function(req, res){res.sendFile(path.resolve('./gr4/app.htm'));});


http.listen(port, function(){
  console.log('listening on *:3000');
});

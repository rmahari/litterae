var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(path.resolve('../gr4')));
app.get('/', function(req, res){res.sendFile(path.resolve('../gr4/index.htm'));});


var annotations = {};
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('requestload', function() {
      console.log('requestload');
      socket.emit('loadannotations', annotations);
  });
  socket.on('newannotation', function(annotation) {
      console.log('newannotation');
      annotations[annotation.id] = annotation;
      socket.broadcast.emit('newannotation', annotation);
  });
  socket.on('deleteannotation', function(aid) {
      console.log('deleteannotation');
      delete annotations[aid];
      socket.broadcast.emit('deleteannotation', aid);
  });
  socket.on('editannotation', function(annotation) {
      console.log('editannotation');
      annotations[annotation.id] = annotation;
      socket.broadcast.emit('editannotation', annotation);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

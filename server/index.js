const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
io.set('origins', '*:*');

let db;
const MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true }, (err, client) => {
  if(err){
    return console.log(err);
  }

  db = client.db('retroboard');
  db.collection('default').find().each((err, docs) => {
        if(err){return console.log(err)};
        console.log(docs);
  });
  // ... start the server
  http.listen(3000, function(){
    console.log('listening on *:3000');
  });
});

app.get('/', function(req, res){
  res.sendStatus(404);
});

io.on('connection', function(socket){
  console.log('a user connected');
  db.collection('default').find().toArray((err, results) => {
    socket.emit('connected', results);
  });

  socket.on('save', function(message){
    console.log('saving message: ' + message.listId + ':' + message.id);
    db.collection('default').updateOne({id: message.id}, {$set: { id: message.id, listId: message.listId, text: message.text}}, {upsert: true});
  });

  socket.on('remove', function(id){
    console.log('removing message: ' + id);
    db.collection('default').remove({id: id});
  });

  socket.on('message', function(message){
    io.emit('message return', message);
  });


});

io.on('message', function(message){
  console.log(message);
});
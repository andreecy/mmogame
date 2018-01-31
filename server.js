var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));

app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html');
})

server.lastPlayerId = 0;

io.on('connection',function(socket){
    socket.on('newplayer',function(){
        console.log('new player connected');        
        socket.player = {
            id: server.lastPlayerId++,
            x: randomInt(100,400),
            y: randomInt(100,400),
        }

        socket.emit('allplayers',getAllPlayer());
        socket.broadcast.emit('newplayer',socket.player);
    });

    socket.on('click',function(data){
        console.log('click to '+data.x+', '+data.y, new Date());
        socket.player.x = data.x;
        socket.player.y = data.y;
        io.emit('move',socket.player);
    });

    socket.on('disconnect',function(){
        io.emit('remove',socket.player.id);
    });

    socket.on('ping',function(){
        console.log('server rechive ping');
        io.emit('pingclient',true);
    })
});

function getAllPlayer(){
    console.log('get all players')
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if(player) players.push(player);
    });
    console.log(players);
    return players;
}

function randomInt(low, high){
    return Math.floor(Math.random() * (high - low) + low);
}

server.listen(8081,function(){
    console.log('Listening on '+ server.address().port);
});
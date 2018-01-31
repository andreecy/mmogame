var Client = {};
Client.socket = io.connect();

Client.askNewPlayer = function(){
    Client.socket.emit('newplayer');
}

Client.socket.on('newplayer', function(data){
    Game.addNewPlayer(data.id,data.x,data.y);
})

Client.socket.on('allplayers',function(data){
    // console.log(data);
    for(var i=0; i < data.length; i++){
        Game.addNewPlayer(data[i].id, data[i].x, data[i].y);
    }
})

Client.socket.on('remove',function(id){
    Game.removePlayer(id);
})

Client.sendClick = function(x,y){
    console.log('client send click at', new Date());
    Client.socket.emit('click',{x:x,y:y});
};

Client.socket.on('move',function(data){
    Game.movePlayer(data.id,data.x,data.y);
});

Client.socket.on('pingclient',function(bool){
    console.log('client receive callback from server');
})
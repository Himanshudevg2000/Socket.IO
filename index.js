const express = require('express');
// var http = require('http').Server(app);


// var io = require('socket.io')(http);
const app = express()
const http = require("http")
const server = http.createServer(app)
const {Server} = require("socket.io")
const io = new Server(server)

var cors = require('cors')
var path = require('path');

app.use(cors('*'))
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    next();
});


app.get('/', function(req,res){
    var options = {
        root: path.join(__dirname)
    }
    var fileName = 'index.html';
    res.sendFile(fileName,options);
})

// let users = 0;
// let roomno = 1;

let users = [];

io.on('connection',function(socket){
    // socket.emit('custom', 'message from server side');
    // users++;
    // socket.emit('newuserconnect', {message: 'Hello, Welcome here...'});
    // socket.broadcast.emit('newuserconnect', {message: users + 'users connected!'})
    // socket.join('room-'+roomno);
    // io.sockets.in('room-'+roomno).emit('connectedRoom',`You are connected to room no: ${roomno} `,)

    console.log('User connected');
    socket.on('setUserName', function(data){
        console.log(data+' User connected');
        if(users.indexOf(data) > -1){
            socket.emit('userExists', data+'username is already exist');
        }
        else{
            users.push(data);
            socket.emit('setuser',{username:data});
            console.log(data);
        }
    });

    socket.on('msg', function(data){
        io.sockets.emit('newmsg', data);
        console.log(data)
    });

    socket.on('disconnect',function(){
        console.log("User disconnected");
        users--;
        socket.broadcast.emit('broadcast', {message: users + 'users connected!'})
    });
});


server.listen(3000, function(){
    console.log("Server conneceted on 3000 port")
})
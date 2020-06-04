// code for running server, receiving socket messages and send them back out to the client
const express = require('express');
const app = express();
const server = app.listen(3001);

app.use(express.static('public'));

console.log('Socket server is running on port 3001');

// require socket.io
const socket = require('socket.io');

// connect to particular web server
const io = socket(server);

// handle new connections
io.sockets.on('connection', newConnection);

// function that handles new connections
function newConnection(socket) {
    console.log('new connection: ' + socket.id);

    socket.on('mouse', mouseMsg);

    // function that receives messages and send them back out immediately
    function mouseMsg(data) {
        // when a message comes into server, broadcast it further
        socket.broadcast.emit('mouse', data);
        // send it also to the message sender
        // io.socket.emit('mouse', data);
        console.log(data);
    }
}

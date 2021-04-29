const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

const public = path.join(__dirname, 'public');

app.get('/', (req, res) => {
    res.sendFile(path.join(public, 'index.html'));
});

app.get('/chat', (req, res) => {
    res.sendFile(path.join(public, 'chat.html'));
})

io.on('connection', (socket) => {

    socket.on('nickname', (nickname) => {
        socket.nickname = nickname;
        io.emit('chat message', `${socket.nickname} has joined the chat`);
    });

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', { nickname : socket.nickname });
    })

    socket.on('chat message', (msg) => {
        io.emit('chat message', `${socket.nickname}: ${msg}`);
    })

    socket.on('disconnect', () => {
        io.emit('chat message', `${socket.nickname} has left the chat`);
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
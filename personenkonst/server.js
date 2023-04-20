const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = socketIO(server)


// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));



const PORT = process.env.PORT || 5000;

const rooms = {};

io.on('connection', (socket) => {
    console.log('a user connected: ' + socket.id);


    // Join a room
    socket.on('join_lobby', ({pin, user}) => {
        if (rooms[pin]) {
            socket.join(pin);
            rooms[pin].clients[socket.id] = user;
            io.to(pin).emit('room_joined', {clients: rooms[pin].clients});
            socket.emit('joined_lobby', {success: true});
            if (rooms[pin].host === user) {
                socket.on('start_lobby', () => {
                    io.to(pin).emit('navigate_to_tool');
                });
            }
        } else {
            socket.emit('joined_lobby', {success: false});
        }
    });

    // Create a new room
    socket.on('create_lobby', ({author, book, host}) => {
        const pin = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        console.log(pin);
        rooms[pin] = {host, book, author, clients: {[socket.id]: host}};
        socket.join(pin);
        socket.emit('lobby_created', {pin});
    });

    // Leave a room
    socket.on('leave_lobby', ({pin}) => {
        if (rooms[pin]) {
            delete rooms[pin].clients[socket.id];
            io.to(pin).emit('room_left', {clients: rooms[pin].clients});
            socket.leave(pin);
        }
    });

    //start room
    socket.on('start_room', (pin) => {
        io.to(pin).emit('room_started', pin);
        console.log(`Room ${pin} started`);
    });


    //send array to tool
    socket.on('array', () => {
        socket.emit('array', rooms);
    });


    // When a user tries to edit the tool
    socket.on('edit_tool', ({ pin, user, data }) => {
        // Check if the user is the host
        if (rooms[pin].host === socket.id) {
            // Update the tool data
            rooms[pin].toolData = data;
            // Emit the update to all other users in the room
            socket.to(pin).emit('update_tool', { data });
        } else {
            // User is not the host, emit an error message
            socket.emit('edit_error', { message: 'Only the host can edit the tool.' });
        }
    });

// When the host sends a text message
    socket.on('text', ({ pin, message }) => {
        // Check if the user is the host
        if (rooms[pin].host === socket.id) {
            // Log the message to the console
            console.log('received text:', message);
            // Emit the message to all other users in the room
            socket.to(pin).emit('text', message);
        } else {
            // User is not the host, emit an error message
            socket.emit('text_error', { message: 'Only the host can send messages.' });
        }
    });


    socket.on('disconnect', () => {
            console.log('user disconnected');
        });

});
    server.listen(PORT, () => {
        console.log('listening on *:5000');
    });


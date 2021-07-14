const path = require('path');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server started and listening to port ${PORT}`));

// MIDDLEWARE
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// CONTROLLERS
const chatroomController = require('./controllers/ChatroomController');

// ROUTES
app.get('/', (req, res) => res.render('index'));
app.get('/chatroom*', (req, res) => res.render('chatroom'));
app.use((req, res) => res.status(404).render('404'));


// SOCKET EVENTS
io.on('connection', socket => {
    socket.on('join', data => {
        if (!data)
            return;
        chatroomController.createAndRegisterNewUser(socket.id, data.username, data.room);
        socket.join(data.room);
        io.to(data.room).emit('userRecieveMessage', chatroomController.buildMessageObject(data.username, `${data.username} has joined the chat room.`));
        io.to(data.room).emit('userJoin', chatroomController.getUserList(data.room));
        

        socket.on('userSendMessage', message => {
            io.to(data.room).emit('userRecieveMessage', chatroomController.buildMessageObject(data.username, message));
        });
    });

    socket.on('disconnect', () => {
        let user = chatroomController.disconnectUser(socket.id);
        if (user) {
            io.to(user.roomName).emit('userRecieveMessage', chatroomController.buildMessageObject(user.username, `${user.username} has left the chat room.`));
            socket.broadcast.to(user.roomName).emit('userLeave', chatroomController.getUserList(user.roomName));
        }
    });
});
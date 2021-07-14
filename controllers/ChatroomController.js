const User = require('../models/User');
const RoomManager = require('./RoomManager');
const UserManager = require('./UserManager');
const { v4: uuid } = require('uuid');

// RoomManager object
const roomManager = new RoomManager();
const userManager = new UserManager();

function createNewUser(id, username, roomName) {
    return new User(id, username, roomName);
}

function createAndRegisterNewUser(id, username, roomName) {
    let room = roomManager.findRoomByName(roomName);
    let user = createNewUser(id, username, roomName);
    userManager.registerUser(id, username, roomName);
    if (room) {
        room.addUser(user);
    } else {
        roomManager.createRoom(roomName, new Array()).addUser(user);
    }
}

function disconnectUser(userId) {
    let user = userManager.findUserById(userId);
    if (user) {
        let room = roomManager.findRoomByName(user.roomName);
        room.removeUser(user.id);
        if (room.isRoomEmpty()) {
            roomManager.deleteRoom(room.name);
        }
        userManager.unregisterUser(user.id);
    }
    return user;
}

function getUserList(roomName) {
    let room = roomManager.findRoomByName(roomName);
    if (!room)
        return [];
    let userArr = [];
    room.users.forEach(userId => userArr.push(userManager.findUserById(userId).username));
    return userArr;
}

function buildMessageObject(username, message) {
    return {
        uuid: uuid(),
        username,
        message
    }
}

module.exports = {
    createAndRegisterNewUser,
    disconnectUser,
    buildMessageObject,
    getUserList
}
const Room = require("../models/Room");

class RoomManager {
    constructor () {
        this.rooms = [];
    }

    findRoomByName(name) {
        return this.rooms.find(room => room.name == name);
    }

    createRoom(name, users) {
        let room = new Room(name, users);
        this.rooms.push(room);
        return room;
    }

    deleteRoom(name) {
        this.rooms = this.rooms.filter(room => room.name != name);
    }

}

module.exports = RoomManager;
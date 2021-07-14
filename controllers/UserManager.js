const User = require("../models/User");

class UserManager {
    constructor (){
        this.users = {};
    }

    findUserById(id) {
        return this.users[id] ? this.users[id] : null;
    }

    registerUser(id, username, roomName) {
        this.users[id] = new User(id, username, roomName);
    }

    unregisterUser(id) {
        if (this.users[id])
            delete this.users[id];
    }
}

module.exports = UserManager;
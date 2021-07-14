class Room {
    constructor (name, users) {
        this.name = name;
        this.users = users;
    }

    findUserById(id) {
        return this.users.find(user => user == id);
    }

    addUser(user) {
        this.users.push(user.id);
    }

    removeUser(id) {
        this.users = this.users.filter(user => user != id);
    }

    isRoomEmpty() {
        return this.users.length === 0;
    }
}

module.exports = Room;
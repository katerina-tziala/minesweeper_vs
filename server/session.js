"use strict";
class Session {
    constructor(id) {
        this.id = id;
        this.clients = new Set;
    }

    joinSession(client) {
        if (client.session) {
            throw new Error("client already in session");
        }
        this.clients.add(client);
        client.session = this;
    }

    leaveSession(client) {
        if (client.session !== this) {
            throw new Error("client not in session");
        }
        this.clients.delete(client);
        client.session = null;
    }

    setGameParams(game) {
        this.gameParams = game;
    }

    getGameData() {
        return this.gameParams;
    }
}
module.exports = Session;
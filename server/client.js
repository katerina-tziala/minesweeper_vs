"use strict";
class Client {
    constructor(conn, id) {
        this.conn = conn;
        this.id = id;
        this.name = id;
        this.session = null;
        this.entered = false;
    }

    send(data) {
        const msg = JSON.stringify(data);
        this.conn.send(msg, (error) => {
            if (error) {
                console.log(error);
            }
        });
    }

    setName(name) {
        this.name = name;
        this.entered = true;
    }

    getClientData() {
        return { id: this.id, name: this.name, entered: this.entered };
    }

    setNewSession(session) {
        this.session = session;
    }
}
module.exports = Client;
const WebSocketServer = require("ws").Server;
const Session = require("./session");
const Client = require("./client");
const server = new WebSocketServer({ port: 9000 });
const sessions = new Map;
const invitations = new Map;
const requestTypes = {
    initializeSession: "initialize-session",
    sessionBroadcast: "session-broadcast",
    updateClient: "update-client",
};


function generateId(len = 12, chars = "abcdefghjkmnopqrstvwxyz01234567890ABCDEFGHJKMNOPQRSTVWXYZ") {
    let id = "";
    while (len--) {
        id += chars[Math.random() * chars.length | 0];
    }
    return id;
}

function createClient(conn, id = generateId()) {
    return new Client(conn, id);

}


function createSession(id = generateId()) {
    if (sessions.has(id)) {
        throw new Error(`Session ${id} already exists`);
    }
    if (!id.startsWith("minesweeper")) {
        id = "game_" + id;
    }
    const session = new Session(id);
    sessions.set(id, session);
    return session;
}

function getSession(id) {
    return sessions.get(id);
}


function getSessionClients(session) {
    return [...session.clients];
}





function initializeSession(data, client) {
    const session = getSession(data.sessionId) || createSession(data.sessionId);
    session.joinSession(client);
    broadcastSession(session);
}

function updateClient(data) {
    console.log(data);

    const session = getSession(data.sessionId);
    const clients = getSessionClients(session);
    clients.find(client => client.id === data.clientId).setName(data.name);
    broadcastSession(session);
}


function broadcastSession(session) {
    const clients = getSessionClients(session);
    clients.forEach(client => {
        client.send({
            requestType: requestTypes.sessionBroadcast,
            clientId: client.id,
            sessionId: session.id,
            peers: clients.map(peer => peer.getClientData())
        });
    });
}



server.on("connection", conn => {
    console.log("Connection established");
    const client = createClient(conn);

    conn.on("message", msg => {
        const data = JSON.parse(msg);

 
        if (data.requestType) {
            switch (data.requestType) {
                case requestTypes.initializeSession:
                    initializeSession(data, client);
                    break;
                case requestTypes.updateClient:
                    updateClient(data);
                    break;
            }

        }


    });

    conn.on("close", () => {


        console.log("Connection closed");
        const session = client.session;

        if (session) {
            session.leaveSession(client);
            if (session.clients.size === 0) {
                sessions.delete(session.id);
            }
            broadcastSession(session);
        }
    });
});
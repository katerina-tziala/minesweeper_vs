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
    sendInvitation: "send-invitation",
    invitationReceivedByUser: "invitation-received-by-user",
    receivedInvitation: "received-invitation",
    declinedInvitation: "invitation-declined",
    acceptedInvitation: "invitation-accepted",
    startGame: "game-initialization",
    gameUpdate: "game-update",
    backToLobby: "back-to-lobby",
};
const defaultSessionId = "minesweeper_vs";

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

function sendInvitation(data) {
    const currentSession = getSession(data.sessionId);
    const clients = getSessionClients(currentSession);
    const currClient = clients.find(client => client.id === data.clientId);
    const opponent = clients.find(client => client.id === data.opponentId);
    leaveSession(currentSession, currClient);
    broadcastSession(currentSession);
    const newSession = createSession();
    newSession.joinSession(currClient);
    currClient.setNewSession(newSession);
    currClient.send({
        requestType: requestTypes.invitationReceivedByUser,
        sessionId: newSession.id
    });
    const game = data.game;
    newSession.setGameParams(game);
    invitations.set(newSession.id, { clientsPair: [data.clientId, data.opponentId] });
    opponent.send({
        requestType: requestTypes.receivedInvitation,
        clientId: opponent.id,
        initiator: currClient.getClientData(),
        gameLevel: game.gameLevel,
        gameSessionId: newSession.id
    });
}

function leaveSession(session, client) {
    session.leaveSession(client);
    if (session.clients.size === 0) {
        sessions.delete(session.id);
    }
}

function invitationDeclined(data) {
    const currentSession = getSession(data.gameSessionId);
    const clients = getSessionClients(currentSession);
    const currClient = clients.find(client => client.id === data.initiator.id);
    leaveSession(currentSession, currClient);
    const newSession = getSession(defaultSessionId);
    newSession.joinSession(currClient);
    currClient.setNewSession(newSession);
    currClient.send({
        requestType: requestTypes.declinedInvitation,
        sessionId: newSession.id,
        playerDeclined: data.clientId
    });
    broadcastSession(newSession);
}

function invitationAccepted(data) {
    const currentSession = getSession(data.sessionToLeaveId);
    const currClient = getSessionClients(currentSession).find(client => client.id === data.playerToJoin);
    leaveSession(currentSession, currClient);
    broadcastSession(currentSession);
    const gameSession = getSession(data.gameId);
    gameSession.joinSession(currClient);
    currClient.setNewSession(gameSession);
    const opponent = getSessionClients(gameSession).find(client => client.id === data.initiatorId);
    const gameData = gameSession.getGameData();
    gameData.players = [currClient.getClientData(), opponent.getClientData()];
    gameSession.setGameParams(gameData);
    initGame(gameSession);
    invitations.delete(data.gameId);
}

function initGame(session) {
    const clients = getSessionClients(session);
    const clientIds = clients.map(client => client.id);
    const turn = clientIds[Math.floor(Math.random() * clientIds.length)];
    const gameData = session.getGameData();
    gameData.playerTurn = turn;
    session.setGameParams(gameData);
    clients.forEach(client => {
        client.send({
            requestType: requestTypes.startGame,
            clientId: client.id,
            sessionId: session.id,
            game: gameData
        });
    });
}

function updateGame(data) {
    const gameSession = getSession(data.gameId);
    gameSession.setGameParams(data.gameUpdate);
    const clients = getSessionClients(gameSession);
    clients.forEach(client => {
        client.send({
            requestType: requestTypes.gameUpdate,
            clientId: client.id,
            sessionId: gameSession.id,
            gameUpdate: data.gameUpdate
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
                case requestTypes.sendInvitation:
                    sendInvitation(data);
                    break;
                case requestTypes.declinedInvitation:
                    invitationDeclined(data);
                    break;
                case requestTypes.acceptedInvitation:
                    invitationAccepted(data);
                    break;
                case requestTypes.gameUpdate:
                    updateGame(data);
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
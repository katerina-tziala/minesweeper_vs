"use strict";
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
    opponentLeft: "opponent-left",
    invitationAborted: "invitation-aborted"
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

function joinClientToSession(session, client) {
    session.joinSession(client);
    client.setNewSession(session); 
}

function initializeSession(data, client) {
    const session = getSession(data.sessionId) || createSession(data.sessionId);
    joinClientToSession(session, client);
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
    joinClientToSession(newSession, currClient);
    currClient.send({
        requestType: requestTypes.invitationReceivedByUser,
        sessionId: newSession.id
    });
    const game = data.game;
    newSession.setGameParams(game);
    invitations.set(newSession.id, { gameId: newSession.id, clientsPair: [data.clientId, data.opponentId] });
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
    joinClientToSession(newSession, currClient);
    currClient.send({
        requestType: requestTypes.declinedInvitation,
        sessionId: newSession.id,
        playerDeclined: data.clientId
    });
    broadcastSession(newSession);
    invitations.delete(data.gameSessionId);
}

function invitationAccepted(data) {
    const currentSession = getSession(data.sessionToLeaveId);
    const currClient = getSessionClients(currentSession).find(client => client.id === data.playerToJoin);
    leaveSession(currentSession, currClient);
    broadcastSession(currentSession);
    const gameSession = getSession(data.gameId);
    joinClientToSession(gameSession, currClient);
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
    const gamePlayers = [...gameData.players];
    gamePlayers.find(player => player.id === turn)["turn"] = true;
    gamePlayers.find(player => player.id !== turn)["turn"] = false;
    gameData.players = gamePlayers;
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

function switchToMainSession(data) {
    const gameSession = getSession(data.gameId);
    const client = getSessionClients(gameSession).find(client => client.id === data.clientId);
    gameSession.leaveSession(client);
    const mainSession = getSession(defaultSessionId) || createSession(defaultSessionId);
    joinClientToSession(mainSession, client);
    broadcastSession(mainSession);
}

function gameSessinClosed(gameSession, client) {
    const clientLeft = { ...client };
    gameSession.leaveSession(client);
    const clients = getSessionClients(gameSession);
    clients.forEach(client => {
        client.send({
            requestType: requestTypes.opponentLeft,
            clientId: client.id,
            gameId: gameSession.id,
            playerLeft: clientLeft
        });
    });
}

function getInvitationsOfClient(id) {
    const invitationsOfClient = [];
    invitations.forEach(invitation => {
        if (invitation.clientsPair.includes(id)) {
            invitationsOfClient.push(invitation);
        }
    });
    return [...invitationsOfClient];
}

function checkPlayersStillInGame(clientLeft) {
    const invitationsOfClient = getInvitationsOfClient(clientLeft.id);
    invitationsOfClient.forEach(invitation => {
        const gameSession = getSession(invitation.gameId);
        if (gameSession) {
            const clientsInGame = getSessionClients(gameSession);
            clientsInGame.forEach(clientInGame => {
                leaveSession(gameSession, clientInGame);
                const mainSession = getSession(defaultSessionId) || createSession(defaultSessionId);
                joinClientToSession(mainSession, clientInGame);
                clientInGame.send({
                    requestType: requestTypes.declinedInvitation,
                    sessionId: mainSession.id,
                    playerDeclined: clientLeft.id
                });
            });
        }
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
                case requestTypes.backToLobby:
                    switchToMainSession(data);
                    break;
            }
        }
    });

    conn.on("close", () => {
        console.log("Connection closed");
        const session = client.session;
        if (session) {
            const sessionId = session.id;
            if (sessionId.startsWith("game")) {
                gameSessinClosed(session, client);
            } else {
                const clientLeft = { ...client };
                leaveSession(session, client);
                broadcastSession(session);
                checkPlayersStillInGame(clientLeft);
            }
        }
    });
});
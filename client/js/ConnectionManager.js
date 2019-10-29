"use strict";
class ConectionManager {
    constructor() {
        this.conn = null;
        this.peers = new Map;
        this.connect();
    }

    connect(connectionLink = Constants.connectionLink) {
        this.conn = new WebSocket(connectionLink);
        this.conn.addEventListener("open", () => {
            this.send({
                requestType: Constants.requestTypes.initializeSession,
                sessionId: Constants.defaultSessionId
            });
        });
        this.conn.addEventListener("message", event => {
            this.receiveHandler(event.data);
        });
    }

    send(data) {
        const dataToSend = JSON.stringify(data);
        this.conn.send(dataToSend);
    }

    receiveHandler(msg) {
        const data = JSON.parse(msg);
        switch (data.requestType) {
            case Constants.requestTypes.sessionBroadcast:
                this.updateConnection(data);
                break;
            case Constants.requestTypes.receivedInvitation:
                this.invitationReceived(data);
                break;
            case Constants.requestTypes.invitationReceivedByUser:
                this.updateCurrentClientSession(data);
                break;
            case Constants.requestTypes.declinedInvitation:
                this.declinedInvitation(data);
                break;
            case Constants.requestTypes.startGame:
                this.initializeGame(data);
                break;
            case Constants.requestTypes.gameUpdate:
                this.updateGame(data);
                break;
            case Constants.requestTypes.opponentLeft:
                self.game.clearTurnTimer();
                self.uiManager.displayOpponentLeftMessage(data);
                break;
        }
    }

    updateConnection(data) {
        if (self.game) {
            self.game.clearTurnTimer();
            self.game = undefined;
        }
        self.playerToInviteID = undefined;
        self.popupTimeout = undefined;
        self.playerTurnInterval = undefined;
        this.peers = [];
        const peers = data.peers.filter(peer => peer.id !== data.clientId);
        this.client = new Client(data.peers.find(peer => peer.id === data.clientId));
        this.client.setSessionId(data.sessionId);
        peers.forEach(peer => {
            const newPeer = new Client(peer);
            newPeer.setSessionId(data.sessionId);
            this.peers.push(newPeer);
        });
        if (this.client.entered) {
            self.uiManager.setLobbyView();
            self.uiManager.renderLobbyClients();
        }
        if (!this.peers.length) {
            self.uiManager.hidePopUp();
        }
    }

    updateClientName(clientName) {
        this.send({
            requestType: Constants.requestTypes.updateClient,
            clientId: this.client.id,
            sessionId: this.client.sessionId,
            name: clientName
        });
    }

    updateCurrentClientSession(data) {
        this.client.setSessionId(data.sessionId);
    }

    invitationReceived(data) {
        this.receivedInvitation = data;
        self.uiManager.displayReceivedInvitation(data.initiator.name, data.gameLevel);
    }

    declinedInvitation(data) {
        const playerDeclined = this.peers.find(peer => peer.id === data.playerDeclined);
        self.uiManager.displayDeclinedInvitationMessage(playerDeclined.name);
        this.updateCurrentClientSession(data);
    }

    initializeGame(data) {
        this.client = new Client(data.game.players.find(peer => peer.id === data.clientId));
        this.client.setSessionId(data.sessionId);
        const peer = new Client(data.game.players.find(peer => peer.id !== data.clientId));
        peer.setSessionId(data.sessionId);
        this.peers = [peer];
        self.game = new Game(data.sessionId, data.game);
    }

    updateGame(data) {
        self.game.updateGame(data.gameUpdate);
    }

    isPLayerThisClient(player) {
        return (player.id === this.client.id) ? true : false;
    }

    sendInvitation(gameParameters, playerToInviteID) {
        this.send({
            requestType: Constants.requestTypes.sendInvitation,
            clientId: this.client.id,
            opponentId: playerToInviteID,
            game: gameParameters,
            sessionId: this.client.sessionId,
        });
    }

    sendInvitationAcceptance() {
        this.send({
            requestType: Constants.requestTypes.acceptedInvitation,
            gameId: this.receivedInvitation.gameSessionId,
            initiatorId: this.receivedInvitation.initiator.id,
            playerToJoin: this.receivedInvitation.clientId,
            sessionToLeaveId: this.client.sessionId
        });
    }

    sendInvitationDeclined() {
        this.send({
            requestType: Constants.requestTypes.declinedInvitation,
            gameSessionId: this.receivedInvitation.gameSessionId,
            initiator: this.receivedInvitation.initiator,
            clientId: this.client.id
        });
    }

    switchToLobbySession() {
        this.send({
            requestType: Constants.requestTypes.backToLobby,
            gameId: self.game.id,
            clientId: this.client.id
        });
    }

    sendGameUpdate(gameId, gameUpdate) {
        this.send({
            requestType: Constants.requestTypes.gameUpdate,
            gameId: gameId,
            gameUpdate: gameUpdate
        });
    }
}
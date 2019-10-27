"use strict";

class InterfaceManager {
    constructor() {
        this.getViewElements();
    }

    getViewElements() {
        this.domElements = {};
        Object.keys(Constants.dom_elements_ids).forEach(key => {
            this.domElements[key] = document.getElementById(Constants.dom_elements_ids[key]);
        });
        console.log(this.domElements);
        this.preventFormSubmissionOnEnter(this.domElements.userForm);
    }

    hideElement(element) {
        element.classList.add(Constants.classList.hidden);
    }

    displayElement(element) {
        element.classList.remove(Constants.classList.hidden);
    }

    hideLoader() {
        this.hideElement(this.domElements.loader);
    }

    preventFormSubmissionOnEnter(form) {
        form.onkeypress = (event) => {
            const key = event.charCode || event.keyCode || 0;
            if (key == 13) {
                event.preventDefault();
            }
        }
    }

    getUserName() {
        return this.domElements.userNameInput.value.trim();
    }

    setLobbyView() {
        this.hideElement(this.domElements.userForm);
        this.displayElement(this.domElements.lobby);
        this.hideElement(this.domElements.gameContainer);
        this.domElements.banner.classList.add(Constants.classList.topBanner);
        this.domElements.minesweeperVS.classList.remove(Constants.classList.wrapColumn);
        this.domElements.minesweeperVS.classList.add(Constants.classList.noWrapColumnStart, Constants.classList.mainContentDisplay);
    }

    renderLobbyClients() {
        this.domElements.lobby.innerHTML = "";
        const clientCard = this.createClientCard(self.connectionManager.client, true);
        this.domElements.lobby.append(clientCard);
        const peersToDisplay = self.connectionManager.peers.filter(peer => peer.entered);
        const playerList = document.createElement("div");
        playerList.classList.add(Constants.classList.rowStartFlexbox, Constants.classList.playersList);
        if (peersToDisplay.length) {
            peersToDisplay.forEach(peer => {
                const peerCard = this.createClientCard(peer, false);
                playerList.append(peerCard);
            });
        } else {
            const message = document.createElement("div");
            message.innerHTML = "no one is here now!";
            playerList.append(message);
        }
        this.domElements.lobby.append(playerList);
    }

    createClientCard(client, isThisPlayer = false) {
        const userCard = document.createElement("div");
        userCard.classList.add(Constants.classList.rowStartFlexbox, Constants.classList.playerCard);
        const userIcon = this.createUserCardIcon();
        const userName = this.createUserCardName(client.name);
        if (isThisPlayer) {
            userCard.classList.add(Constants.classList.playerCard + Constants.classList.selfModifier);
            userIcon.classList.add(Constants.classList.playerIcon + Constants.classList.selfModifier);
        }
        userCard.append(userIcon, userName);
        if (!isThisPlayer) {
            const inviteBtn = this.createButton(this.invitePlayer)
            inviteBtn.classList.add(Constants.classList.buttonText);
            inviteBtn.innerHTML = "invite";
            inviteBtn.setAttribute("id", client.id);
            userCard.append(inviteBtn);
        }
        return userCard;
    }

    createUserCardIcon() {
        const playerIcon = document.createElement("div");
        playerIcon.className = Constants.classList.fontAwesome_ninja;
        playerIcon.classList.add(Constants.classList.playerIcon);
        return playerIcon;
    }

    createUserCardName(name) {
        const playerName = document.createElement("div");
        playerName.classList.add(Constants.classList.playerName);
        playerName.innerHTML = name;
        return playerName;
    }

    createButton(funtionName) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = Constants.classList.buttonBase;
        button.addEventListener("click", funtionName);
        return button;
    }

    showInvitationForm() {
        this.displayPopUp();
        this.createInvitation();
    }

    displayPopUp() {
        this.domElements.popUpMessageContainer.innerHTML = "";
        this.domElements.popUpContainer.classList.add(Constants.classList.visiblePopUp);
    }

    hidePopUp() {
        this.domElements.popUpContainer.classList.remove(Constants.classList.visiblePopUp);
    }

    createInvitation() {
        const invitationHeader = document.createElement("h2");
        invitationHeader.classList.add(Constants.classList.invitationHeader);
        invitationHeader.innerHTML = `invite player`;
        const form = document.createElement("form");
        const formHeader = document.createElement("p");
        formHeader.classList.add(Constants.classList.formHeader);
        formHeader.innerHTML = "Select game level:";
        form.append(formHeader);
        for (let index = 0; index < Constants.gameLevels.length; index++) {
            const level = Constants.gameLevels[index];
            const checked = (index === 0) ? true : false;
            const label = this.createFormRadioButton(level, checked);
            form.append(label);
        }
        const sendBtn = this.createButton(this.sendInvitation)
        sendBtn.classList.add(Constants.classList.buttonText, Constants.classList.sendInvitationBtn);
        sendBtn.innerHTML = "send";
        const cancelBtn = this.createButton(this.cancelInvitation);
        const iconclasses = Constants.classList.fontAwesome_times.split(" ");
        cancelBtn.classList.add(Constants.classList.buttonIcon, Constants.classList.cancelInvitationBtn, iconclasses[0], iconclasses[1]);
        this.domElements.popUpMessageContainer.append(invitationHeader, form, sendBtn, cancelBtn);
    }

    createFormRadioButton(level, checked) {
        const label = document.createElement("label");
        label.classList.add(Constants.classList.radioContainer);
        const labelTag = document.createElement("span");
        labelTag.innerHTML = level;
        const radioBtn = document.createElement("input");
        radioBtn.value = level;
        radioBtn.name = "game_level";
        radioBtn.type = "radio";
        radioBtn.checked = checked;
        const checkmark = document.createElement("span");
        checkmark.classList.add(Constants.classList.checkmark);
        label.append(labelTag, radioBtn, checkmark);
        return label;
    }

    getMineList(boardParameters) {
        let mineList = [];
        while (mineList.length < boardParameters.numberOfMines) {
            const minePosition = parseInt(Math.floor((Math.random() * (boardParameters.dimensions.x * boardParameters.dimensions.y))));
            if (!mineList.includes(minePosition)) {
                mineList.push(minePosition);
            }
        }
        mineList = mineList.sort();
        return mineList;
    }

    displayWaitingMessage() {
        const opponent = self.connectionManager.peers.find(peer => peer.id === self.playerToInviteID);
        this.displayPopUp();
        const message = document.createElement("p");
        message.innerHTML = `Waiting for <b><i>"${opponent.name}"</i></b> to join the game`;
        message.classList.add(Constants.classList.waitingMesage);
        this.domElements.popUpMessageContainer.append(message);
        for (let index = 0; index < 3; index++) {
            const dot = document.createElement("div");
            dot.classList.add(Constants.classList.blinkDot);
            dot.innerHTML = ".";
            this.domElements.popUpMessageContainer.append(dot);
        }
    }

    displayReceivedInvitation(initiator, gameLevel) {
        this.displayPopUp();
        const message = document.createElement("p");
        message.innerHTML = `<b><i>"${initiator}"</i></b> invited you for a minesweeper game (${gameLevel} level)`;
        const acceptBtn = this.createButton(this.acceptInvitation);
        acceptBtn.classList.add(Constants.classList.buttonText, Constants.classList.receivedInvitationBtn);
        acceptBtn.innerHTML = "accept";
        const declineBtn = this.createButton(this.declineInvitation);
        declineBtn.classList.add(Constants.classList.buttonText, Constants.classList.receivedInvitationBtn);
        declineBtn.innerHTML = "decline";
        this.domElements.popUpMessageContainer.append(message, acceptBtn, declineBtn);
    }

    displayDeclinedInvitationMessage(declinedPlayerName) {
        this.displayPopUp();
        const message = document.createElement("p");
        message.innerHTML = `<b><i>"${declinedPlayerName}"</i></b> declined your invitation!`;
        const okBtn = this.createButton(this.backToLobby);
        okBtn.classList.add(Constants.classList.buttonText, Constants.classList.receivedInvitationBtn);
        okBtn.innerHTML = "ok";
        this.domElements.popUpMessageContainer.append(message, okBtn);
    }

    invitePlayer() {
        self.playerToInviteID = this.getAttribute("id")
        self.uiManager.showInvitationForm();
    }

    sendInvitation() {
        const gameLevel = document.querySelector("input[name='game_level']:checked").value;
        const boardParameters = Constants.gameParameters[gameLevel];
        const mineList = self.uiManager.getMineList(boardParameters);
        const gameParameters = {
            level: gameLevel,
            boardParameters: boardParameters,
            mineList: mineList
        };
        self.uiManager.displayWaitingMessage();
        self.connectionManager.send({
            requestType: Constants.requestTypes.sendInvitation,
            clientId: self.connectionManager.client.id,
            opponentId: self.playerToInviteID,
            game: gameParameters,
            sessionId: self.connectionManager.client.sessionId,
        });
        self.playerToInviteID = null;
    }

    cancelInvitation() {
        self.uiManager.hidePopUp();
        self.playerToInviteID = null;
    }

    acceptInvitation() {
        console.log("acceptInvitation");
        console.log(self.connectionManager.receivedInvitation);

    }

    declineInvitation() {
        const invitation = self.connectionManager.receivedInvitation;
        self.connectionManager.send({
            requestType: Constants.requestTypes.declinedInvitation,
            gameSessionId: invitation.gameSessionId,
            initiator: invitation.initiator,
            clientId: self.connectionManager.client.id
        });
        self.uiManager.hidePopUp();
    }

    backToLobby() {
        self.uiManager.hidePopUp();
    }
}

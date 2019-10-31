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
        this.getViewElements();
        this.setAppViewAndBanner();
        this.hideElement(this.domElements.userForm);
        this.displayElement(this.domElements.lobby);
        this.hideElement(this.domElements.gameContainer);
        this.hideElement(this.domElements.game);
    }

    setAppViewAndBanner() {
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
        playerList.classList.add(Constants.classList.rowStartFlexbox, Constants.playerClassList.playersList);
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
        userCard.classList.add(Constants.classList.rowStartFlexbox, Constants.playerClassList.playerCard);
        const userIcon = this.createUserCardIcon();
        const userName = this.createUserCardName(client.name);
        if (isThisPlayer) {
            userCard.classList.add(Constants.playerClassList.playerCard + Constants.playerClassList.selfModifier);
            userIcon.classList.add(Constants.playerClassList.playerIcon + Constants.playerClassList.selfModifier);
        }
        userCard.append(userIcon, userName);
        if (!isThisPlayer) {
            const inviteBtn = this.createButton(this.invitePlayer);
            inviteBtn.classList.add(Constants.classList.buttonText);
            inviteBtn.innerHTML = "invite";
            inviteBtn.setAttribute("id", client.id);
            userCard.append(inviteBtn);
        }
        return userCard;
    }

    createUserCardIcon() {
        const playerIcon = document.createElement("div");
        playerIcon.className = Constants.fontAwesomeClassList.ninja;
        playerIcon.classList.add(Constants.playerClassList.playerIcon);
        return playerIcon;
    }

    createUserCardName(name) {
        const playerName = document.createElement("div");
        playerName.classList.add(Constants.playerClassList.playerName);
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
        if (self.popupTimeout) {
            clearTimeout(self.popupTimeout);
        }
        this.domElements.popUpMessageContainer.innerHTML = "";
        this.domElements.popUpContainer.classList.add(Constants.classList.visiblePopUp);
    }

    hidePopUp() {
        this.domElements.popUpContainer.classList.remove(Constants.classList.visiblePopUp);
    }

    createInvitation() {
        const invitationHeader = document.createElement("h2");
        invitationHeader.classList.add(Constants.popupClassList.popupHeader);
        invitationHeader.innerHTML = `invite player`;
        const form = document.createElement("form");
        const formHeader = document.createElement("p");
        formHeader.classList.add(Constants.popupClassList.formHeader);
        formHeader.innerHTML = "Select game level:";
        form.append(formHeader);
        for (let index = 0; index < Constants.gameLevels.length; index++) {
            const gameLevel = Constants.gameLevels[index];
            const checked = (index === 0) ? true : false;
            const label = this.createFormRadioButton(gameLevel, checked);
            form.append(label);
        }
        const sendBtn = this.createButton(this.sendInvitation)
        sendBtn.classList.add(Constants.classList.buttonText, Constants.popupClassList.sendInvitationBtn);
        sendBtn.innerHTML = "send";
        const cancelBtn = this.createButton(this.cancelInvitation);
        const iconclasses = Constants.fontAwesomeClassList.timesX.split(" ");
        cancelBtn.classList.add(Constants.classList.buttonIcon, Constants.popupClassList.cancelInvitationBtn, iconclasses[0], iconclasses[1]);
        this.domElements.popUpMessageContainer.append(invitationHeader, form, sendBtn, cancelBtn);
    }

    createFormRadioButton(gameLevel, checked) {
        const label = document.createElement("label");
        label.classList.add(Constants.popupClassList.radioContainer);
        const labelTag = document.createElement("span");
        labelTag.innerHTML = gameLevel;
        const radioBtn = document.createElement("input");
        radioBtn.value = gameLevel;
        radioBtn.name = "game_level";
        radioBtn.type = "radio";
        radioBtn.checked = checked;
        const checkmark = document.createElement("span");
        checkmark.classList.add(Constants.popupClassList.checkmark);
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
        message.classList.add(Constants.popupClassList.waitingMesage);
        this.domElements.popUpMessageContainer.append(message);
        for (let index = 0; index < 3; index++) {
            const dot = document.createElement("div");
            dot.classList.add(Constants.popupClassList.blinkDot);
            dot.innerHTML = ".";
            this.domElements.popUpMessageContainer.append(dot);
        }
    }

    displayReceivedInvitation(initiator, gameLevel) {
        this.displayPopUp();
        const invitationHeader = document.createElement("h2");
        invitationHeader.classList.add(Constants.popupClassList.popupHeader);
        invitationHeader.innerHTML = "You got an invitation!";
        const message = document.createElement("p");
        message.innerHTML = `<b><i>"${initiator}"</i></b> invited you for a minesweeper game (${gameLevel} level)`;
        const acceptBtn = this.createButton(this.acceptInvitation);
        acceptBtn.classList.add(Constants.classList.buttonText, Constants.popupClassList.receivedInvitationBtn);
        acceptBtn.innerHTML = "accept";
        const declineBtn = this.createButton(this.declineInvitation);
        declineBtn.classList.add(Constants.classList.buttonText, Constants.popupClassList.receivedInvitationBtn);
        declineBtn.innerHTML = "decline";
        this.domElements.popUpMessageContainer.append(invitationHeader, message, acceptBtn, declineBtn);
    }

    displayDeclinedInvitationMessage(declinedPlayerName) {
        this.displayPopUp();
        const message = document.createElement("p");
        message.innerHTML = `<b><i>"${declinedPlayerName}"</i></b> declined your invitation!`;
        const okBtn = this.createButton(this.backToLobby);
        okBtn.classList.add(Constants.classList.buttonText, Constants.popupClassList.receivedInvitationBtn);
        okBtn.innerHTML = "ok";
        this.domElements.popUpMessageContainer.append(message, okBtn);
    }

    initializeGameView() {
        this.getViewElements();
        this.hidePopUp();
        this.setAppViewAndBanner();
        this.hideElement(this.domElements.lobby);
        this.domElements.lobby = "";
        this.displayElement(this.domElements.gameContainer);
        this.hideElement(this.domElements.userForm);
        this.displayElement(this.domElements.gameContainer);
        this.domElements.gamePlayersContainer.innerHTML = "";
        this.domElements.gameMineCounter.innerHTML = "";
        this.domElements.gameTimer.innerHTML = "";
        this.domElements.gameBoard.innerHTML = "";
        this.displayElement(this.domElements.game);
    }

    setGameFreezerOn() {
        this.displayElement(this.domElements.gameFreezer);
    }

    setGameFreezerOff() {
        this.hideElement(this.domElements.gameFreezer);
    }

    renderPlayersOnGame(players) {
        this.domElements.gamePlayersContainer.innerHTML = "";
        players.forEach(player => {
            const playerCard = document.createElement("div");
            playerCard.setAttribute("id", `${Constants.playerClassList.playerCard}_${player.id}`)
            playerCard.classList.add(Constants.classList.rowStartFlexbox, Constants.playerClassList.playerCard);
            const userIcon = this.createUserCardIcon();
            const userName = this.createUserCardName(player.name);
            const playerFlag = document.createElement("div");
            const fontAwesomeClassList = Constants.fontAwesomeClassList.flag.split(" ");
            playerFlag.classList.add(fontAwesomeClassList[0], fontAwesomeClassList[1], Constants.playerClassList.playerFlag);
            playerCard.append(userIcon, userName, playerFlag);
            this.domElements.gamePlayersContainer.append(playerCard);
        });
    }

    displayTurnMessage(message) {
        this.displayPopUp();
        const messageContainer = document.createElement("p");
        messageContainer.innerHTML = message;
        this.domElements.popUpMessageContainer.append(messageContainer);
    }

    clearCardDisplay(element) {
        element.style.color = null;
        element.style.boxShadow = null;
        element.querySelectorAll(".player-icon")[0].style.border = null;
    }

    setPlayerOnTurnCardDisplay(element, color) {
        this.clearCardDisplay(element);
        element.style.color = color;
        element.style.boxShadow = `0px 0px 5px ${color}`;
        element.querySelectorAll(".player-icon")[0].style.border = `2px solid ${color}`;
    }

    setPlayerOnTurnBoardDisplay(color) {
        this.domElements.game.style.border = `1px solid ${color}`;
        this.domElements.game.style.boxShadow = `0px 0px 12px ${color}`;
        this.setFlagOnPlayColor(color);
    }

    setFlagOnPlayColor(color) {
        this.domElements.gameFlagOnPlay.style.color = color;
    }

    displayGameResults(players, message, allMinesFlagged) {
        this.displayPopUp();
        const resultsHeader = this.getResultsHeader();
        this.domElements.popUpMessageContainer.append(resultsHeader);
        if (allMinesFlagged) {
            const allMinesFlaggedMessage = document.createElement("p");
            allMinesFlaggedMessage.innerHTML = "All mines were found!";
            this.domElements.popUpMessageContainer.append(allMinesFlaggedMessage);
        }
        const resultsMessage = document.createElement("p");
        resultsMessage.innerHTML = message;
        const resultsKeys = Object.keys(Constants.resultsHeaders);
        const table = document.createElement("table");
        table.classList.add(Constants.popupClassList.resultsTable);
        resultsKeys.forEach(key => {
            table.append(this.getResultsTableRow(players, key));
        });
        const doneBtn = this.getDoneButton();
        this.domElements.popUpMessageContainer.append(resultsMessage, table, doneBtn);
    }

    displayTurnGameOverMessage(message) {
        this.displayPopUp();
        const resultsHeader = this.getResultsHeader();
        const resultsMessage = document.createElement("p");
        resultsMessage.innerHTML = message;
        const doneBtn = this.getDoneButton();
        this.domElements.popUpMessageContainer.append(resultsHeader, resultsMessage, doneBtn);
    }

    getResultsHeader() {
        const resultsHeader = document.createElement("h2");
        resultsHeader.classList.add(Constants.popupClassList.popupHeader);
        resultsHeader.innerHTML = `game over`;
        return resultsHeader;
    }

    getDoneButton() {
        const doneBtn = this.createButton(this.closeGameResults)
        doneBtn.classList.add(Constants.classList.buttonText, Constants.popupClassList.okButton);
        doneBtn.innerHTML = "done";
        return doneBtn;
    }

    getResultsTableRow(players, key) {
        const row = document.createElement("tr");
        const header = document.createElement("th");
        header.innerHTML = Constants.resultsHeaders[key];
        row.append(header);
        players.forEach(player => {

            row.append(this.getResultsTableCell(player[key], key));
        });
        return row;
    }

    getResultsTableCell(data, key) {
        const tableCell = document.createElement("td");
        if (key === "isWinner") {
            const cup = document.createElement("div");
            cup.className = Constants.fontAwesomeClassList.cup;
            if (data) {
                cup.style.color = Constants.playerColors.thisPlayer;
            }
            tableCell.append(cup);
        }

        else {
            tableCell.innerHTML = data.toString();

        }

        return tableCell;
    }

    displayOpponentLeftMessage(data){
        this.displayPopUp();
        const resultsHeader = this.getResultsHeader();
        const resultsMessage = document.createElement("p");
        resultsMessage.innerHTML = `${data.playerLeft.name} left the game! You win!`;
        const doneBtn = this.getDoneButton();
        this.domElements.popUpMessageContainer.append(resultsHeader, resultsMessage, doneBtn);
    }

    cancelInvitation() {
        self.uiManager.hidePopUp();
        self.playerToInviteID = null;
    }

    invitePlayer() {
        self.playerToInviteID = this.getAttribute("id")
        self.uiManager.showInvitationForm();
    }

    backToLobby() {
        self.uiManager.hidePopUp();
    }

    sendInvitation() {
        const gameLevel = document.querySelector("input[name='game_level']:checked").value;
        const boardParameters = Constants.gameParameters[gameLevel];
        const mineList = self.uiManager.getMineList(boardParameters);
        const gameParameters = {
            gameLevel: gameLevel,
            boardParameters: boardParameters,
            mineList: mineList
        };
        self.uiManager.displayWaitingMessage();
        self.connectionManager.sendInvitation(gameParameters, self.playerToInviteID);
        self.playerToInviteID = null;
    }

    acceptInvitation() {
        self.connectionManager.sendInvitationAcceptance();
        self.uiManager.hidePopUp();
    }

    declineInvitation() {
        const invitation = self.connectionManager.receivedInvitation;
        self.connectionManager.sendInvitationDeclined();
        self.uiManager.hidePopUp();
    }

    closeGameResults() {
        self.uiManager.hidePopUp();
        self.connectionManager.switchToLobbySession();
    }
}

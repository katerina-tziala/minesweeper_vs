"use strict";
let uiManager, connectionManager, game;
let playerToInviteID, popupTimeout, playerTurnInterval;

document.addEventListener("contextmenu", event => {
    event.preventDefault();
}, false);

document.addEventListener("DOMContentLoaded", () => {
    self.uiManager = new InterfaceManager();
    self.uiManager.hideLoader();
     self.connectionManager = new ConectionManager();
});

function getUserName(event) {
    event.preventDefault();
    const playerName = self.uiManager.getUserName();
    if (userNameIsValid(playerName)) {
        self.connectionManager.updateClientName(playerName);
    }
}

function userNameIsValid(username) {
    return (username === "" || username.replace(/\s+/, "") === "") ? false : true;
}
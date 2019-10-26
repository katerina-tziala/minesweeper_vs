"use strict";
let uiManager;
document.addEventListener("DOMContentLoaded", (event) => {
    console.log("hi");
    self.uiManager = new InterfaceManager();
    self.uiManager.hideLoader();

});


function getUserName(event) {
    event.preventDefault();
    const playerName = self.uiManager.getUserName();
    console.log(playerName);
    
    if (userNameIsValid(playerName)) {
        self.uiManager.setLobbyView();
    }
}

function userNameIsValid(username) {
    return (username === "" || username.replace(/\s+/, "") === "") ? false : true;
}
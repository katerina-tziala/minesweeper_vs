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


//   const data = {"requestType":"game-initialization","clientId":"VaSkG1JMCJNn","sessionId":"game_xQMarap4mGSC","game":{"gameLevel":"begginer","boardParameters":{"dimensions":{"x":9,"y":9},"numberOfMines":10},"mineList":[10,15,2,21,23,30,31,5,68,79],"players":[{"id":"VaSkG1JMCJNn","name":"sdf","entered":true},{"id":"DW94HaD0MMaB","name":"sdfsdf","entered":true}],"playerTurn":"DW94HaD0MMaB"}};

//  self.game = new Game(data.sessionId, data.game);

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





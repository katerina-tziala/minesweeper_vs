"use strict";
class Player {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.playerColor = Constants.playerColors.thisPlayer;
        this.minesFound = 0;
        this.missedConsecutinveTurns = 0;
        this.wrongPlacedFlags = 0;
        this.turn = false;
        this.isWinner = false;
        this.revealdMine = false;
    }

    setPLayerColor(color) {
        this.playerColor = color;
    }

    setPLayerTurn(turnStatus) {
        this.turn = turnStatus;
    }

    setBoardTilesOnMove(boardTiles) {
        this.boardTilesOnMove = boardTiles;
    }

    updateMissedConsecutiveTurns() {
        this.missedConsecutinveTurns++;
    }

    updateMinesFound() {
        this.minesFound++;
    }

    reachedMissedConsecutiveTurnsLimit() {
        return (this.missedConsecutinveTurns === Constants.missedConsecutinveTurnsLimit) ? true : false;
    }
    
    updateWrongPlacedFlags() {
        this.wrongPlacedFlags++;
    }
}
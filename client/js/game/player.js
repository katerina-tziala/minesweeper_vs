class Player {
    constructor(id, name) { 
        this.id = id;
        this.name = name;
        this.points = 0;
        this.correctPlacedFlags = 0;
        this.wrongPlacedFlags = 0;
        this.missedTurns = 0;
        this.turn = false;
        this.leftGame = false;
        this.isWinner = false;
        this.revealdMine = false;
        this.playerColor = Constants.playerColors.thisPlayer;
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

    updateMissedTurns() {
        this.missedTurns++;
    }

    updateCorrectPlacedFlags() {
        this.correctPlacedFlags++;
    }

    updateWrongPlacedFlags() {
        this.wrongPlacedFlags++;
    }

    calculatePoints() {
        this.points = (-20 * this.wrongPlacedFlags) + (this.correctPlacedFlags * 20);
    }

    reachedMissedTurnsLimit() {
        return (this.missedTurns === Constants.missedTurnsLimit) ? true : false;
    }
    
}
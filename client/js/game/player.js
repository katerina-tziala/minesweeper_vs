class Player {
    constructor(id, name) { 
        this.id = id;
        this.name = name;
        this.points = 0;
        this.minesFlaggedCorrectly = 0;
        this.minesFlaggedWrongly = 0;
        this.missedTurns = 0;
        this.turn = false;
        this.leftGame = false;
        this.isWinner = false;
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
}
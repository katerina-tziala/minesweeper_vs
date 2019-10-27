class Game {
    constructor(id, gameParameters) {
        this.id = id;
        this.players = [];
        this.boardSettings = gameParameters.boardParameters;
        this.gameLevel = gameParameters.gameLevel;
        this.mineList = gameParameters.mineList;
        this.playerOnTurn = undefined;
        this.waitingPlayer = undefined;
        this.turnSeconds = Constants.playerTurnSeconds;
        this.allMinesFlagged = false;
        this.setGamePlayers(gameParameters);
        this.initializeGame();
        this.renderPlayersOnGame();
        this.displayInitializationMessage();
    }

    initializeGame() {
        self.uiManager.initializeGameView();
        this.board = new Board(this.boardSettings.dimensions, this.mineList, this.clickBoardTile);
        this.timeCounter = new DigitalCounter(Constants.dom_elements_ids.gameTimer);
        this.mineCounter = new DigitalCounter(Constants.dom_elements_ids.gameMineCounter);
        this.mineCounter.setCounter(this.boardSettings.numberOfMines);
    }


    setGamePlayers(gameData) {
        this.players = [];
        gameData.players.forEach(player => {
            const newPlayer = new Player(player.id, player.name);
            if (this.isOpponent(player)) {
                newPlayer.setPLayerColor(Constants.playerColors.opponent);
            }
            const hasTurn = (player.id === gameData.playerTurn) ? true : false;
            newPlayer.setPLayerTurn(hasTurn);
            this.players.push(newPlayer);
        });
    }

    isOpponent(player) {
        // return (player.id !== "VaSkG1JMCJNn") ? true : false;
        return !self.connectionManager.isPLayerThisClient(player) ? true : false;
    }

    getWaitingPlayer() {
        return this.players.find(player => !player.turn);
    }

    getPlayerOnTurn() {
        return this.players.find(player => player.turn);
    }

    isPlayerOnTurnOpponent() {
        return this.isOpponent(this.playerOnTurn);
    }

    renderPlayersOnGame() {
        const thisPlayer = this.players.find(player => !this.isOpponent(player));
        const opponent = this.players.find(player => this.isOpponent(player));
        const playerList = [{ ...thisPlayer }, { ...opponent }];
        self.uiManager.renderPlayersOnGame(playerList);
    }

    displayInitializationMessage() {
        const playerOnTurn = this.getPlayerOnTurn();
        let message = `You start! Play!`;
        if (this.isOpponent(playerOnTurn)) {
            message = `Player ${playerOnTurn.name} starts! You should wait!`;
        }
        self.uiManager.displayTurnMessage(message);
        self.popupTimeout = setTimeout(() => {
            self.uiManager.hidePopUp();
            this.setPlayerTurn(false);
        }, 2000);
    }

    setPlayerTurn(displayTurnMessage = true) {
        this.playerOnTurn = this.getPlayerOnTurn();
        this.waitingPlayer = this.getWaitingPlayer();
        this.playerOnTurnDisplay();
        let message = "It's your turn! Play!";
        if (this.isPlayerOnTurnOpponent()) {
            self.uiManager.setGameFreezerOn();
            message = `${this.playerOnTurn.name} is playing! You should wait!`;
        } else {
            self.uiManager.setGameFreezerOff();
        }
        if (displayTurnMessage) {
            self.uiManager.displayTurnMessage(message);
            self.popupTimeout = setTimeout(() => {
                self.uiManager.hidePopUp();
                //  this.setTurnTimer();
            }, 1500);
        } else {
            //  this.setTurnTimer();
        }
    }

    playerOnTurnDisplay() {
        const playerContainer = document.getElementById(`${Constants.playerClassList.playerCard}_${this.playerOnTurn.id}`);
        const waitingPlayerContainer = document.getElementById(`${Constants.playerClassList.playerCard}_${this.waitingPlayer.id}`);
        self.uiManager.clearCardDisplay(waitingPlayerContainer);
        self.uiManager.setPlayerOnTurnCardDisplay(playerContainer, this.playerOnTurn.playerColor);
        self.uiManager.setPlayerOnTurnBoardDisplay(this.playerOnTurn.playerColor);
        this.mineCounter.updateCounterColor(this.playerOnTurn.playerColor);
    }

    clearTurnTimer() {
        clearInterval(self.playerTurnInterval);
    }

    setTurnTimer() {
        self.game.clearTurnTimer();
        self.game.turnSeconds = Constants.playerTurnSeconds;
        self.playerTurnInterval = setInterval(self.game.turnTimer, 1000);
        self.game.timeCounter.setCounter(self.game.turnSeconds, this.playerOnTurn.playerColor);

    }

    turnTimer() {
        self.game.turnSeconds--;
        self.game.timeCounter.setCounter(self.game.turnSeconds, self.game.playerOnTurn.playerColor);
        if (self.game.turnSeconds === 0) {
            self.game.clearTurnTimer();
            self.game.submitMove([]);
        }
    }

    isGameOver() {
        if (this.playerOnTurn.reachedMissedTurnsLimit() || this.playerOnTurn.revealdMine) {
            return true;
        }
        if (this.board.allMinesFlagged()) {
            this.allMinesFlagged.true;
            return true;
        }
        return false;
    }

    submitMove(boardTiles) {
        self.game.clearTurnTimer();
        self.uiManager.setGameFreezerOn();
        this.setPlayerMoveResults(boardTiles);
        this.switchPlayerMoves();
        const isGameOver = this.isGameOver();
        const gameUpdate = {
            boardParameters: this.boardSettings,
            gameLevel: this.gameLevel,
            mineList: this.mineList,
            isGameOver: isGameOver,
            allMinesFlagged: this.allMinesFlagged,
            players: [this.playerOnTurn, this.waitingPlayer],
            tilesToUpdate: boardTiles,
            mineCounter: this.mineCounter.counterNumber
        };
        self.connectionManager.send({
            requestType: Constants.requestTypes.gameUpdate,
            gameId: this.id,
            gameUpdate: gameUpdate
        });
    }

    setPlayerMoveResults(boardTiles) {
        if (!boardTiles.length) {
            this.playerOnTurn.updateMissedTurns();
        } else {
            this.setPlayerFlagResults(boardTiles[0]);
            if (boardTiles[0].isMineRevealed()) {
                this.playerOnTurn.revealdMine = true;
            }
        }
    }

    setPlayerFlagResults(boardTile) {
        if (boardTile.isFlaggedCorrectly()) {
            this.playerOnTurn.updateCorrectPlacedFlags();
        }
        if (boardTile.isFlaggedWrongly()) {
            this.playerOnTurn.updateWrongPlacedFlags();
        }
        this.playerOnTurn.calculatePoints();
    }

    switchPlayerMoves() {
        this.playerOnTurn.turn = false;
        this.waitingPlayer.turn = true;
    }

    updateBoardView(boardTiles, playerColor) {
        boardTiles.forEach(tile => {
            tile.setBoardTileDisplay(playerColor);
        });
    }

    clickBoardTile(event) {
        event.preventDefault();
        const elementId = event.target.getAttribute("id");
        const clickedTile = self.game.board.getBoardTileBasedOnElementId(elementId);
        if (!clickedTile.isOpen()) {
            if (event.which === 3) {
                self.game.flaggTile(clickedTile);
            } else {
                self.game.revealTile(clickedTile);
            }
        }
    }

    flaggTile(clickedTile) {
        clickedTile.setFlagg();
        this.updateBoardView([clickedTile], this.playerOnTurn.playerColor);
        this.submitMove([clickedTile]);
    }

    revealTile(clickedTile) {
        if (clickedTile.isMine) {
            clickedTile.setRevealed();
            this.updateBoardView([clickedTile], this.playerOnTurn.playerColor);
            this.submitMove([clickedTile]);
        } else if (clickedTile.isEmpty()) {
            const areaToReaveal = self.game.board.getBoardAreaToReveal(clickedTile);
            this.updateBoardView(areaToReaveal, this.playerOnTurn.playerColor);
            this.submitMove(areaToReaveal);
        } else if (!clickedTile.isEmpty()) {
            clickedTile.setRevealed();
            this.updateBoardView([clickedTile], this.playerOnTurn.playerColor);
            this.submitMove([clickedTile]);
        }
    }

}
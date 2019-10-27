class Game {
    constructor(id, gameParameters) {
        this.id = id;
        this.players = [];
        this.boardSettings = gameParameters.boardParameters;
        this.gameLevel = gameParameters.level;
        this.mineList = gameParameters.mineList;
        this.playerOnTurn = undefined;
        this.waitingPlayer = undefined;
        this.turnSeconds = Constants.playerTurnSeconds;
        this.setGamePlayers(gameParameters);
        this.initializeGame();
        this.renderPlayersOnGame();
        this.displayInitializationMessage();
    }

    initializeGame() {
        self.uiManager.initializeGameView();
        this.board = new Board(this.boardSettings.dimensions, this.mineList, this.clickBoardTile);
        this.mineCounter = new DigitalCounter(Constants.dom_elements_ids.gameMineCounter);
        this.timeCounter = new DigitalCounter(Constants.dom_elements_ids.gameTimer);
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
        return (player.id !== "VaSkG1JMCJNn") ? true : false;
        //  return !self.connectionManager.isPLayerThisClient(player) ? true : false;
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
        const playerInTurn = this.getPlayerOnTurn();
        let message = `You start`;
        if (this.isOpponent(playerInTurn)) {
            message =  `Player ${playerInTurn.name} starts!`;
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
            message = `${this.playerOnTurn.name} is playing! Wait!`;
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

    submitMove(boardTiles) {
        console.log("next turn");
        self.game.clearTurnTimer();
        self.uiManager.setGameFreezerOn();
        console.log(boardTiles);
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
        this.updateBoardView([clickedTile]);
        this.submitMove([clickedTile]);
    }

    revealTile(clickedTile) {
        if (clickedTile.isMine) {
            clickedTile.setRevealed();
            this.updateBoardView([clickedTile], this.playerOnTurn.playerColor);
            this.submitMove([clickedTile]);
        } else if (clickedTile.isEmpty()) {
            const areaToReaveal = self.game.board.getBoardAreaToReveal(clickedTile);
            this.updateBoardView(areaToReaveal,  this.playerOnTurn.playerColor);
            this.submitMove(areaToReaveal);
        } else if (!clickedTile.isEmpty()) {
            clickedTile.setRevealed();
            this.updateBoardView([clickedTile],  this.playerOnTurn.playerColor);
            this.submitMove([clickedTile]);
        }
    }

}
"use strict";
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
        this.setGamePlayers(gameParameters.players);
        this.initializeGame();
        self.uiManager.renderPlayersOnGame(this.getSortedPlayersForDisplay());
        this.displayTurnMessage(true);
    }

    initializeGame() {
        self.uiManager.initializeGameView();
        this.board = new Board(this.boardSettings.dimensions, this.mineList, this.clickBoardTile);
        this.timeCounter = new DigitalCounter(Constants.dom_elements_ids.gameTimer);
        this.mineCounter = new DigitalCounter(Constants.dom_elements_ids.gameMineCounter);
        this.mineCounter.setCounter(this.boardSettings.numberOfMines);
    }

    setGamePlayers(players) {
        this.players = [];
        players.forEach(player => {
            const newPlayer = new Player(player.id, player.name);
            newPlayer.setPLayerTurn(player.turn);
            if (this.isOpponent(newPlayer)) {
                newPlayer.setPLayerColor(Constants.playerColors.opponent);
            }
            this.players.push(newPlayer);
        });
        this.setTurnsForPlayers();
    }

    setTurnsForPlayers() {
        this.playerOnTurn = this.players.find(player => player.turn);
        this.waitingPlayer = this.players.find(player => !player.turn);
    }

    isOpponent(player) {
        return !self.connectionManager.isPLayerThisClient(player) ? true : false;
    }

    isPlayerOnTurnOpponent() {
        return this.isOpponent(this.playerOnTurn);
    }

    getSortedPlayersForDisplay() {
        const thisPlayer = this.players.find(player => !this.isOpponent(player));
        const opponent = this.players.find(player => this.isOpponent(player));
        return [{ ...thisPlayer }, { ...opponent }];
    }

    displayTurnMessage(initialization = false) {
        let message = "It's your turn! Play!";
        if (initialization) {
            message = `You start! Play!`;
            if (this.isPlayerOnTurnOpponent()) {
                message = `Player ${this.playerOnTurn.name} starts! You should wait!`;
            }
        }
        if (this.isPlayerOnTurnOpponent()) {
            message = `${this.playerOnTurn.name} is playing! You should wait!`;
        }
        self.uiManager.displayTurnMessage(message);
        self.popupTimeout = setTimeout(() => {
                self.uiManager.hidePopUp();
            }, 2000);
        this.setPlayerTurn();
    }

    setGameFreezer() {
        if (this.isPlayerOnTurnOpponent()) {
            self.uiManager.setGameFreezerOn();
            return;
        }
        self.uiManager.setGameFreezerOff();
    }

    setPlayerTurn() {
        this.playerOnTurnDisplay();
        this.setGameFreezer();
        this.setTurnTimer();
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
        self.playerTurnInterval = undefined;
        this.turnSeconds = Constants.playerTurnSeconds;
    }

    setTurnTimer() {
        this.clearTurnTimer();
        this.turnSeconds = Constants.playerTurnSeconds;
        self.playerTurnInterval = setInterval(this.turnTimer, 1000);
        this.timeCounter.setCounter(this.turnSeconds, this.playerOnTurn.playerColor);
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
        if (this.playerOnTurn.reachedMissedConsecutiveTurnsLimit() || this.playerOnTurn.revealdMine) {
            return true;
        }
        if (this.board.allMinesFlagged()) {
            this.allMinesFlagged.true;
            return true;
        }
        return false;
    }

    submitMove(boardTiles) {
        this.clearTurnTimer();
        self.uiManager.setGameFreezerOn();
        this.setPlayerMoveResults(boardTiles);
        this.setWinner([this.playerOnTurn, this.waitingPlayer]);
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
        self.connectionManager.sendGameUpdate(this.id, gameUpdate);
    }

    setPlayerMoveResults(boardTiles) {
        if (!boardTiles.length) {
            this.playerOnTurn.updateMissedConsecutiveTurns();
        } else {
            this.playerOnTurn.missedConsecutinveTurns = 0;
            if (boardTiles[0].isFlaggedCorrectly()) {
                this.playerOnTurn.updateMinesFound();
                this.mineCounter.counterNumber = this.mineCounter.counterNumber - 1;
                this.mineCounter.setCounter(this.mineCounter.counterNumber);
            } else if (boardTiles[0].isFlaggedWrongly()) {
                this.playerOnTurn.updateWrongPlacedFlags();
            } else if (boardTiles[0].isMineRevealed()) {
                this.playerOnTurn.revealdMine = true;
            }
        }
    }
    
    setWinner(players) {
        if (players[1].minesFound === players[0].minesFound) {
            players[1].isWinner = false;
            players[0].isWinner = false;
        }
        else if (players[1].minesFound > players[0].minesFound) {
            players[1].isWinner = true;
            players[0].isWinner = false;
        } else {
            players[0].isWinner = true;
            players[1].isWinner = false;
        }
        if (players[0].revealdMine) {
            players[0].isWinner = false;
            players[1].isWinner = true;
        }
        if (players[1].revealdMine) {
            players[1].isWinner = false;
            players[0].isWinner = true;
        }
        if (players[0].reachedMissedConsecutiveTurnsLimit()) {
            players[0].isWinner = false;
            players[1].isWinner = true;
        }
        if (players[1].reachedMissedConsecutiveTurnsLimit()) {
            players[1].isWinner = false;
            players[0].isWinner = true;
        }
    }

    switchPlayerMoves() {
        this.playerOnTurn.turn = false;
        this.waitingPlayer.turn = true;
    }

    updatePLayers(players) {
        this.players = [];
        players.forEach(player => {
            const newPlayer = new Player(player.id, player.name);
            if (this.isOpponent(player)) {
                newPlayer.setPLayerColor(Constants.playerColors.opponent);
            }
            newPlayer.minesFound = player.minesFound;
            newPlayer.missedConsecutinveTurns = player.missedConsecutinveTurns;
            newPlayer.wrongPlacedFlags = player.wrongPlacedFlags;
            newPlayer.missedTurns = player.missedTurns;
            newPlayer.turn = player.turn;
            newPlayer.leftGame = player.leftGame;
            newPlayer.isWinner = player.isWinner;
            newPlayer.revealdMine = player.revealdMine;
            this.players.push(newPlayer);
        });
        this.setTurnsForPlayers();
    }
 
    updateGame(gameUpdate) {
        this.clearTurnTimer();
        this.updatePLayers(gameUpdate.players);
        this.mineCounter.counterNumber = gameUpdate.mineCounter;
        this.mineCounter.setCounter(gameUpdate.mineCounter);
        this.allMinesFlagged = gameUpdate.allMinesFlagged;
        this.updateBoardView(this.getTilesToUpdate(gameUpdate.tilesToUpdate), this.waitingPlayer.playerColor);
        this.playerOnTurnDisplay();
        this.setGameFreezer();
        if (gameUpdate.isGameOver) {
            if (this.players.some(player => player.reachedMissedConsecutiveTurnsLimit())) {
                this.displayGameEndMessage();
                return;
            }
            this.displayGameResults();
            return;
        }
        this.displayTurnMessage();
    }

    displayGameResults() {
        let message = "It's a draw!";
        const winner = this.players.find(player => player.isWinner);
        if (winner) {
            if (this.isOpponent(winner)) {
                message = `Player ${winner.name} wins!`
            } else if (!this.isOpponent(winner)) {
                message = "You win!";
            }
        }
        self.uiManager.displayGameResults(this.getSortedPlayersForDisplay(), message);
    }

    displayGameEndMessage() {
        const missedTurnsPLayer = this.players.find(player => player.reachedMissedConsecutiveTurnsLimit());
        let message = "You missed your turn for 5 consecutive times! You loose!";
        if (!this.isOpponent(missedTurnsPLayer)) {
            message = `${missedTurnsPLayer.name} missed his/her turn for 5 consecutive times! You win!`;
        }
        self.uiManager.displayTurnGameOverMessage(message);
    }

    getTilesToUpdate(updatedBoardTiles) {
        const updatedTiles = [];
        updatedBoardTiles.forEach(tile => {
            const tileToUpdate = this.board.getBoardTileBasedOnId(tile.id);
            tileToUpdate.isFlagged = tile.isFlagged;
            tileToUpdate.isMine = tile.isMine;
            tileToUpdate.isRevealed = tile.isRevealed;
            updatedTiles.push(tileToUpdate);
        });
        return updatedTiles;
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
            areaToReaveal.forEach(tile => {
                tile.setRevealed();
            });
            this.updateBoardView(areaToReaveal, this.playerOnTurn.playerColor);
            this.submitMove(areaToReaveal);
        } else if (!clickedTile.isEmpty()) {
            clickedTile.setRevealed();
            this.updateBoardView([clickedTile], this.playerOnTurn.playerColor);
            this.submitMove([clickedTile]);
        }
    }

}
class Game {
    constructor(gameParameters) {






        console.log(gameParameters);
        this.board = new Board(gameParameters.boardParameters.dimensions, gameParameters.mineList, this.clickBoardTile);
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
         // this.playerOnTurn.boardTilesOnMove = [...areaToReaveal];
            // this.submitMove();
            // clickedTile.setFlagColor(self.game.playerOnTurn.playerColor);
            //     clickedTile.setFlaggedStatus(true);
            //     clickedTile.setFlagColor(self.game.playerOnTurn.playerColor);
            //     clickedTile.styleFlaggedBoardTile();
            //     self.game.playerOnTurn.setBoardTilesOnMove([{ ...clickedTile }]);
            //     self.game.mineCounter.setCounter(self.game.board.boardParams.numberOfMines - self.game.board.countFlaggedBoardTiles(), self.game.playerOnTurn.playerColor);
            //     self.game.submitMove();
    }

    revealTile(clickedTile) {
        const playerColor = "#00e6e6";
        if (clickedTile.isMine) {
            clickedTile.setRevealed();
            this.updateBoardView([clickedTile], playerColor);
            // this.playerOnTurn.boardTilesOnMove = [{ ...clickedTile }];
            // this.gameOver();
        } else if (clickedTile.isEmpty()) {
            const areaToReaveal = self.game.board.getBoardAreaToReveal(clickedTile);
            this.updateBoardView(areaToReaveal, playerColor);

            // this.playerOnTurn.boardTilesOnMove = [...areaToReaveal];
            // this.submitMove();
        } else if (!clickedTile.isEmpty()) {
            clickedTile.setRevealed();
            this.updateBoardView([clickedTile], playerColor);
            // this.playerOnTurn.boardTilesOnMove = [{ ...clickedTile }];
            // this.submitMove();
        }


       
    }

    updateBoardView(boardTiles, playerColor) {
        
        boardTiles.forEach(tile => {
            tile.setBoardTileDisplay(playerColor);
        });
        //    console.log(boardTiles);

    }

}
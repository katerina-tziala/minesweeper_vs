class Board {
    constructor(dimensions, mineList, functionName) {
        this.boardDimensions = dimensions;
        this.mineList = mineList;
        this.boardClicked = functionName;
        this.boardTiles = [];
        this.boardElement = document.getElementById(Constants.dom_elements_ids.gameBoard);
        this.initializeBoard();
    }

    initializeBoard() {
        const boardTiles = [];
        for (let xIndex = 0; xIndex < this.boardDimensions.x; xIndex++) {
            const boardRow = document.createElement("div");
            boardRow.classList.add(Constants.classList.centeredFlexbox, Constants.boardClassList.boardRow);
            for (let yIndex = 0; yIndex < this.boardDimensions.y; yIndex++) {
                const boardTile = new BoardTile(this.generateTileIdNumber(xIndex, yIndex), xIndex, yIndex, this.boardClicked);
                boardTiles.push(boardTile);
                boardRow.appendChild(boardTile.getBoardTileElement());
            }
            this.boardElement.appendChild(boardRow);
        }
        this.boardTiles = boardTiles;
        this.setMinesOnBoard();
    }

    generateTileIdNumber(row, column) {
        return (row * this.getNumberOfBoardTilesInRow()) + column;
    }

    getNumberOfBoardTilesInRow() {
        return this.boardDimensions.y;
    }

    getBoardTile(attribute, value) {
        return this.boardTiles.find(boardTile => boardTile[attribute] === value);
    }

    getBoardTileBasedOnId(idNumber) {
        return this.getBoardTile("id", idNumber);
    }

    getBoardTileBasedOnElementId(elementId) {
        return this.getBoardTile("elementId", elementId);
    }

    setMinesOnBoard() {
        this.mineList.forEach(minePosition => {
            this.getBoardTileBasedOnId(minePosition).setMine();
        });
        this.setMineCount();
    }

    setMineCount() {
        this.boardTiles.forEach(boardTile => {
            boardTile.setMineCount(this.getMineCount(boardTile));
        });
    }

    getMineCount(boardTile) {
        return this.getBoardTilesToSearch(boardTile).filter(tile => tile.isMine).length;
    }

    getBoardTilesToSearch(boardTile) {
        let boardTilesToSearch = [];
        const tilesInRow = this.getTilesToSearchInRow(boardTile);
        tilesInRow.forEach(tile => {
            boardTilesToSearch.push(tile);
            boardTilesToSearch = boardTilesToSearch.concat(this.getUpperAndBottomBoardTiles(tile));
        });
        return boardTilesToSearch;
    }

    getTilesToSearchInRow(boardTile) {
        const gridRow = [boardTile];
        const nextTile = this.getBoardTileBasedOnId(boardTile.id + 1);
        const previousTile = this.getBoardTileBasedOnId(boardTile.id - 1);
        if (nextTile && nextTile.dimensions.x === boardTile.dimensions.x) {
            gridRow.push(nextTile);
        }
        if (previousTile && previousTile.dimensions.x === boardTile.dimensions.x) {
            gridRow.push(previousTile);
        }
        return gridRow;
    }

    getUpperAndBottomBoardTiles(boardTile) {
        const boardTiles = [];
        const upperTile = this.getBoardTileBasedOnId(boardTile.id - this.getNumberOfBoardTilesInRow());
        const bottomTile = this.getBoardTileBasedOnId(boardTile.id + this.getNumberOfBoardTilesInRow());
        if (bottomTile && bottomTile.dimensions.y === boardTile.dimensions.y) {
            boardTiles.push(bottomTile);
        }
        if (upperTile && upperTile.dimensions.y === boardTile.dimensions.y) {
            boardTiles.push(upperTile);
        }
        return boardTiles;
    }

    getBoardAreaToReveal(boardTile) {
        let emptyArea = [];
        this.getEmptyArea([boardTile]).forEach(emptyTile => {
            emptyArea = emptyArea.concat(this.getBoardTilesToSearch(emptyTile).filter(tile => !tile.isMine && !tile.isFlagged && !tile.isRevealed));
        });
        return this.getUniqueBoardTiles(emptyArea);
    }

    getEmptyArea(tilesToSearch, emptyTiles = []) {
        let newSearch = [];
        tilesToSearch.forEach(boardTile => {
            if (boardTile.isEmpty()) {
                emptyTiles.push(boardTile);
                this.getEmptyTiles(boardTile).forEach(newEmptyTile => {
                    if (!emptyTiles.map(tile => tile.id).includes(newEmptyTile.id)) {
                        newSearch.push(newEmptyTile);
                    }
                });
            }
        });
        newSearch = this.getUniqueBoardTiles(newSearch);
        if (newSearch.length) {
            return this.getEmptyArea(newSearch, emptyTiles);
        } else {
            return emptyTiles;
        }
    }

    getEmptyTiles(boardTile) {
        return this.getBoardTilesToSearch(boardTile).filter(tile => tile.isEmpty() && !tile.isFlagged && !tile.isRevealed);
    }

    getUniqueBoardTiles(arrayList) {
        return arrayList.filter((object, position, array) => {
            return array.map(mapObj => mapObj.id).indexOf(object.id) === position;
        });
    }

    allMinesFlagged() {
        const bombTilesFlaggedCorrectly = this.boardTiles.filter(boardTile => boardTile.isFlaggedCorrectly());
        return (bombTilesFlaggedCorrectly.length === this.mineList.length) ? true : false;
    }
}
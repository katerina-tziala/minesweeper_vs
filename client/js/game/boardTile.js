class BoardTile {
    constructor(id, x, y, functionName) {
        this.id = id;
        this.dimensions = { "x": x, "y": y };
        this.isFlagged = false;
        this.isRevealed = false;
        this.isMine = false;
        this.mineCount = 0;
        this.elementId = `boardTile_${this.id.toString()}`;
        this.tileClick = functionName;
        this.createBoardTileHTML();
    }

    createBoardTileHTML() {
        const boardTile = document.createElement("button");
        boardTile.type = "button";
        boardTile.setAttribute("id", `${this.elementId}`);
        boardTile.classList.add(Constants.boardClassList.boardTile);
        boardTile.addEventListener("mousedown", this.tileClick);
        this.boardTileElement = boardTile;
    }

    getBoardTileElement() {
        return this.boardTileElement;
    }

    setMine() {
        this.isMine = true;
    }

    setMineCount(mineNumber) {
        this.mineCount = mineNumber;
    }

    setFlagg() {
        this.isFlagged = true;
    }

    setRevealed() {
        this.isRevealed = true;
    }

    isOpen() {
        return (this.isRevealed || this.isFlagged) ? true : false;
    }

    isEmpty() {
        return (!this.isMine && this.mineCount === 0) ? true : false;
    }

    isFlaggedCorrectly() {
        return (this.isFlagged && this.isMine) ? true : false;
    }

    isFlaggedWrongly() {
        return (this.isFlagged && !this.isMine) ? true : false;
    }

    isMineRevealed() {
        return (this.isMine && !this.isFlagged && this.isRevealed) ? true : false;
    }


    setBoardTileDisplay(playerColor) {
        if (this.isMineRevealed()) {
            this.styleMineBoardTile();
        } else if (this.isFlaggedCorrectly()) {
            this.styleFlaggedBoardTile(playerColor);
        } else if (this.isFlaggedWrongly()) {
            this.styleWroglyFlaggedBoardTile(playerColor);
        } else {
            this.styleEmptyBoardTile();
        }
    }

    clearBoardTileStyle() {
        this.boardTileElement.className = Constants.boardClassList.boardTile;
        this.boardTileElement.style.color = null;
        this.boardTileElement.style.border = null;
    }

    styleFlaggedBoardTile(playerColor) {
        this.clearBoardTileStyle();
        this.boardTileElement.innerHTML = "";
        const fontAwesomeFlaggClasses = Constants.fontAwesomeClassList.flag.split(" ");
        this.boardTileElement.classList.add(fontAwesomeFlaggClasses[0], fontAwesomeFlaggClasses[1], Constants.boardClassList.boardTileFlag);
        this.boardTileElement.style.color = playerColor;
        this.boardTileElement.style.border = `1px solid ${playerColor}`;
    }

    styleWroglyFlaggedBoardTile(playerColor) {
        this.clearBoardTileStyle();
        const fontAwesomeClasses = Constants.fontAwesomeClassList.timesCircle.split(" ");
        this.boardTileElement.classList.add(fontAwesomeClasses[0], fontAwesomeClasses[1], Constants.boardClassList.boardTileFlaggedWrongly);
        this.boardTileElement.style.color = playerColor;
    }

    styleMineBoardTile() {
        this.clearBoardTileStyle();
        const fontAwesomeClasses = Constants.fontAwesomeClassList.bomb.split(" ");
        this.boardTileElement.classList.add(fontAwesomeClasses[0], fontAwesomeClasses[1], Constants.boardClassList.boardTileMine);
        if (this.isRevealed) {
            this.boardTileElement.classList.add(Constants.boardClassList.boardTileMineFailed);
        }
    }

    styleEmptyBoardTile() {
        this.clearBoardTileStyle();
        this.boardTileElement.classList.add(Constants.boardClassList.boardTileNumber);
        if (this.mineCount) {
            const minCountString = this.mineCount.toString();
            this.boardTileElement.innerHTML = minCountString;
            this.boardTileElement.classList.add(`${Constants.boardClassList.boardTileNumberIdentifier + minCountString}`);
        }
    }
}
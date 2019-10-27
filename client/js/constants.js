"use strict";

class Constants {
    static connectionLink = "ws://localhost:9000";
    static defaultSessionId = "minesweeper_vs";
    static requestTypes = {
        initializeSession: "initialize-session",
        sessionBroadcast: "session-broadcast",
        updateClient: "update-client",
        sendInvitation: "send-invitation",
        invitationReceivedByUser:"invitation-received-by-user",
        receivedInvitation: "received-invitation",
        declinedInvitation: "invitation-declined",
        acceptedInvitation: "invitation-accepted",
        startGame: "game-initialization",
        gameUpdate: "game-update",
        backToLobby: "back-to-lobby",
    };
  
    static gameLevels = ["begginer", "intermediate", "expert"];
    
    static gameParameters = {
        begginer: {
            "dimensions": { x: 9, y: 9 },
            "numberOfMines": 10
        },
        intermediate: {
            "dimensions": { x: 16, y: 16 },
            "numberOfMines": 40,
        },
        expert: {
            "dimensions": { x: 16, y: 30 },
            "numberOfMines": 99
        },  
    };

    static playerTurnSeconds = 5;
    
    static missedTurnsLimit = 5;
    
    static playerColors = {
        thisPlayer: "#00e6e6",
        opponent: "#ff33cc"
    };

    static digitPositions = {
        "0": [0, 1, 2, 3, 4, 5],
        "1": [1, 2],
        "2": [0, 1, 3, 4, 6],
        "3": [0, 1, 2, 3, 6],
        "4": [1, 2, 5, 6],
        "5": [0, 2, 3, 5, 6],
        "6": [0, 2, 3, 4, 5, 6],
        "7": [0, 1, 2],
        "8": [0 , 1, 2, 3, 4, 5, 6],
        "9": [0, 1, 2, 5, 6],
        "minus": [6]
    };

    static dom_elements_ids = {
        minesweeperVS: "minesweeper_vs",
        banner: "minesweeper_vs__banner-container",
        userForm: "minesweeper_vs__user-form",
        userNameInput: "minesweeper_vs__user-name",
        popUpContainer: "minesweeper_vs__popup-container",
        popUpMessageContainer: "minesweeper_vs__pop-up-message",
        loader: "loader",
        lobby: "minesweeper_vs__lobby-container",
        gameContainer: "minesweeper_vs__game-container",
        gamePlayersContainer: "minesweeper_vs__players-in-game-container",
        game: "minesweeper_vs__game",
        gameMineCounter: "game__mine-counter",
        gameFlagOnPlay: "game__flag",
        gameTimer: "game__timer",
        gameBoard: "game__board",
        gameFreezer: "game__freezer"  
    };

    static classList = {
        hidden: "hidden",
        mainContentDisplay: "content_main-view",
        topBanner: "top-banner",
        wrapColumn: "wrap-column",
        noWrapColumnStart: "nowrap-column-start",
        rowStartFlexbox: "rowStartFlexbox",
        centeredFlexbox: "centeredFlexbox",
        visiblePopUp: "minesweeper_vs__popup--visible",
        buttonBase: "minesweeper_vs__btn",
        buttonText: "minesweeper_vs__text-btn",
        buttonIcon: "minesweeper_vs__icon-btn"
    };

    static popupClassList = {
        invitationHeader: "invitation-header",
        formHeader: "form-header",
        radioContainer: "radio-container",
        checkmark: "checkmark",
        sendInvitationBtn: "send-invitation-btn",
        cancelInvitationBtn: "cancel-invitation-btn",
        receivedInvitationBtn: "received-invitation-btn",
        waitingMesage: "waiting-message",
        blinkDot: "blink-dot"
    };
   
    static playerClassList = {
        playersList: "players-list",
        playerCard: "player-card",
        playerIcon: "player-icon",
        playerName: "player-name",
        playerFlag: "player-flag",
        selfModifier: "--self",
    };

    static boardClassList = {
        boardRow : "board__row",
        boardTile : "board__tile",
        boardTileMine: "tile__mine",
        boardTileMineFailed: "tile__mine--failed",
        boardTileNumber : "tile__number",
        boardTileNumberIdentifier: "tile__number--",
        boardTileFlag : "tile__flag",
        boardTileFlaggedWrongly: "board__tile--wrongly-flagged"
    };

    static fontAwesomeClassList = {
        flag: "fab fa-font-awesome-flag",
        ninja: "fas fa-user-ninja",
        timesX: "fas fa-times",
        timesCircle: "far fa-times-circle",
        bomb: "fas fa-bomb",
    };

    static digitClassList = {
        "digit": "digit",
        "digitLine": "digit_line",
        "digitLineOn": "digit_line--on",
        "digitLineIdentifier": "digit_line--"
    };
}

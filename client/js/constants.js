"use strict";

class Constants {
    static dom_elements_ids = {
        minesweeperVS: "minesweeper_vs",
        banner: "minesweeper_vs__banner-container",
        userForm: "minesweeper_vs__user-form",
        userNameInput: "minesweeper_vs__user-name",
        gameContainer: "minesweeper_vs__game-container",
        popUpContainer: "minesweeper_vs__popup-container",
        popUpMessageContainer: "minesweeper_vs__pop-up-message",
        loader: "loader",
        lobby: "minesweeper_vs__lobby-container",
    };


    static classList = {
        hidden: "hidden",
        topBanner: "top-banner",
        mainContentDisplay: "content_main-view",
        wrapColumn: "wrap-column",
        noWrapColumnStart: "nowrap-column-start",
        rowStartFlexbox: "rowStartFlexbox",
        playerCard: "player-card",
        playerIcon: "player-icon",
        playerName: "player-name",
        playersList: "players-list",
        buttonBase: "minesweeper_vs__btn",
        buttonText: "minesweeper_vs__text-btn",
        buttonIcon: "minesweeper_vs__icon-btn",
        selfModifier: "--self",
        visiblePopUp: "minesweeper_vs__popup--visible",
        invitationHeader: "invitation-header",
        formHeader: "form-header",
        radioContainer: "radio-container",
        checkmark: "checkmark",
        sendInvitationBtn: "send-invitation-btn",
        cancelInvitationBtn: "cancel-invitation-btn",
        receivedInvitationBtn: "received-invitation-btn",
        waitingMesage: "waiting-message",
        blinkDot: "blink-dot",
        fontAwesome_ninja: "fas fa-user-ninja",
        fontAwesome_times: "fas fa-times",
    };

    static connectionLink = "ws://localhost:9000";


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
    };

    static defaultSessionId = "minesweeper_vs";


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
    }
}

"use strict";

class Constants {
    static dom_elements_ids = {
        minesweeperVS: "minesweeper_vs",
        banner: "minesweeper_vs__banner-container",
        userForm: "minesweeper_vs__user-form",
        userNameInput: "minesweeper_vs__user-name",
        gameContainer: "minesweeper_vs__game-container",
        popUpContainer: "minesweeper_vs__popup-container",
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
        fontAwesome_ninja: "fas fa-user-ninja",
        selfModifier: "--self",
    };


    static connectionLink = "ws://localhost:9000";


    static requestTypes = {
        initializeSession: "initialize-session",
        sessionBroadcast: "session-broadcast",
        updateClient: "update-client"
    };

    static defaultSessionId = "minesweeper_vs";
}

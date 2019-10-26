"use strict";

class InterfaceManager {
    constructor() {
        this.getViewElements();
    }

    getViewElements() {
        this.domElements = {
            minesweeperVS: document.getElementById(Constants.dom_elements_ids.minesweeperVS),
            banner: document.getElementById(Constants.dom_elements_ids.banner),
            userForm: document.getElementById(Constants.dom_elements_ids.userForm),
            userNameInput: document.getElementById(Constants.dom_elements_ids.userNameInput),
            gameContainer: document.getElementById(Constants.dom_elements_ids.gameContainer),
            popUpContainer: document.getElementById(Constants.dom_elements_ids.popUpContainer),
            loader: document.getElementById(Constants.dom_elements_ids.loader),
            lobby: document.getElementById(Constants.dom_elements_ids.lobby),


        };
        console.log(this.domElements);
        this.preventFormSubmissionOnEnter(this.domElements.userForm);
    }


    hideElement(element) {
        element.classList.add(Constants.classList.hidden);
    }

    displayElement(element) {
        element.classList.remove(Constants.classList.hidden);
    }

    hideLoader() {
        this.hideElement(this.domElements.loader);
    }

    preventFormSubmissionOnEnter(form) {
        form.onkeypress = (event) => {
            const key = event.charCode || event.keyCode || 0;
            if (key == 13) {
                event.preventDefault();
            }
        }
    }

    getUserName() {
        return this.domElements.userNameInput.value.trim();
    }

    setLobbyView() {
        this.hideElement(this.domElements.userForm);
        this.displayElement(this.domElements.lobby);
        this.hideElement(this.domElements.gameContainer);
        this.hideElement(this.domElements.popUpContainer);
        this.domElements.banner.classList.add(Constants.classList.topBanner);
        this.domElements.minesweeperVS.classList.remove(Constants.classList.wrapColumn);
        this.domElements.minesweeperVS.classList.add(Constants.classList.noWrapColumnStart, Constants.classList.mainContentDisplay);
    }

    renderLobbyClients() {
        this.domElements.lobby.innerHTML = "";
        const clientCard = this.createClientCard(self.connectionManager.client, true);
        this.domElements.lobby.append(clientCard);
        const peersToDisplay = self.connectionManager.peers.filter(peer => peer.entered);
        const playerList = document.createElement("div");
        playerList.classList.add(Constants.classList.rowStartFlexbox, Constants.classList.playersList);
        if (peersToDisplay.length) {
            peersToDisplay.forEach(peer => {
                const peerCard = this.createClientCard(peer, false);
                playerList.append(peerCard);
            });
        } else {
            const message = document.createElement("div");
            message.innerHTML = "no one is here now!";
            playerList.append(message);
        }
        this.domElements.lobby.append(playerList);
    }


    createClientCard(client, isThisPlayer = false) {
        const userCard = document.createElement("div");
        userCard.classList.add(Constants.classList.rowStartFlexbox, Constants.classList.playerCard);
        const userIcon = this.createUserCardIcon();
        const userName = this.createUserCardName(client.name);
        if (isThisPlayer) {
            userCard.classList.add(Constants.classList.playerCard + Constants.classList.selfModifier);
            userIcon.classList.add(Constants.classList.playerIcon + Constants.classList.selfModifier);
        }
        userCard.append(userIcon, userName);
        if (!isThisPlayer) {
            const inviteBtn = this.createButton(this.invitePlayer)
            inviteBtn.classList.add(Constants.classList.buttonText);
            inviteBtn.innerHTML = "invite";
            inviteBtn.setAttribute("id", client.id);
            userCard.append(inviteBtn);
        }
        return userCard;
    }

    createUserCardIcon() {
        const playerIcon = document.createElement("div");
        playerIcon.className = Constants.classList.fontAwesome_ninja;
        playerIcon.classList.add(Constants.classList.playerIcon);
        return playerIcon;
    }

    createUserCardName(name) {
        const playerName = document.createElement("div");
        playerName.classList.add(Constants.classList.playerName);
        playerName.innerHTML = name;
        return playerName;
    }

    createButton(funtionName) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = Constants.classList.buttonBase;
        button.addEventListener("click", funtionName);
        return button;
    }

    invitePlayer() {
        console.log("invitePlayer");

    }
}

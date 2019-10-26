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
        console.log("setLobbyView");
        this.domElements.userNameInput.value = "";
        this.hideElement(this.domElements.userForm);
        this.displayElement(this.domElements.lobby);
        this.hideElement(this.domElements.gameContainer);
        this.hideElement(this.domElements.popUpContainer);
        this.domElements.banner.classList.add(Constants.classList.topBanner);
        this.domElements.minesweeperVS.classList.remove(Constants.classList.wrapColumn);
        this.domElements.minesweeperVS.classList.add(Constants.classList.noWrapColumnStart, Constants.classList.mainContentDisplay);
    }
}

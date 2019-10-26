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
            gameContainer: document.getElementById(Constants.dom_elements_ids.gameContainer),
            popUpContainer: document.getElementById(Constants.dom_elements_ids.popUpContainer),
            loader: document.getElementById(Constants.dom_elements_ids.loader),
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
}

"use strict";
let uiManager;
document.addEventListener("DOMContentLoaded", (event) => {
    console.log("hi");
    self.uiManager = new InterfaceManager();
    self.uiManager.hideLoader();

});


function getUserName(event) {
    console.log(event);
    
}
"use strict";
class Client {
    constructor(parameters) {
        this.id = parameters.id;
        this.name = parameters.name;
        this.entered = parameters.entered;
    }

    setSessionId(sessionId) {
        this.sessionId = sessionId;
    }
}
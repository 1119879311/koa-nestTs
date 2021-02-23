"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InjectToken {
    constructor(injectIdefer) {
        this.injectIdefer = injectIdefer;
    }
}
exports.InjectToken = InjectToken;
function getTokenName(token) {
    return typeof token === "string"
        ? token
        : (token instanceof InjectToken
            ? token.injectIdefer : token.name);
}
exports.getTokenName = getTokenName;

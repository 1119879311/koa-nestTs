"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const Constant_1 = require("./Constant");
function Inject(token) {
    return function (target, perperity, index) {
        Reflect.defineMetadata(Constant_1.INJECT_METADATA_KEY, token, target, `index-${index}`);
    };
}
exports.Inject = Inject;
function getInjectParams(target, index) {
    return Reflect.getMetadata(Constant_1.INJECT_METADATA_KEY, target, `index-${index}`);
}
exports.getInjectParams = getInjectParams;

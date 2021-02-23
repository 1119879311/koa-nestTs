"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const Constant_1 = require("./Constant");
function getControllerMeta(target) {
    let classMeta = Reflect.getMetadata(Constant_1.CONTROLLER_META_KEY, target);
    if (!classMeta) {
        classMeta = { prefix: "", routers: {} };
        Reflect.defineMetadata(Constant_1.CONTROLLER_META_KEY, classMeta, target);
    }
    return classMeta;
}
exports.getControllerMeta = getControllerMeta;
function Controller(prefix) {
    return function (target) {
        let meta = getControllerMeta(target);
        meta.prefix = prefix;
        Reflect.defineMetadata(Constant_1.CONTROLLER_META_KEY, meta, target);
    };
}
exports.Controller = Controller;

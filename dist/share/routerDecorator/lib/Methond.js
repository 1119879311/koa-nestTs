"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const Constant_1 = require("./Constant");
const Controller_1 = require("./Controller");
// 方法
function RequestFactory(methond) {
    return function (path) {
        return function (target, methodName, dec) {
            let classMeta = Controller_1.getControllerMeta(target);
            let methondMeta = { path: path || "", methond };
            classMeta.routers[methodName] = methondMeta;
            Reflect.defineMetadata(Constant_1.CONTROLLER_META_KEY, classMeta, target.constructor);
        };
    };
}
exports.RequestFactory = RequestFactory;
exports.GET = RequestFactory("get");
exports.POST = RequestFactory("post");
exports.PUT = RequestFactory("put");
exports.DELETE = RequestFactory("delete");
exports.ALL = RequestFactory("all");

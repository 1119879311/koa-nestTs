"use strict";
// 中间件
Object.defineProperty(exports, "__esModule", { value: true });
const Constant_1 = require("./Constant");
function Use(...middlewares) {
    return function (objectOrFunction, methodName) {
        const oldMiddleware = Reflect.getMetadata(Constant_1.MIDDLEWARES_META_KEY, objectOrFunction, methodName) || [];
        Reflect.defineMetadata(Constant_1.MIDDLEWARES_META_KEY, [...oldMiddleware, ...middlewares], objectOrFunction, methodName);
    };
}
exports.Use = Use;
function getMiddleware(instance, methodName) {
    let classMiddleWare = Reflect.getMetadata(Constant_1.MIDDLEWARES_META_KEY, instance.constructor) || [];
    let methodNameMiddleWare = Reflect.getMetadata(Constant_1.MIDDLEWARES_META_KEY, instance, methodName) || [];
    return [...classMiddleWare, ...methodNameMiddleWare];
}
exports.getMiddleware = getMiddleware;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constant_1 = require("./Constant");
function Guard(...middlewares) {
    return function (objectOrFunction, methodName) {
        console.log(middlewares, objectOrFunction, methodName);
        const oldMiddleware = Reflect.getMetadata(Constant_1.GUARD_META_KEY, objectOrFunction, methodName) || [];
        Reflect.defineMetadata(Constant_1.GUARD_META_KEY, [...oldMiddleware, ...middlewares], objectOrFunction, methodName);
    };
}
exports.Guard = Guard;
function getGuard(instance, methodName) {
    let classMiddleWare = Reflect.getMetadata(Constant_1.GUARD_META_KEY, instance.constructor) || [];
    let methodNameMiddleWare = Reflect.getMetadata(Constant_1.GUARD_META_KEY, instance, methodName) || [];
    //这里需要处理成中间的形式
    return GuardTranformsMiddleWare(instance, methodName, ...[...classMiddleWare, ...methodNameMiddleWare]);
}
exports.getGuard = getGuard;
function GuardTranformsMiddleWare(instance, methodName, ...middlewares) {
    return middlewares.map(((itme) => {
        return async (ctx, next) => {
            try {
                let res = await itme({ get: (mataKey) => Reflect.getMetadata(mataKey, instance, methodName), ctx });
                if (res === true) {
                    await next();
                }
                else {
                    ctx.body = await res;
                }
            }
            catch (error) {
                throw error;
            }
        };
    }));
}
exports.GuardTranformsMiddleWare = GuardTranformsMiddleWare;

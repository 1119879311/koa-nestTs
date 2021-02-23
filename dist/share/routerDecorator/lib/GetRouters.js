"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Controller_1 = require("./Controller");
const path_1 = __importDefault(require("path"));
const Parameter_1 = require("./Parameter");
const Use_Decorator_1 = require("./Use.Decorator");
const Guard_Decorator_1 = require("./Guard.Decorator");
function GetRouters(instance) {
    try {
        if (typeof instance == "function") {
            instance = Reflect.construct(instance, []);
        }
        if (typeof instance != "object" && typeof instance.constructor != "function") {
            throw (`Controller is not class Function,resiger is fail`);
        }
        let { prefix, routers } = Controller_1.getControllerMeta(instance.constructor);
        let mRouters = [];
        for (let key in routers) {
            if (key == "constructor")
                return;
            //获取中间件
            let middleware = Use_Decorator_1.getMiddleware(instance, key) || [];
            console.log("middleware", middleware);
            //获取守卫
            let guard = Guard_Decorator_1.getGuard(instance, key) || [];
            let routerMeat = routers[key];
            let pathname = path_1.default.join('/', prefix || '', routerMeat.path || '').replace(/\\+/g, "/") || "/";
            let methond = routerMeat.methond;
            //方法参数
            let parameterMeta = Parameter_1.getMothodParameter(instance, key) || [];
            let actionFn = async (ctx, next) => {
                let args = parameterMeta.map((itme) => itme.fn(ctx)).reverse();
                var resFn = await instance[key].call(instance, ...args);
                if (resFn)
                    ctx.body = await resFn;
            };
            mRouters.push({ methond, path: pathname, midwares: middleware, guards: guard, action: actionFn });
        }
        return mRouters;
    }
    catch (error) {
        throw error;
    }
}
exports.GetRouters = GetRouters;

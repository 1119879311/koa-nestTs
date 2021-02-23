"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Controller_1 = require("./Controller");
const Guard_Decorator_1 = require("./Guard.Decorator");
const Use_Decorator_1 = require("./Use.Decorator");
const path_1 = __importDefault(require("path"));
const Parameter_1 = require("./Parameter");
function ResigerRouters(routerIntance, controllerInstance, midwares = [], golbalGuards = []) {
    if (Array.isArray(controllerInstance)) {
        controllerInstance.forEach(itme => ResigerRouter(routerIntance, itme, midwares, golbalGuards));
    }
    else {
        ResigerRouter(routerIntance, controllerInstance, midwares, golbalGuards);
    }
}
exports.ResigerRouters = ResigerRouters;
function ResigerRouter(routerIntance, controllerInstance, midwares = [], golbalGuards = []) {
    if (typeof controllerInstance == "function") {
        controllerInstance = Reflect.construct(controllerInstance, []);
    }
    if (typeof controllerInstance == "object" && typeof controllerInstance.constructor != "function") {
        throw (`Controller is not class Function,resiger is fail`);
    }
    let { prefix, routers } = Controller_1.getControllerMeta(controllerInstance.constructor);
    for (let key in routers) {
        if (key == "constructor")
            return;
        //获取中间件
        let middlewares = [...midwares, ...Use_Decorator_1.getMiddleware(controllerInstance, key) || []];
        //获取守卫
        let guards = [
            ...Guard_Decorator_1.getGuard(controllerInstance, key) || [],
            ...Guard_Decorator_1.GuardTranformsMiddleWare(controllerInstance, key, ...golbalGuards)
        ];
        let routerMeat = routers[key];
        let pathname = path_1.default.join('/', prefix || '', routerMeat.path || '').replace(/\\+/g, "/") || "/";
        let methond = routerMeat.methond;
        //方法参数
        let parameterMeta = Parameter_1.getMothodParameter(controllerInstance, key) || [];
        let actionFn = async (ctx) => {
            let args = parameterMeta.map((itme) => itme.fn(ctx)).reverse();
            var resFn = await controllerInstance[key].call(controllerInstance, ...args);
            if (resFn)
                ctx.body = await resFn;
        };
        routerIntance[methond](pathname, ...middlewares, ...guards, actionFn);
    }
}
exports.ResigerRouter = ResigerRouter;

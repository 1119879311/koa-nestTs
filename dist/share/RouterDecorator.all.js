"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const path = __importStar(require("path"));
exports.Controller_Metate_Params = Symbol("Controller_Metate_Params");
exports.Methond_Metate_Params = Symbol("Methond_Metate_Params");
function getControllerMeta(target) {
    let classMeta = Reflect.getMetadata(exports.Controller_Metate_Params, target);
    if (!classMeta) {
        classMeta = { prefix: "", routers: {}, midwares: [] };
        Reflect.defineMetadata(exports.Controller_Metate_Params, classMeta, target);
    }
    return classMeta;
}
exports.getControllerMeta = getControllerMeta;
function Controller(prefix, midwares) {
    return function (target) {
        let meta = getControllerMeta(target);
        meta.prefix = prefix;
        meta.midwares = midwares || [];
        Reflect.defineMetadata(exports.Controller_Metate_Params, meta, target);
    };
}
exports.Controller = Controller;
function RequestFactory(methond) {
    return function (path, midwares) {
        return function (target, methodName, dec) {
            let classMeta = getControllerMeta(target);
            let methondMeta = { path: path || "", methond, midwares: midwares || [] };
            classMeta.routers[methodName] = methondMeta;
            Reflect.defineMetadata(exports.Controller_Metate_Params, classMeta, target.constructor);
        };
    };
}
exports.RequestFactory = RequestFactory;
// 方法参数
function factroyParameter(fn) {
    return function (target, methodName, paramsIndex) {
        let meta = Reflect.getMetadata(exports.Methond_Metate_Params, target, methodName) || [];
        meta.push({ methodName, fn, paramsIndex });
        Reflect.defineMetadata(exports.Methond_Metate_Params, meta, target, methodName);
    };
}
exports.factroyParameter = factroyParameter;
exports.GET = RequestFactory("get");
exports.POST = RequestFactory("post");
exports.PUT = RequestFactory("put");
exports.DELETE = RequestFactory("delete");
exports.ALL = RequestFactory("all");
exports.Ctx = () => factroyParameter((ctx) => ctx);
exports.Req = () => factroyParameter((ctx) => ctx.request);
exports.Res = () => factroyParameter((ctx) => ctx.response);
exports.Query = () => factroyParameter((ctx) => JSON.parse(JSON.stringify(ctx.request.query)));
exports.Param = () => factroyParameter((ctx) => ctx.request.param);
exports.Body = () => factroyParameter((ctx) => ctx.request.body);
function GetRouters(instance) {
    try {
        if (typeof instance == "function") {
            instance = Reflect.construct(instance, []);
        }
        if (typeof instance != "object" && typeof instance.constructor != "function") {
            throw (`Controller is not class Function,resiger is fail`);
        }
        let { prefix, midwares, routers } = getControllerMeta(instance.constructor);
        let mRouters = [];
        for (let key in routers) {
            if (key == "constructor")
                return;
            let methondMeta = routers[key];
            let routerMeat = routers[key];
            let pathname = path.join('/', prefix, routerMeat.path).replace(/\\+/g, "/") || "/";
            let methond = routerMeat.methond;
            let methondMiidwares = methondMeta.midwares || [];
            let parameterMeta = Reflect.getMetadata(exports.Methond_Metate_Params, instance, key) || [];
            let actionFn = async (ctx, next) => {
                try {
                    let args = parameterMeta.map((itme) => itme.fn(ctx)).reverse();
                    var resFn = await instance[key].call(instance, ...args);
                    if (resFn)
                        ctx.body = await resFn;
                    next();
                }
                catch (error) {
                    console.log(error.stack, error, ctx.response);
                    ctx.response.status = 500;
                    ctx.body = await error.message ? error.message : error;
                    next();
                }
            };
            mRouters.push({ methond, path: pathname, midwares: [...midwares, ...methondMiidwares, actionFn] });
        }
        return mRouters;
    }
    catch (error) {
        throw error;
    }
}
exports.GetRouters = GetRouters;
function ResigerRouter(routerIntance, routers) {
    if (Array.isArray(routers)) {
        routers.forEach(itme => routerIntance[itme.methond](itme.path, ...itme.midwares));
    }
}
exports.ResigerRouter = ResigerRouter;

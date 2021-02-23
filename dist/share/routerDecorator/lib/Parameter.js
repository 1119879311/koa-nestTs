"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const Constant_1 = require("./Constant");
// 方法参数
function factroyParameter(fn) {
    return function (target, methodName, paramsIndex) {
        let meta = Reflect.getMetadata(Constant_1.PARAMS_META_KEY, target, methodName) || [];
        meta.push({ methodName, fn, paramsIndex });
        Reflect.defineMetadata(Constant_1.PARAMS_META_KEY, meta, target, methodName);
    };
}
exports.factroyParameter = factroyParameter;
function getMothodParameter(instance, key) {
    return Reflect.getMetadata(Constant_1.PARAMS_META_KEY, instance, key) || [];
}
exports.getMothodParameter = getMothodParameter;
exports.Ctx = () => factroyParameter((ctx) => ctx);
exports.Req = () => factroyParameter((ctx) => ctx.request);
exports.Res = () => factroyParameter((ctx) => ctx.response);
exports.Query = () => factroyParameter((ctx) => JSON.parse(JSON.stringify(ctx.request.query)));
exports.Param = () => factroyParameter((ctx) => ctx.request.param);
exports.Body = () => factroyParameter((ctx) => ctx.request.body);

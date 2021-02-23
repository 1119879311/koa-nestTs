"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const Constant_1 = require("./Constant");
function Module(option) {
    return function (target) {
        Reflect.defineMetadata(Constant_1.IS_Module_KEY, true, target);
        Reflect.defineMetadata(Constant_1.Module_Metate_Params, option, target);
        return target;
    };
}
exports.Module = Module;
function getModuleMeataParams(target) {
    return Reflect.getMetadata(Constant_1.Module_Metate_Params, target);
}
exports.getModuleMeataParams = getModuleMeataParams;

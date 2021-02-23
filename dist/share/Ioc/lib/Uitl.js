"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constant_1 = require("./Constant");
//是否控制器
function isController(target) {
    return Reflect.getMetadata(Constant_1.IS_Controller_KEY, target) === true;
}
exports.isController = isController;
//是否模块
function isModule(target) {
    return Reflect.getMetadata(Constant_1.IS_Module_KEY, target) === true;
}
exports.isModule = isModule;
//是否是注入依赖
function isInjectable(target) {
    return Reflect.getMetadata(Constant_1.INJECTABLE_METADATA_KEY, target) === true;
}
exports.isInjectable = isInjectable;
// 设置为可注入依赖
function setInjectable(target) {
    Reflect.defineMetadata(Constant_1.INJECTABLE_METADATA_KEY, true, target);
}
exports.setInjectable = setInjectable;
// 设置为控制器类型
function setController(target) {
    Reflect.defineMetadata(Constant_1.IS_Controller_KEY, true, target);
}
exports.setController = setController;

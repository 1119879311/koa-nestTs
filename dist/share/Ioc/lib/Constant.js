"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 常量
exports.DesignParamtypes = "design:paramtypes"; //内置的获取构造函数的参数
// 类注入依赖标识
exports.INJECTABLE_METADATA_KEY = Symbol("INJECTABLE_KEY");
//参数注入依赖标识
exports.INJECT_METADATA_KEY = Symbol("INJECT_KEY");
// 标识控制器
exports.IS_Controller_KEY = Symbol("IS_Controller_KEY");
// 标识模块
exports.IS_Module_KEY = Symbol("IS_Module_KEY");
// 标识模块注入的参数
exports.Module_Metate_Params = Symbol("Module_Metate_Params");

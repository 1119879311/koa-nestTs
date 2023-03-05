// 常量
export const DesignParamtypes = "design:paramtypes";//内置的获取构造函数的参数

// 类注入依赖标识
export const INJECTABLE_METADATA_KEY = Symbol("INJECTABLE_KEY")

//参数注入依赖标识
export const INJECT_METADATA_KEY = Symbol("INJECT_KEY")

// 标识控制器
export const IS_Controller_KEY = Symbol("IS_Controller_KEY")

// 标识模块
export const IS_Module_KEY=Symbol("IS_Module_KEY") 

// 标识模块注入的参数
export const Module_Metate_Params=Symbol("Module_Metate_Params")


// 判定是否基础类型
export const typeExInculeds = [
    "String",
    "Function",
    "Array",
    "Number",
    "Date",
    "RegExp",
    "Boolean",
    "Symbol",
    "Object",
    "Null",
    "Undefined",
  ];
  


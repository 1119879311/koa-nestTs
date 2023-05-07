export const CONTROLLER_META_KEY = Symbol("controller_meta_key")
export const MOTHOD_META_KEY = Symbol("method_meta_key")
export const PARAMS_META_KEY = Symbol("params_meta_key")
export const  MIDDLEWARES_META_KEY = Symbol("middlewares_meta_key")
export const  GUARD_META_KEY = Symbol("guard_meta_key")

export const DesignParamtypes = "design:paramtypes";//内置的获取构造函数的参数


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
  



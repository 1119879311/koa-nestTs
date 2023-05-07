import {
  DesignParamtypes,
  INJECTABLE_METADATA_KEY,
  IS_Controller_KEY,
  IS_Module_KEY,
  typeExInculeds
} from "./Constant";
import { Token, Type } from "./Token";

//是否控制器
export function isController(target: any) {
  return Reflect.getMetadata(IS_Controller_KEY, target) === true;
}

//是否模块
export function isModule(target: any) {
  return Reflect.getMetadata(IS_Module_KEY, target) === true;
}

//是否是注入依赖
export function isInjectable(target: any) {
  return Reflect.getMetadata(INJECTABLE_METADATA_KEY, target) === true;
}

// 设置为可注入依赖
export function setInjectable(target: any) {
  Reflect.defineMetadata(INJECTABLE_METADATA_KEY, true, target);
}

// 设置为控制器类型
export function setController(target: any) {
  Reflect.defineMetadata(IS_Controller_KEY, true, target);
}

// 获取类构造函数参数
export function getInjectConstructParams<T>(
  target: Token<T>
): Array<Type<T> | undefined> {
  return Reflect.getMetadata(DesignParamtypes, target) || [];
}


export function isString(value:unknown):value is string{
  return typeof value ==="string"
} 

export function isFun(value:unknown):value is Function{
  return typeof value ==="function"
} 


export function isObj(value:unknown):value is Object{
  return typeof value ==="object"
} 

export function isNotBaseType(name:string):boolean{
  return !typeExInculeds.includes(name)
}

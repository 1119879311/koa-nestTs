import { INJECTABLE_METADATA_KEY, IS_Controller_KEY, IS_Module_KEY } from "./Constant";

//是否控制器
export function isController(target: any) {
    return Reflect.getMetadata(IS_Controller_KEY, target) === true
}


//是否模块
export function isModule(target: any) {
    return Reflect.getMetadata(IS_Module_KEY, target) === true
}

//是否是注入依赖
export function isInjectable(target: any) {
    return Reflect.getMetadata(INJECTABLE_METADATA_KEY, target) === true
}

// 设置为可注入依赖
export function setInjectable(target:any){
    Reflect.defineMetadata(INJECTABLE_METADATA_KEY,true, target)
}

// 设置为控制器类型
export function setController(target:any){
    Reflect.defineMetadata(IS_Controller_KEY,true, target)
}
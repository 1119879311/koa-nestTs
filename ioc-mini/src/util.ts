/*************** 常量声明************************* */

// 声明 依赖注入(DI)的 key
export const InjectKey = "INJECT_METADATA_KEY"; 


// 声明要将类进行控制反转的 key
export const InjectableKey = "INJECTABLE_METADATA_KEY"; 


// 内置的获取构造函数的参数
export const DesignParamtypes = "design:paramtypes";


/******************ts类型声明********************** */

/**
 * 类声明
 */
export interface Type<T> extends Function {
    new (...args:any[]):T
}

export interface ValueProvider<T> {
    provide:string|Type<T>
    useValue:any
}
export interface ClassProvider<T> {
    provide:string|Type<T>
    useClass:Type<T>
}

/**
 * 三种类型的写法
 */
export type Provider<T> = Type<T>|ValueProvider<T> | ClassProvider<T>


/*************** 工具方法************************* */
/**
 * 判定是控制反转的提供者(类)
 * @param target 
 * @returns 
 */
export const isInjectable = (target:any)=>{
    return typeof target ==="function" && Reflect.getMetadata(InjectableKey, target)
}

/**
 * 判断是否是 { provide,useClass }类型的写法
 * @param arg 
 * @returns 
 */
export function isClassProvider<T>(arg:unknown):arg is ClassProvider<T>{
    return (arg as any).useClass !==undefined
}

/**
 *判断是否是 { provide,useValue } 类型的写法
 * @param arg 
 * @returns 
 */
export function isValueProvider<T>(arg:unknown):arg is ValueProvider<T>{
    return (arg as any).useValue !==undefined
}


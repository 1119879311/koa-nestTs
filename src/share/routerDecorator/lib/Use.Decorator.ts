// 中间件

import { MIDDLEWARES_META_KEY } from "./Constant"

export function Use(...middlewares: Array<Function>): Function;
export function Use(
    ...middlewares: Array<Function | ((ctx: any, next: Function) => Promise<any>|any)>
  ): Function {
    return function (objectOrFunction: Object | Function, methodName?: string) {
        const oldMiddleware = Reflect.getMetadata(MIDDLEWARES_META_KEY,objectOrFunction,methodName)||[];
        Reflect.defineMetadata(MIDDLEWARES_META_KEY,[...oldMiddleware,...middlewares],objectOrFunction,methodName)
    }
}

export function getMiddleware(instance:Object,methodName?: string){
    let classMiddleWare = Reflect.getMetadata(MIDDLEWARES_META_KEY,instance.constructor)||[]
    let methodNameMiddleWare = Reflect.getMetadata(MIDDLEWARES_META_KEY,instance,methodName)||[];
    return [...classMiddleWare,...methodNameMiddleWare]
}

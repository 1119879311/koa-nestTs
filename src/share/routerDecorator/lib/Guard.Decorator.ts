import { GUARD_META_KEY } from "./Constant"

export function Guard(...middlewares: Array<Function>): Function;
export function Guard(
    ...middlewares: Array<Function | ((ctx: any, next: Function) => Promise<any>|any)>
  ): Function {
    return function (objectOrFunction: Object | Function, methodName?: string) {
        console.log(middlewares,objectOrFunction,methodName)
        const oldMiddleware = Reflect.getMetadata(GUARD_META_KEY,objectOrFunction,methodName)||[];
        Reflect.defineMetadata(GUARD_META_KEY,[...oldMiddleware,...middlewares],objectOrFunction,methodName)
    }
}

export function getGuard(instance:Object,methodName?: string){
    let classMiddleWare = Reflect.getMetadata(GUARD_META_KEY,instance.constructor)||[]
    let methodNameMiddleWare = Reflect.getMetadata(GUARD_META_KEY,instance,methodName)||[];
    //这里需要处理成中间的形式
    return GuardTranformsMiddleWare(instance,methodName,...[...classMiddleWare,...methodNameMiddleWare])
}

export interface IGuardFn{
    (opt:{get?:(mataKey:string)=>any,ctx?:any}):any
}
export type IGuardFnParams = Parameters<IGuardFn>[0] 
export function GuardTranformsMiddleWare(instance:Object,methodName?: string,...middlewares: Array<Function>):Array<Function>{
    return middlewares.map(((itme:IGuardFn)=>{
        return  async (ctx:any,next:Function)=> { 
            try {
                let res = await itme({get:(mataKey:string)=> Reflect.getMetadata(mataKey,instance,methodName),ctx})
                if(res===true){
                    await next()
                }else{
                    ctx.body = await res;
                }
            } catch (error) {
                throw error
            }
           
        }
    }))
}


import "reflect-metadata";
import { PARAMS_META_KEY } from "./Constant";
import  Koa from "koa"

// 方法参数
export function factroyParameter(fn: Function) {
    return function (target: any, methodName: any, paramsIndex: any) {

        let meta = Reflect.getMetadata(PARAMS_META_KEY, target, methodName) || []

        meta.push({  methodName, fn, paramsIndex })
        Reflect.defineMetadata(PARAMS_META_KEY, meta,target, methodName)
    }
}


export function getMothodParameter(instance:object,key:string){
    return  Reflect.getMetadata(PARAMS_META_KEY,instance,key)||[]
}

export const Ctx = () => factroyParameter((ctx: Koa) => ctx)
export const Req = () => factroyParameter((ctx: Koa) => ctx.request)
export const Res = () => factroyParameter((ctx: Koa) => ctx.response)
export const Query = () => factroyParameter((ctx: Koa) => JSON.parse(JSON.stringify(ctx.request.query)) )
export const  Param=()=>factroyParameter((ctx:any)=>ctx.request.param)
export const  Body=()=>factroyParameter((ctx:any)=>ctx.request.body)

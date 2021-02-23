

import "reflect-metadata";
import * as path from "path"
import Koa from "koa"
export const Controller_Metate_Params = Symbol("Controller_Metate_Params") 
export const Methond_Metate_Params = Symbol("Methond_Metate_Params") 
export type IMethondType = "get" | "post" | "delete" | "put" | "all"

export type IRouterType = {
    path: string, // "/"
    methond: string|IMethondType //"GET"
    midwares: Function[],
}
//一个方法对应一个路由信息
export type IKeyMapRouters = {
    [methondName: string]: IRouterType
}

export type IControllerMetate = {
    prefix: string | undefined,
    routers: IKeyMapRouters,
    midwares: Function[],
}


export function getControllerMeta(target: any) {
    let classMeta: IControllerMetate = Reflect.getMetadata(Controller_Metate_Params, target)
    if (!classMeta) {
        classMeta = { prefix: "", routers: {}, midwares: [] }
        Reflect.defineMetadata(Controller_Metate_Params, classMeta, target)
    }
    return classMeta
}

export function Controller(prefix?: string, midwares?: Function[]) {
    return function (target: any) {
        let meta: IControllerMetate = getControllerMeta(target)
        meta.prefix = prefix
        meta.midwares = midwares || []
        Reflect.defineMetadata(Controller_Metate_Params, meta, target)
    }
}

export function RequestFactory(methond: string) {
    return function (path?: string, midwares?: Function[]) {
        return function (target: any, methodName: string, dec: PropertyDescriptor) {
          
            let classMeta: IControllerMetate = getControllerMeta(target)

            let methondMeta: IRouterType = { path: path || "", methond, midwares: midwares || [] }

            classMeta.routers[methodName] = methondMeta;

            Reflect.defineMetadata(Controller_Metate_Params, classMeta, target.constructor)
        }
    }
}

// 方法参数
export function factroyParameter(fn: Function) {
    return function (target: any, methodName: any, paramsIndex: any) {

        let meta = Reflect.getMetadata(Methond_Metate_Params, target, methodName) || []

        meta.push({  methodName, fn, paramsIndex })
        Reflect.defineMetadata(Methond_Metate_Params, meta,target, methodName)
    }
}



export const GET = RequestFactory("get");
export const POST = RequestFactory("post");
export const PUT = RequestFactory("put");
export const DELETE = RequestFactory("delete");
export const ALL = RequestFactory("all");
export const Ctx = () => factroyParameter((ctx: Koa) => ctx)
export const Req = () => factroyParameter((ctx: Koa) => ctx.request)
export const Res = () => factroyParameter((ctx: Koa) => ctx.response)
export const Query = () => factroyParameter((ctx: Koa) => JSON.parse(JSON.stringify(ctx.request.query)) )
export const  Param=()=>factroyParameter((ctx:any)=>ctx.request.param)
export const  Body=()=>factroyParameter((ctx:any)=>ctx.request.body)

export function GetRouters(instance:any){
    try {
        if(typeof instance=="function"){
            instance = Reflect.construct(instance,[]);
        }
        if(typeof instance!="object"&&typeof instance.constructor!="function"){
            throw (`Controller is not class Function,resiger is fail`);
        }
    
        let {prefix,midwares,routers}:IControllerMetate = getControllerMeta(instance.constructor)
    
        let mRouters = [];
    
        for(let key  in routers){
            if(key=="constructor") return 
            let methondMeta = routers[key]
            let routerMeat:IRouterType =  routers[key]
            let pathname =  path.join('/',prefix,routerMeat.path).replace(/\\+/g, "/")||"/";
            let methond = routerMeat.methond;
            let methondMiidwares = methondMeta.midwares||[];
            let parameterMeta = Reflect.getMetadata(Methond_Metate_Params,instance,key)||[]
            let actionFn = async (ctx:any,next:Function)=>{
                try {
                    let args = parameterMeta.map((itme: { fn: (arg0: any) => any; })=>itme.fn(ctx)).reverse()
                    var resFn =  await instance[key].call(instance,...args);
                    if(resFn) ctx.body = await resFn
                    next()
                } catch (error) {
                    console.log(error.stack,error,ctx.response)
                    ctx.response.status=500
                    ctx.body = await error.message?error.message:error
                    next()
                }
                
            }
            mRouters.push({ methond,path: pathname,midwares:[...midwares,...methondMiidwares,actionFn]})
        }
        return mRouters
    } catch (error) {
        throw error
    }
}

export function ResigerRouter(routerIntance:any,routers:IRouterType[]){
    if(Array.isArray(routers)){
        routers.forEach(itme=>routerIntance[itme.methond](itme.path,...itme.midwares))
    }
}


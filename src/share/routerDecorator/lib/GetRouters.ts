import { getControllerMeta } from "./Controller";
import { IControllerMetate, IRouterType } from "./Interface";
import path from "path"
import { getMothodParameter } from "./Parameter";
import { getMiddleware } from "./Use.Decorator";
import { getGuard } from "./Guard.Decorator";

export function GetRouters(instance:any){
    try {
        if(typeof instance=="function"){
            instance = Reflect.construct(instance,[]);
        }
        if(typeof instance!="object"&&typeof instance.constructor!="function"){
            throw (`Controller is not class Function,resiger is fail`);
        }
    
        let {prefix,routers}:IControllerMetate = getControllerMeta(instance.constructor)
    
        let mRouters = [];
    
        for(let key  in routers){
            if(key=="constructor") return 
            //获取中间件
            let middleware = getMiddleware(instance,key)||[]
            console.log("middleware",middleware)
            //获取守卫
            let guard = getGuard(instance,key)||[]
            let routerMeat:IRouterType =  routers[key]
            let pathname =  path.join('/',prefix||'',routerMeat.path||'').replace(/\\+/g, "/")||"/";
            let methond = routerMeat.methond;
            
            //方法参数
            let parameterMeta = getMothodParameter(instance,key)||[]

            let actionFn = async (ctx:any,next:Function)=>{

                let args = parameterMeta.map((itme: { fn: (arg0: any) => any; })=>itme.fn(ctx)).reverse()
                var resFn =  await instance[key].call(instance,...args);
                if(resFn) ctx.body = await resFn 
            }
            mRouters.push({ methond,path: pathname,midwares:middleware,guards:guard,action:actionFn})
        }
        return mRouters
    } catch (error) {
        throw error
    }
}
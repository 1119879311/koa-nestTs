
import { getControllerMeta } from "./Controller";
import { getGuard, GuardTranformsMiddleWare } from "./Guard.Decorator";
import { IControllerMetate } from "./Interface";
import { getMiddleware } from "./Use.Decorator";
import path from "path"
import { getMothodParameter } from "./Parameter";



export function ResigerRouters(routerIntance:any,controllerInstance:Object | Function | Array<Object | Function>,midwares:Array<Function>=[],golbalGuards:Array<Function>=[]){
    if(Array.isArray(controllerInstance)){
        controllerInstance.forEach(itme=>ResigerRouter(routerIntance,itme,midwares,golbalGuards))
    }else{
        ResigerRouter(routerIntance,controllerInstance,midwares,golbalGuards)
    }
}
export function ResigerRouter(routerIntance:any,controllerInstance:Object | Function ,midwares:Array<Function>=[],golbalGuards:Array<Function>=[]){

    if(typeof controllerInstance=="function"){
        controllerInstance = Reflect.construct(controllerInstance,[]) ;
    }
    if(typeof controllerInstance=="object"&&typeof controllerInstance.constructor!="function"){
        throw (`Controller is not class Function,resiger is fail`);
    }

    let {prefix,routers}:IControllerMetate = getControllerMeta(controllerInstance.constructor)

    
    for(let key  in routers){
        if(key=="constructor") return 
        //获取中间件
        let middlewares = [...midwares,...getMiddleware(controllerInstance,key)||[]]
        //获取守卫
        let guards = [
            ... getGuard(controllerInstance,key)||[],
            ...GuardTranformsMiddleWare(controllerInstance,key,...golbalGuards)
        ]
       
        let routerMeat =  routers[key]
        let pathname =  path.join('/',prefix||'',routerMeat.path||'').replace(/\\+/g, "/")||"/";
        let methond = routerMeat.methond;
        
        //方法参数
        let parameterMeta = getMothodParameter(controllerInstance,key)||[]

        let actionFn = async (ctx:any)=>{

            let args = parameterMeta.map((itme: { fn: (arg0: any) => any; })=>itme.fn(ctx)).reverse()
            var resFn =  await (controllerInstance as any)[key].call(controllerInstance,...args);
            if(resFn) ctx.body = await resFn 
        }

        routerIntance[methond](pathname,...middlewares,...guards,actionFn)
    }

}

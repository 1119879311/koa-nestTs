import { getControllerMeta } from "./Controller.Decorator";
import { getGuard, GuardTranformsMiddleWare } from "./Guard.Decorator";
import { IControllerMetate } from "./Interface";
import { getMiddleware } from "./Use.Decorator";
import path from "path";
import { getMothodParameter } from "./Parameter.Decorator";
import { Pipe, pipTranfromMiddleWare } from "./Pipe";

type IResigerRouterOption ={
  midwares?: Array<Function>,
  guards?: Array<Function> ,
  pipes?: Array<Pipe> 
}

export function ResigerRouters(
  routerIntance: any,
  controllerInstance: Object | Function | Array<Object | Function>,
  optons?:IResigerRouterOption
) {
  if (Array.isArray(controllerInstance)) {
    controllerInstance.forEach(itme =>ResigerRouter(routerIntance, itme, optons) );
  } else {
    ResigerRouter( routerIntance, controllerInstance, optons );
  }
}



export function ResigerRouter(
  routerIntance: any,
  controllerInstance: Object | Function,
  optons?:IResigerRouterOption
) {
 
  if(!routerIntance){
    throw `Missing parameter routing instance`;
  }
  // console.log("controllerInstance",controllerInstance)
  if (typeof controllerInstance == "function") {
    controllerInstance = Reflect.construct(controllerInstance, []);
  }
  if (
    typeof controllerInstance == "object" &&
    typeof controllerInstance.constructor != "function"
  ) {
    throw `Controller is not class Function,resiger is fail`;
  }
  let { prefix, routers }: IControllerMetate = getControllerMeta(
    controllerInstance.constructor
  );
  const globalMidwares = optons.midwares || []
  const golbalGuards = optons.guards || []
  const globalPipes = optons.pipes || []

  for (let key in routers) {
    if (key == "constructor") return;
    //获取中间件
    let middlewares = [
      ...globalMidwares,
      ...(getMiddleware(controllerInstance, key) || []),
    ];

    // console.log("middlewares",middlewares)

    //获取守卫
    let guards = [
      ...GuardTranformsMiddleWare(controllerInstance, key, ...golbalGuards),
      ...(getGuard(controllerInstance, key) || []),
    ];
    // console.log("guards",guards)
    // 获取管道
    let pips = [
      ...pipTranfromMiddleWare(controllerInstance, key, ...globalPipes),
    ];

    let routerMeat = routers[key];
    let pathname;
    if(routerMeat.path instanceof RegExp){
      pathname = routerMeat.path
    }else if( typeof routerMeat.path!=="object"){
      pathname =
      path
        .join("/", prefix || "", routerMeat.path || "")
        .replace(/\\+/g, "/") || "/";
    }
     

    //方法参数
    let parameterMeta = getMothodParameter(controllerInstance, key) || [];
    let actionFn = async (ctx: any, next: Function) => {
      let args = parameterMeta.map((item: Function) =>
        item(ctx, next, controllerInstance, key)
      );
      const resBody = await (controllerInstance as any)[key].call(
        controllerInstance,
        ...args
      );
      if (resBody !== undefined) ctx.body = await resBody;
      await next();
    };
    let methond = routerMeat.methond;
    routerIntance[methond](
      pathname,
      ...middlewares,
      ...guards,
      ...pips,
      actionFn
    );
  }
}

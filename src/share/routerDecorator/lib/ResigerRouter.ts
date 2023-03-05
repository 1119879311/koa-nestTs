import { getControllerMeta } from "./Controller";
import { getGuard, GuardTranformsMiddleWare } from "./Guard.Decorator";
import { IControllerMetate } from "./Interface";
import { getMiddleware } from "./Use.Decorator";
import path from "path";
import { getMothodParameter } from "./Parameter";
import "reflect-metadata";
import { Pipe, pipTranfromMiddleWare } from "./Pipe";
export function ResigerRouters(
  routerIntance: any,
  controllerInstance: Object | Function | Array<Object | Function>,
  midwares: Array<Function> = [],
  golbalGuards: Array<Function> = [],
  pipesQuence: Array<Pipe> = []
) {
  if (Array.isArray(controllerInstance)) {
    controllerInstance.forEach((itme) =>
      ResigerRouter(routerIntance, itme, midwares, golbalGuards, pipesQuence)
    );
  } else {
    ResigerRouter(
      routerIntance,
      controllerInstance,
      midwares,
      golbalGuards,
      pipesQuence
    );
  }
}
export function ResigerRouter(
  routerIntance: any,
  controllerInstance: Object | Function,
  midwares: Array<Function> = [],
  golbalGuards: Array<Function> = [],
  pipesQuence: Array<Pipe> = []
) {
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

  for (let key in routers) {
    if (key == "constructor") return;
    //获取中间件
    let middlewares = [
      ...midwares,
      ...(getMiddleware(controllerInstance, key) || []),
    ];
    //获取守卫
    let guards = [
      ...GuardTranformsMiddleWare(controllerInstance, key, ...golbalGuards),
      ...(getGuard(controllerInstance, key) || []),
    ];

    // 获取管道
    let pips = [
      ...pipTranfromMiddleWare(controllerInstance, key, ...pipesQuence),
    ];

    let routerMeat = routers[key];
    let pathname =
      path
        .join("/", prefix || "", routerMeat.path || "")
        .replace(/\\+/g, "/") || "/";
    let methond = routerMeat.methond;

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
      // console.log("resBody",resBody)
      if (resBody !== undefined) ctx.body = await resBody;
      await next();
    };

    routerIntance[methond](
      pathname,
      ...middlewares,
      ...guards,
      ...pips,
      actionFn
    );
  }
}

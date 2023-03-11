import "reflect-metadata";
import { CONTROLLER_META_KEY } from "./Constant";
import { getControllerMeta } from "./Controller.Decorator";
import { IControllerMetate, IRouterType } from "./Interface";

// 方法
export function RequestFactory(methond: string) {
  return function (path?: string) {
    return function (target: any, methodName: string, dec: PropertyDescriptor) {
      let classMeta: IControllerMetate = getControllerMeta(target);

      let methondMeta: IRouterType = { path: path || "", methond };

      classMeta.routers[methodName] = methondMeta;

      Reflect.defineMetadata(
        CONTROLLER_META_KEY,
        classMeta,
        target.constructor
      );
    };
  };
}

export const GET = RequestFactory("get");
export const POST = RequestFactory("post");
export const PUT = RequestFactory("put");
export const DELETE = RequestFactory("delete");
export const ALL = RequestFactory("all");

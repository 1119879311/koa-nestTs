import "reflect-metadata";
import { PARAMS_META_KEY } from "./Constant";
import type Koa from "koa";
import { getContext } from "./Util";
import url from "url"

// 方法参数
export function factroyParameter(fn: Function) {
  return function (target: any, methodName: string, paramsIndex: number) {
    let meta: Array<Function> =
      Reflect.getMetadata(PARAMS_META_KEY, target, methodName) || [];
    // meta.push({ methodName, fn, paramsIndex });
    meta.unshift(fn);
    Reflect.defineMetadata(PARAMS_META_KEY, meta, target, methodName);
  };
}

export function getMothodParameter(instance: object, key: string) {
  return Reflect.getMetadata(PARAMS_META_KEY, instance, key) || [];
}
export const Ctx = () => factroyParameter((ctx: Koa) => ctx);
export const Req = () => factroyParameter((ctx: Koa) => ctx.request);
export const Res = () => factroyParameter((ctx: Koa) => ctx.response);
export const Query = (field?: any) =>
  factroyParameter((ctx: Koa) =>
    field ?  ctx.request.query[field] :  {...ctx.request.query}
  );
export const Param = () => factroyParameter((ctx: any) => ctx.request.param);
export const Body = () => factroyParameter((ctx: any) => ctx.request.body);
export const Header = (field?: string) =>
  factroyParameter((ctx: Koa) =>
    field ? ctx.request.headers[field] : ctx.request.headers
  );

export const Next = () => factroyParameter((_: Koa, next: Function) => next);

// 获取当前类型方法的 元数据
export const GetContext = (metaKey?: string | symbol, isClass?: boolean) =>
  factroyParameter(
    (_: any, next: Function, instance: Object, methodName: string) =>
      getContext(instance, methodName, metaKey, isClass)
  );

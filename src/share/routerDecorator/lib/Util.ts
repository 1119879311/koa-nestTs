import { DesignParamtypes } from "../../Ioc/";
import { PARAMS_META_KEY } from "./Constant";

export type IContextOption = {
  get: <T>(metaKey: string | symbol, isClass?: boolean) => T | undefined;
  getArgs: <T = any, I = any>() => [T, I] | undefined;
  ctx: any;
  next?: Function;
};

export function getContext<T = any>(
  instance: object,
  methodName?: string,
  metaKey?: string | symbol,
  isClass?: boolean
): T {
  const fn = (metaKey: string | symbol, isClass?: boolean) =>
    isClass
      ? Reflect.getMetadata(metaKey, instance.constructor)
      : Reflect.getMetadata(metaKey, instance, methodName);
  return metaKey ? fn(metaKey, isClass) : fn;
}

// 获取控制器上的参数 和 类型
export function getArgs<T = any, I = any>(
  ctx: Function,
  next: Function,
  instance: object,
  methodName?: string
): [T, I] {
  const params =
    getContext<Array<any>>(instance, methodName, PARAMS_META_KEY) || []; // 获取真实参数
  const Iparams = getContext<Array<any>>(
    instance,
    methodName,
    DesignParamtypes
  ); // 获取参数类型
  const args = params.map((item: Function) =>
    item(ctx, next, instance, methodName)
  );
  return [args, Iparams] as [T, I];
}

export function getContextOption(
  ctx: any,
  next: Function,
  instance: Object,
  methodName?: string
): IContextOption {
  return {
    get: getContext(instance, methodName),
    getArgs: () => getArgs(ctx, next, instance, methodName),
    ctx,
    next,
  };
}

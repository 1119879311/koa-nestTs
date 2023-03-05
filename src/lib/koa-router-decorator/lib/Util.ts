import { PARAMS_META_KEY,DesignParamtypes,typeExInculeds } from "./Constant";
export function isNotBaseType(name:string):boolean{
  return !typeExInculeds.includes(name)
}

export type IContextOption = {
  get: <T>(metaKey: string | symbol, isClass?: boolean) => T | undefined;
  getArgs: () => Array<any> | undefined;
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
export function getArgs(
  ctx: Function,
  next: Function,
  instance: object,
  methodName?: string
): Array<any> {
  const params =
    getContext<Array<any>>(instance, methodName, PARAMS_META_KEY) || []; // 获取真实参数
  const Iparams = getContext<Array<any>>(
    instance,
    methodName,
    DesignParamtypes
  ); // 获取参数类型
  const args = params.reduce((result:Array<any>,item: Function,index) =>{
    if(isNotBaseType(Iparams[index].name)){
      result.push(({value:item(ctx, next, instance, methodName),type:Iparams[index]}))
    }
    return result
  },[]);
  return args;
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

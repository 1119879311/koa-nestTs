import { GUARD_META_KEY } from './Constant';
import { getContextOption, IContextOption } from './Util';

export function Guard(...middlewares: Array<IGuard>): Function;
export function Guard(...middlewares: Array<IGuard>): Function {
  return function (objectOrFunction: Object | Function, methodName: string) {
    const oldMiddleware = Reflect.getMetadata(GUARD_META_KEY, objectOrFunction, methodName) || [];
    Reflect.defineMetadata(GUARD_META_KEY, [...oldMiddleware, ...middlewares], objectOrFunction, methodName);
  };
}

export function getGuard(instance: Object, methodName: string) {
  let classMiddleWare = Reflect.getMetadata(GUARD_META_KEY, instance.constructor) || [];
  let methodNameMiddleWare = Reflect.getMetadata(GUARD_META_KEY, instance, methodName) || [];
  //这里需要处理成中间的形式
  return GuardTranformsMiddleWare(instance, methodName, ...classMiddleWare, ...methodNameMiddleWare);
}

export type IGuard = (option: IContextOption) => boolean | Promise<boolean>;

export type IGuardParams = Parameters<IGuard>[0];
export function GuardTranformsMiddleWare(
  instance: Object,
  methodName?: string,
  ...middlewares: Array<IGuard>
): Array<Function> {
  return middlewares.map((itme: IGuard) => {
    return async (ctx: any, next: Function) => {
      let res = await itme(getContextOption(ctx, next, instance, methodName));
      if (res === false) {
        throw new Error('Intercept the guard');
      }
      await next();
    };
  });
}

// const a:IGuard = (options)=>{
//   return  false
// }

// @Guard(a)
// class A{
//   @Guard(a)
//   geta(){

//   }
// }

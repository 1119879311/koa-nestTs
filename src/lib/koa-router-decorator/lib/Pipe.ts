import { IContextOption, getContextOption } from "./Util";

export abstract class Pipe {
  abstract apply(option: IContextOption): Promise<void> | void;
}

export function pipTranfromMiddleWare(
  instance: Object,
  methodName?: string,
  ...middlewares: Array<Pipe>
): Array<Function> {
  return middlewares.map((itme: Pipe) => {
    return async (ctx: any, next: Function) => {
      let option = getContextOption(ctx, next, instance, methodName);
      await itme.apply(option);
      await next();
    };
  });
}

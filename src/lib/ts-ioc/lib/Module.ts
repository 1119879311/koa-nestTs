import { Type } from "./Token";
import "reflect-metadata";
import { Provider } from "./Provider";
import { IS_Module_KEY, Module_Metate_Params } from "./Constant";
import { IforwardRef } from "./forwardRef";

export interface Imodule<T = any> {
  imports?: Array<Type<T>>;
  providers?: (Provider<T> | Type<T> | IforwardRef<T>)[]; //Array<Provider<T>|Type<T>>
  controllers?: Type<T>[];
}

export function Module(option?: Imodule) {
  return function (target: any) {
    Reflect.defineMetadata(IS_Module_KEY, true, target);
    Reflect.defineMetadata(Module_Metate_Params, option, target);
    return target;
  };
}

export function getModuleMeataParams(target: any) {
  return Reflect.getMetadata(Module_Metate_Params, target);
}

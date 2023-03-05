import "reflect-metadata";

export function setMetadata(mataKey: any, data: any): Function;
export function setMetadata(mataKey: any, data: any): Function {
  return function (objectOrFunction: Object, methodName?: string) {
    Reflect.defineMetadata(mataKey, data, objectOrFunction, methodName);
  };
}

export function getMetadata(
  mataKey: any,
  target: Object,
  targetKey?: string | symbol
) {
  return Reflect.getMetadata(mataKey, target, targetKey);
}

export const isString = (fn: unknown): fn is string => typeof fn === "string";

export const isObject = (val: unknown): val is object =>
  typeof val === "object" && val !== null;

export const isFunction = (value: unknown): value is Function =>
  typeof value === "function";
// 创建工厂函数
export function createFacroy<T>(c: {
  new (...args: any[]): T;
}): (...args: any[]) => T {
  let instacen: T;
  return function (...args: any[]): T {
    if (!instacen) {
      instacen = new c(...args);
    }
    return instacen;
  };
}

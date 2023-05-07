// 创建工厂函数
export function createFacroy<T>(c: { new (...args: any[]): T }): (...args: any[]) => T {
  let instacen: T;
  return function (...args: any[]): T {
    if (!instacen) {
      instacen = new c(...args);
    }
    return instacen;
  };
}

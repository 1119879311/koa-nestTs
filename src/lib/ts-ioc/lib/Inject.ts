import "reflect-metadata";
import { INJECT_METADATA_KEY } from "./Constant";
import { Token } from "./Token";

export function Inject(token: any) {
  return function (target: any, perperity: string, index: number) {
    let meta: Record<number,any> =
      Reflect.getMetadata(INJECT_METADATA_KEY, target, perperity) || {};
      meta[index] = token
    // meta.unshift(token)
    Reflect.defineMetadata(INJECT_METADATA_KEY, meta, target, perperity);
  };
}
// export function Inject(token: Token<any>) {
//   return function (target: any, perperity: string, index: number) {
//     Reflect.defineMetadata(
//       INJECT_METADATA_KEY,
//       token,
//       target,
//       `index-${index}`
//     );
//   };
// }

export function getInjectParams(target: any, perperity?: string,index?:number) {
  let result = Reflect.getMetadata(INJECT_METADATA_KEY, target, perperity) || {};
  return typeof index==="number" ? result[index] :  result
}

import "reflect-metadata";
import { INJECT_METADATA_KEY } from "./Constant";
import { Token } from "./Token";
export function Inject(token: Token<any>) {
  return function (target: any, perperity: string, index: number) {
    Reflect.defineMetadata(
      INJECT_METADATA_KEY,
      token,
      target,
      `index-${index}`
    );
  };
}

export function getInjectParams(target: any, index: number) {
  return Reflect.getMetadata(INJECT_METADATA_KEY, target, `index-${index}`);
}

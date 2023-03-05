import { Provider } from "./Provider";
import { Type } from "./Token";
export type IforwardRef<T> = () => Provider<T> | Type<T>;
export function forwardRef<T>(fn: IforwardRef<T>) {
  return fn();
}

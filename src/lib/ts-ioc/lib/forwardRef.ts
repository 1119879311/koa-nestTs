import {  Type } from "./Token";
export type IforwardRefPro<T> ={ () : Type<T>,forwardRef:boolean};

export type IforwardRef<T> =() => Type<T>

export function isforwardRef<T>(arg:unknown):arg is IforwardRef<T>{
  return (arg as any).forwardRef !==undefined
} 
export function forwardRef<T>(fn: ()=> any) {
  (fn as IforwardRefPro<T>).forwardRef = true
  return fn;
}

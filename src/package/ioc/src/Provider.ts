// 提供着provider

// 三个: ClassProvider, ValueProvider,FactoryProvider
import { Token,Type } from "./Token";
import {IforwardRef} from "./forwardRef"

type Factory<T> = (...args:any[])=>T

export interface BaseProvider<T> {
    provide:Token<T> 
}

export interface ClassProvider<T> extends BaseProvider<T>{
    provide:Token<T>
    useClass:Type<T> | IforwardRef<T>
}


export interface ValueProvider<T> extends BaseProvider<T>{
    provide:Token<T>
    useValue:T | IforwardRef<T>
}

export interface FactoryProvider<T> extends BaseProvider<T>{
    provide:Token<T>
    useFactory:Factory<T> | IforwardRef<T>
}

export function isClassProvider<T>(arg:unknown):arg is ClassProvider<T>{
    return (arg as any).useClass !==undefined
}


export function isValueProvider<T>(arg:unknown):arg is ValueProvider<T>{
    return (arg as any).useValue !==undefined
}

export function isFactoryProvider<T>(arg:unknown):arg is FactoryProvider<T>{
    return (arg as any).useFactory !==undefined
}
export function isProvider<T>(arg:unknown):arg is BaseProvider<T>{
    return (arg as any).provide !==undefined
}


export type Provider<T> = ClassProvider<T>|ValueProvider<T>|FactoryProvider<T> 



import "reflect-metadata";
import { CONTROLLER_META_KEY } from "./Constant";
import {IControllerMetate} from "./Interface"

export function getControllerMeta(target: any) {
    let classMeta: IControllerMetate = Reflect.getMetadata(CONTROLLER_META_KEY, target)
    if (!classMeta) {
        classMeta = { prefix: "", routers: {} }
        Reflect.defineMetadata(CONTROLLER_META_KEY, classMeta, target)
    }
    return classMeta
}

export function Controller(prefix?: string) {
    return function (target: any) {
        let meta: IControllerMetate = getControllerMeta(target)
        meta.prefix = prefix
        Reflect.defineMetadata(CONTROLLER_META_KEY, meta, target)
    }
}


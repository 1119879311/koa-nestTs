import "reflect-metadata"
import { INJECTABLE_METADATA_KEY } from "./Constant"

export function Injectable() {

    return function (target: any) {
       
        Reflect.defineMetadata(INJECTABLE_METADATA_KEY, true, target)

        return target
    }
}

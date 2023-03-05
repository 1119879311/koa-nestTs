import { Pipe } from "../routerDecorator/lib/Pipe";
import { createFacroy, isFunction } from "../Util";
import { validate } from "class-validator";
import { IContextOption } from "../routerDecorator/lib/Util";
const typeExInculeds = [
  "String",
  "Function",
  "Array",
  "Number",
  "Date",
  "RegExp",
  "Boolean",
  "Symbol",
  "Object",
  "Null",
  "Undefined",
];

type IValidation = {
  validateError: (...args: any[]) => void; // 错误处理
};

class Validation extends Pipe {
  options: IValidation;
  constructor(options: IValidation) {
    super();
    this.options = options;
  }

  async apply(option: IContextOption) {
    const { getArgs } = option;

    const [args, Iparams] = getArgs(); // [参数, 参数类型]
    for (let index = 0; index < Iparams.length; index++) {
      const item = Iparams[index];
      //console.log("参数：",item.name,Object.prototype.toString.call(item),item,Object.prototype.toString.call(args[index]),args[index])
      if (typeof item == "function" && !typeExInculeds.includes(item.name)) {
        let currentArg = args[index] || {};
        let instance = Reflect.construct(item, args);
        for (const key in currentArg) {
          instance[key] = currentArg[key];
        }
        const verifyRes = await validate(instance);
        if (verifyRes.length > 0) {
          if (isFunction(this.options.validateError)) {
            this.options.validateError(verifyRes);
            break;
          } else {
            let errRes = Object.values(verifyRes[0].constraints);
            throw new Error(errRes[0]);
          }
        }
      }
    }
  }
}

export const ValidationPipe: (options: IValidation) => Pipe =
  createFacroy(Validation);

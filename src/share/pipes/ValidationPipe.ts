import { Pipe ,IContextOption} from "@by/router";
import { createFacroy, isFunction } from "@/utils";
import { validate } from "class-validator";
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

    const args = getArgs(); // [参数, 参数类型]
    for (let index = 0; index < args.length; index++) {
      const { value,type}  = args[index];
      if (typeof type == "function" && !typeExInculeds.includes(type.name)) {
        let instance = Reflect.construct(type, args) as any;
        for (const key in value) {
          instance[key] = value[key];
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

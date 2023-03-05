import "reflect-metadata";
type ItoArray<T> = T extends any ? T[] : never;

type IStrOrNum = ItoArray<string | number>;

let test7: IStrOrNum = [1];
let test1: IStrOrNum = ["st"];

type ItoArrayDist<T> = [T] extends [any] ? T[] : never;

// 'StrOrNumArr' 不再是一个联合类型
type IStrOrNumDist = ItoArrayDist<string | number>;
let test3: IStrOrNumDist = [1, "st"];

type Ifn = (a: number, b: number) => number;

const fn: Ifn = (a, b): number => {
  return a + b;
};

type IfnReturn = ReturnType<typeof fn>;

type Getters<Type> = {
  [Property in keyof Type as `get${Capitalize<
    string & Property
  >}`]: () => Type[Property];
};

interface Person {
  name: string;
  age: number;
  location: string;
  onChage: () => void;
}

type LazyPerson = Getters<Person>;

type PropEventSource<T> = {
  on<Key extends string & keyof T>(
    eventName: `${Key}Changed`,
    callback: (newValue: T[Key]) => void
  ): void;
};
type LowercaseGreeting = "hello, world";
type Greeting = Capitalize<LowercaseGreeting>;

type getFnParam<T> = T extends (...args: infer P) => any ? P : never;
type test4 = getFnParam<typeof fn>;

class Itype {
  id: number;

  name: string;
}

class User {
  // 这里的类型，怎么在运行态获取到这个类Itype
  constructor(data?: any) {
    console.log(data);
  }
  add(data: Itype) {
    console.log(data);
  }
}

const user: User = new User();
user.add({ name: "12", id: 1 });

function SingerInstance<T>(target: any) {
  let instance: any;
  return function (...args: any[]): any {
    if (!instance) {
      instance = new target(...args);
    }
    return instance;
  };
}

const UserSige = SingerInstance(User);

const o1 = UserSige();
const o2 = UserSige();

console.log(o1 === o2);

type IDetorcetor<T> = {
  new (...args: any[]): T;
};

function Graup(...data: IDetorcetor<any>[]): Function {
  return function (instance: Object | Function, methodName?: string) {
    console.log(typeof instance, "---typeof", instance);
    let target = methodName ? instance.constructor : instance;
    let prevData =
      Reflect.getMetadata("GUARD_META_KEY", target, methodName) || [];
    console.log("prevData", prevData, target, methodName);

    Reflect.defineMetadata(
      "GUARD_META_KEY",
      [...prevData, ...data],
      target,
      methodName
    );
    console.log(data, instance.constructor, instance, methodName);
  };
}

function Param(data?: any): Function {
  return function (instace: any, methondName: string, pararmIndex: number) {
    let result: any[] =
      Reflect.getMetadata("PARAM_META_KEY", instace, methondName) || [];

    console.log("Param:", data, instace, methondName, pararmIndex);
  };
}

export function setMetadata(mataKey: any, data: any): Function {
  return function (objectOrFunction: Object, methodName?: string) {
    Reflect.defineMetadata(mataKey, data, objectOrFunction, methodName);
  };
}

function Inject(type: string) {
  return function (target: any) {
    Reflect.defineMetadata(type, true, target);
    return target;
  };
}

const InjectableKey = "INJECTABLE_METADATA_KEY";
const InjectGuardKey = "GUARDKEY";

export const Injectable = () => Inject(InjectableKey);
export const InjectGuard = () => Inject(InjectGuardKey);

@InjectGuard()
abstract class DD {
  abstract very: (ctx: any) => boolean;
  abstract errorHandler: (errro: Error, context: any, next: Function) => void;
}

const AuthGuard = (token?: string) => DD;

class A {}
class D {}
class C {}
class G {}

@Injectable()
class B extends AuthGuard("JWT") {
  errorHandler: (errro: Error, context: any, next: Function) => void;
  add(arg0: number, arg1: number) {
    // throw new Error("Method not implemented.");
  }
  very: (ctx: any) => boolean;
}

// @Graup(G)
// @Graup(A)
// class B extends AuthGuard("dd") {
//   very: (ctx: any) => {};
//   @Graup(D)
//   @Graup(C)
//   add(@Param("a") a: any, @Param("b") b: any) {
//     console.log(1212, a, b, this.constructor);
//   }
// }
console.log("-------------");
console.log("DD", Reflect.getMetadataKeys(DD));

console.log("B", Reflect.getMetadataKeys(B));
console.log(Reflect.getMetadataKeys(B, "add"));
console.log(Reflect.getMetadataKeys(B, "adssd"));

console.log(Reflect.getOwnMetadataKeys(B));
console.log(Reflect.getOwnMetadataKeys(B, "add"));
console.log(Reflect.getOwnMetadataKeys(B, "adssd"));

console.log(Reflect.getMetadata(InjectableKey, B));
console.log(Reflect.getMetadata(InjectGuardKey, B));

console.log(Reflect.getMetadata("GUARD_META_KEY", B));
console.log(Reflect.getMetadata("GUARD_META_KEY", B, "add"));
console.log(Reflect.getMetadata("GUARD_META_KEY", B, "dee"));

new B().add(1, 2);

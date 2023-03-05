import "reflect-metadata";
import { DesignParamtypes } from "./Constant";
import { getInjectParams } from "./Inject";
import { getModuleMeataParams } from "./Module";
import {
  ClassProvider,
  FactoryProvider,
  isClassProvider,
  isFactoryProvider,
  isProvider,
  isValueProvider,
  Provider,
  ValueProvider,
} from "./Provider";
import { getTokenName, InjectToken, Token, Type } from "./Token";
import {
  getInjectConstructParams,
  isController,
  isInjectable,
  isModule,
  setController,
  setInjectable,
} from "./Uitl";

// 先加载所有模块，注册中心依赖注入，中心管理所有依赖实例化，中心管理控制器实例

// 1. 依赖循环问题
// 2. 模块上下级管理依赖问题

export class Container {
  private instances = new Map<Token<any>, any>();
  private providers = new Map<Token<any>, Provider<any>>();
  private controllerInstance = new Map<String | symbol, Array<Object>>();

  init<T>(entryModule: Type<T>) {
    this.bindModule(entryModule);
    this.loadProviders();
  }

  loadProviders() {
    this.providers.forEach((_, key) => this.get(key));
  }
  //正常的三种绑定
  public bind<T>(provider: Provider<T>) {
    //判断是否是ClassProvider 和使用依赖的Injectable
    //判断是否是模块
    if (isClassProvider(provider) && isModule(provider.useClass)) {
      // console.log("模块：",provider.provide,provider)
      this.bindLoadModule(provider);
    } else {
      // console.log("add:provider",provider)
      this.assetInjectableIsClassProvide(provider);
    }
    if (this.providers.get(provider.provide)) return;
    // console.log("set:",provider.provide,provider)
    this.providers.set(provider.provide, provider);
  }
  //模块绑定
  public bindModule<T>(module: Type<T>) {
    if (!isModule(module)) {
      throw new Error(`
            cannot  imports (${getTokenName(module)}) using  (${getTokenName(
        module
      )})，
            ${getTokenName(module)} is not module
          `);
    }
    this.bind({ provide: module, useClass: module });
  }
  private bindLoadModule<T>(provider: ClassProvider<T>) {
    let meataData = getModuleMeataParams(provider.useClass);
    if (!meataData) return;
    this.bindModuleLoadProviders(meataData.providers || []);
    this.bindModuleLoadControllers(meataData.controllers || []);
    this.bindModuleLoadImports(meataData.imports || []);
  }
  private bindModuleLoadImports<T>(imports: Array<Type<T>>) {
    if (Array.isArray(imports)) {
      imports.forEach((itme) => this.bindModule(itme));
    }
  }
  private bindModuleLoadProviders<T>(providers: Array<Type<T> | Provider<T>>) {
    if (Array.isArray(providers)) {
      providers.forEach((itme) => {
        if (isProvider(itme)) {
          this.bind(itme);
        } else {
          this.bind({ provide: itme, useClass: itme });
        }
      });
    }
  }

  private bindModuleLoadControllers<T>(providers: Type<T>[]) {
    if (Array.isArray(providers)) {
      providers.forEach((itme) => {
        // Reflect.defineMetadata("Controller",true,itme)
        setController(itme); //标志位控制器
        setInjectable(itme); //标志为可注入依赖
        this.bind({ provide: itme, useClass: itme });
        // this.get(itme); //直接获取
      });
    }
  }

  public get<T>(type: Token<T>) {
    let instance = this.instances.get(type);
    if (instance) {
      return instance;
    }
    let provider = this.providers.get(type);
    if (provider === undefined && !(type instanceof InjectToken)) {
      provider = { provide: type, useClass: type };
      // console.log("inwith:", type, provider);
      this.assetInjectableIsClassProvide(provider);
    }
    // console.log("get:", type, provider);
    return this.injectWithProvider(type, provider);
  }

  public getControllerInstance() {
    return this.controllerInstance;
  }
  private injectWithProvider<T>(type: Token<T>, provider: Provider<any>) {
    if (provider === undefined) {
      throw new Error(` No provider for type ${getTokenName(type)}`);
    }
    if (isClassProvider(provider)) {
      return this.injectWidthClassProvider(provider);
    } else if (isValueProvider(provider)) {
      return this.injectWithValueProvider(provider);
    } else if (isFactoryProvider(provider)) {
      return this.injectWidthFactoryProvider(provider);
    } else {
      throw new Error(
        ` No  belong for provider for type ${getTokenName(type)}`
      );
    }
  }
  // 工厂函数
  private injectWidthFactoryProvider(provider: FactoryProvider<unknown>) {
    return provider.useFactory();
  }
  // 值
  private injectWithValueProvider(provider: ValueProvider<any>) {
    return provider.useValue;
  }
  // 类,需要获取构造函数的参数，返回实例
  private injectWidthClassProvider(provider: ClassProvider<any>) {
    let target = provider.useClass;

    let args = this.getInjectConstructParams(target);

    let instance = Reflect.construct(target, args);
    this.instances.set(target, instance);
    //判断是否是控制器的实例化
    if (isController(target)) {
      this.controllerInstance.set(Symbol(target.name), instance);
    }
    return instance;
  }
  private getInjectConstructParams<T>(target: Type<T>): any[] {
    let args = getInjectConstructParams(target);

    return args.map((itme, index) => {
      if (itme === undefined) {
        throw new Error(`
                    Injection error.  construct params is not undefined args [${itme}] in index [${index}]
                `);
      }
      let injectMedate = getInjectParams(target, index); //判断是不是inject 注入的

      let paramsToken = injectMedate == undefined ? itme : injectMedate; //如果不是inject 注入就是其他类型的注入
      //去依赖中心找对应的参数实例
      let instance = this.instances.get(paramsToken);
      if (instance) {
        return instance;
      }
      let provider = this.providers.get(paramsToken);
      // console.log("--provider", paramsToken, provider, this.providers);
      return this.injectWithProvider(paramsToken, provider);
    });
  }

  private assetInjectableIsClassProvide<T>(provider: Provider<T>) {
    if (isClassProvider(provider) && !isInjectable(provider.useClass)) {
      throw new Error(`
              cannot  Provider (${getTokenName(
                provider.provide
              )}) using useClass (${getTokenName(provider.useClass)})，
              ${getTokenName(provider.useClass)} is not injectable
            `);
    }
  }
}

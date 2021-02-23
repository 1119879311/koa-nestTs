"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const Constant_1 = require("./Constant");
const Inject_1 = require("./Inject");
const Module_1 = require("./Module");
const Provider_1 = require("./Provider");
const Token_1 = require("./Token");
const Uitl_1 = require("./Uitl");
class Container {
    constructor() {
        this.instances = new Map();
        this.providers = new Map();
        this.routers = new Map();
        this.controllerInstance = new Map();
    }
    //正常的三种绑定
    bind(provider) {
        //判断是否是ClassProvider 和使用依赖的Injectable
        //判断是否是模块
        if (Provider_1.isClassProvider(provider) && Uitl_1.isModule(provider.useClass)) {
            console.log("模块：", provider.provide, provider);
            this.bindLoadModule(provider);
        }
        else {
            // console.log("add:provider",provider)
            this.assetInjectableIsClassProvide(provider);
        }
        // console.log("set:",provider.provide,provider)
        this.providers.set(provider.provide, provider);
    }
    //模块绑定
    bindModule(module) {
        if (!Uitl_1.isModule(module)) {
            throw new Error(`
            cannot  imports (${Token_1.getTokenName(module)}) using  (${Token_1.getTokenName(module)})，
            ${Token_1.getTokenName(module)} is not module
          `);
        }
        this.bind({ provide: module, useClass: module });
    }
    bindLoadModule(provider) {
        let meataData = Module_1.getModuleMeataParams(provider.useClass);
        if (!meataData)
            return;
        this.bindModuleLoadProviders(meataData.providers || []);
        this.bindModuleLoadControllers(meataData.controllers || []);
        this.bindModuleLoadImports(meataData.imports || []);
    }
    bindModuleLoadImports(imports) {
        if (Array.isArray(imports)) {
            imports.forEach(itme => this.bindModule(itme));
        }
    }
    bindModuleLoadProviders(providers) {
        if (Array.isArray(providers)) {
            providers.forEach((itme) => {
                if (Provider_1.isProvider(itme)) {
                    this.bind(itme);
                }
                else {
                    this.bind({ provide: itme, useClass: itme });
                }
            });
        }
    }
    bindModuleLoadControllers(providers) {
        if (Array.isArray(providers)) {
            providers.forEach(itme => {
                // Reflect.defineMetadata("Controller",true,itme)
                Uitl_1.setController(itme); //标志位控制器
                Uitl_1.setInjectable(itme); //标志为可注入依赖
                this.bind({ provide: itme, useClass: itme });
                this.get(itme); //直接获取
            });
        }
    }
    get(type) {
        let instance = this.instances.get(type);
        if (instance) {
            return instance;
        }
        let provider = this.providers.get(type);
        if (provider === undefined && !(type instanceof Token_1.InjectToken)) {
            provider = { provide: type, useClass: type };
            console.log("inwith:", type, provider);
            this.assetInjectableIsClassProvide(provider);
        }
        // console.log("get:",type,provider)
        return this.injectWithProvider(type, provider);
    }
    getRouter() {
        return this.routers;
    }
    getControllerInstance() {
        return this.controllerInstance;
    }
    injectWithProvider(type, provider) {
        if (provider === undefined) {
            throw new Error(` No provider for type ${Token_1.getTokenName(type)}`);
        }
        if (Provider_1.isClassProvider(provider)) {
            return this.injectWidthClassProvider(provider);
        }
        else if (Provider_1.isValueProvider(provider)) {
            return this.injectWithValueProvider(provider);
        }
        else if (Provider_1.isFactoryProvider(provider)) {
            return this.injectWidthFactoryProvider(provider);
        }
        else {
            throw new Error(` No  belong for provider for type ${Token_1.getTokenName(type)}`);
        }
    }
    // 工厂函数
    injectWidthFactoryProvider(provider) {
        return provider.useFactory();
    }
    // 值
    injectWithValueProvider(provider) {
        return provider.useValue;
    }
    // 类,需要获取构造函数的参数，返回实例
    injectWidthClassProvider(provider) {
        let target = provider.useClass;
        let args = this.getInjectConstructParams(target);
        // console.log("实例化:args:",provider,args)
        let instance = Reflect.construct(target, args);
        this.instances.set(target, instance);
        //判断是否是控制器的实例化
        if (Uitl_1.isController(target)) {
            this.controllerInstance.set(target.name, instance);
        }
        return instance;
    }
    getInjectConstructParams(target) {
        let args = Reflect.getMetadata(Constant_1.DesignParamtypes, target) || [];
        return args.map((itme, index) => {
            if (itme === undefined) {
                throw new Error(`
                    Injection error.  construct params is not undefined args [${itme}] in index [${index}]
                `);
            }
            let injectMedate = Inject_1.getInjectParams(target, index); //判断是不是inject 注入的
            let paramsToken = injectMedate == undefined ? itme : injectMedate; //如果不是inject 注入就是其他类型的注入
            //去依赖中心找对应的参数实例
            let instance = this.instances.get(paramsToken);
            if (instance) {
                return instance;
            }
            let provider = this.providers.get(paramsToken);
            return this.injectWithProvider(paramsToken, provider);
        });
    }
    assetInjectableIsClassProvide(provider) {
        if (Provider_1.isClassProvider(provider) && !Uitl_1.isInjectable(provider.useClass)) {
            throw new Error(`
              cannot  Provider (${Token_1.getTokenName(provider.provide)}) using useClass (${Token_1.getTokenName(provider.useClass)})，
              ${Token_1.getTokenName(provider.useClass)} is not injectable
            `);
        }
    }
}
exports.Container = Container;

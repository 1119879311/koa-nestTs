
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
  isFun,
  isInjectable,
  isModule,
  isNotBaseType,
  isObj,
  setController,
  setInjectable,
} from "./Uitl";
import { IforwardRef, isforwardRef } from './forwardRef';


// 单例的


export class ContainerBase{
  protected instances = new Map<Token<any>, any>();
  protected instancesforwardMap = new Map<Token<any>,Array<Object>>(); // 暂存依赖缓存的对象
  protected providers = new Map<Token<any>, Provider<any>>();
  
  public getInstances(){
    return this.instances
  }
  public addProvider<T=any>(provider:Type<T> | Provider<T> | IforwardRef<T> ){
    if(isProvider(provider)){
      this.bind(provider)
    }else if(isforwardRef(provider)){
       this.handleProviderForwardRef(provider)
    }else{ 
       this.bind({ provide: provider, useClass: provider });
    }
  }
  // 批量添加 注入
  public addProviders<T=any>(providers:Array<Type<T> | Provider<T> | IforwardRef<T>> ){
    if(Array.isArray(providers)){
      providers.forEach( provider=> this.addProvider(provider))
    }
  }
  // 收集 循环注入的处理
  /**
   * 
   * @param providerIforwardRef:  IforwardRef(()=> 结果)
   * @param provide 
   */
  protected handleProviderForwardRef<T>(providerIforwardRef: IforwardRef<T>,provide?:Token<T>){
     // 肯定是 Iforward
    if(isFun(providerIforwardRef)){
      const resRroviderValue = providerIforwardRef() as Function ; //IforwardRef(()=> 结果) === 结果
      const token = provide||resRroviderValue as Token<T>
      if(isFun(resRroviderValue) && isNotBaseType(resRroviderValue.name) ){ // 如果是一个类，要进行实例化
       // 创建依赖循环的缓存数据
      //  console.log("-----------------sfd",token,resRroviderValue)
      this.assetClassProvideEqual(token,resRroviderValue as Type<any>)
      // if( isFun(token) && isFun(resRroviderValue) && token !==resRroviderValue){
      //   throw new Error(`When the type of provider is ClassProvider and the type of provider and useClass is Class, the provide ${token.name} and useClass ${resRroviderValue.name} must be equal ,but the results are not equal`)
      // }
       this.instancesforwardMap.set(token,  Object.create(resRroviderValue.prototype));
      }else{  // 否则就存在实例中心
        this.instances.set(token,resRroviderValue)
      }
   }

  }


  // 单个绑定注入  三种判定方式
  /**
   * 
   * @param provider:Provider 
   * {provide:"",useClass:}
   * {provide:"",useFactory:}
   * {provide:"",useValue:}
   * 
   */

  public bind<T>(provider:Provider<T>){
    if(!isProvider(provider)){
      throw new Error("参数不合法")
    }
    let providerValue  = this.getProviderForwardRef(provider) 
    // 判定 是否 模块
    if( isforwardRef(providerValue)){
       this.handleProviderForwardRef(providerValue,provider.provide)
    }else{

     
      if(isClassProvider(provider)){
       this.assetClassProvideEqual(provider.provide,provider.useClass as Type<any>)
      }
    
      this.providers.set(provider.provide,provider)
    }
  }
  

  //获取provider 的值
  protected getProviderForwardRef<T=any>(provider:Provider<T>) : IforwardRef<any>  {
    if(isClassProvider(provider)){
      return provider.useClass as IforwardRef<any>
    }
    if(isFactoryProvider(provider)){
      return provider.useFactory as IforwardRef<any>
    }

    if(isValueProvider(provider)){
      return provider.useValue as IforwardRef<any>
    }
  }
  initLoading(){
    this.loadProviders()
    this.LoadForwardProviders()
    this.providers.clear()
    this.instancesforwardMap.clear()
  }
    // 加载 注入,开始实例化
  protected loadProviders() {
      this.providers.forEach((_, key) => this.get(key));
  }
  // 加载 实例
  protected LoadForwardProviders(){
    this.instancesforwardMap.forEach((value,key:Type<any>)=>{
      // console.log("instancesforwardMap-----1212",value,key ,value.constructor)
      // 获取原来的实例的参数
      let ins:Type<any> |undefined;
      if(isFun(key) && isNotBaseType(key.name)){
        ins = key;
      }else if(isObj(value) && value.constructor&& isNotBaseType(value.constructor.name)){
        ins = value.constructor as Type<any>
      }else{
        const errmsg = ` No provider for type ${getTokenName(key)}`
        throw new Error(errmsg)
      }
      // console.log("instancesforwardMap-ins",ins)
      this.assetInjectableIsClassProvide({provide:key,useClass:ins});
      let arg = this.getInjectConstructParams(ins)
      Object.assign(value,new ins(...arg))
      this.instances.set(key,value)
   })
  }

  public get<T>(type: Token<T>) {
    let instance = this.instances.get(type);
    if (instance) {
      return instance;
    }
    let provider = this.providers.get(type)
    // console.log("provider",type,provider)
    if(provider && (provider as ClassProvider<any>).useClass){
      this.assetInjectableIsClassProvide(provider as ClassProvider<any>);
    }

    let result =  this.injectWithProvider(type, provider);
    this.instances.set(type,result)
    return result
  }
  /**
   *  获取注解的值，三种类型
   * @param type 
   * @param provider 
   * @returns 
   */
  protected injectWithProvider<T>(type: Token<T>, provider: Provider<T>) {
   
    if (provider === undefined) {
      const errmsg = ` No provider for type ${getTokenName(type)}`
      throw new Error(errmsg);
    }

    if (isClassProvider(provider)) {
      return this.injectWidthClassProvider(provider);
    } else if (isValueProvider(provider)) {
      return provider.useValue;
    } else if (isFactoryProvider(provider)) {
       return provider.useFactory()
    } else {
      throw new Error(
        ` No  belong for provider for type ${getTokenName(type)}`
      );
    }
  }
  protected injectWidthClassProvider<T>(provider: ClassProvider<T>) {
    let target = provider.useClass;// 取得
   
    if(!isforwardRef(target)){
      let parameterMeta = this.getInjectConstructParams(target) || [];
      // console.log("parameterMeta",parameterMeta,target)
      let instance = Reflect.construct(target, parameterMeta);
      return instance
    }
  }

  //去获取构造函数的参数
  protected getInjectConstructParams<T>(target: Type<T>): any[] {
   
    const InjectParams = getInjectParams(target);
    // console.log("InjectParams",InjectParams)
    // console.log("args",target,getInjectConstructParams(target))

    let args = getInjectConstructParams(target) ||  Object.values(InjectParams).reverse();

    // console.log("args----",getInjectConstructParams(target),'----',target,args,InjectParams)
    return args.map((itme: any,index:number) => {
      // 判定
      let injectMedate = InjectParams[index]; //判断是不是inject 注入的

      let paramsToken = injectMedate == undefined ? itme : injectMedate; //如果不是inject 注入就是其他类型的注入
      //去依赖中心找对应的参数实例
      let instance = this.instances.get(paramsToken);
      if (instance) {
        return instance;
      }
      // 参数类型，有可能是forwarkRef
      if(isforwardRef(paramsToken) && isFun(paramsToken)){ // 如果是 循环依赖，从实例种取值
        paramsToken = paramsToken()
      }
      let instanceforward = this.instancesforwardMap.get(paramsToken)
      // console.log("instanceforward", paramsToken, instanceforward, this.instancesforwardMap);
      if(instanceforward){
        return instanceforward
      }
      if(paramsToken===undefined){
        return paramsToken
      }
    
      let provider = this.providers.get(paramsToken);
      // console.log("getInjectConstructParams--provider", paramsToken, provider, this.providers);
      return this.injectWithProvider(paramsToken, provider);
    });
  }

    // Provider  的是类型是 ClassProvider  ,必须是 用Injectable 注解
    protected assetInjectableIsClassProvide<T>(provider: ClassProvider<T>) {
        if (isClassProvider(provider) && !(provider.provide  instanceof InjectToken)  && !isInjectable(provider.useClass)) {
          let errmsg = `cannot  Provider (${getTokenName(
            provider.provide
          )}) using useClass (${getTokenName(provider.useClass?.name)})，
          ${getTokenName(provider.useClass?.name)} is not injectable
       `
          throw new Error(errmsg);
        }
  }

   // Provider  的是类型是 ClassProvider ,且 provide 和useClass 的类型都是class 的时候， provide 和 useClass必须是相等的
   protected assetClassProvideEqual(provide:any,useClass:Type<any>){
    if( isFun(provide) && isFun(useClass) && provide !==useClass){
      throw new Error(`When the type of provider is ClassProvider and the type of provider and useClass is Class, the provide ${provide.name} and useClass ${useClass.name} must be equal ,but the results are not equal`)
    }
  }

}


export class Container<K> extends ContainerBase{
  private controllerInstance:Array<any> = [];
  private modulesInstance:Array<any> = [];
  constructor(entryModule?: Type<K>){
     super()
     entryModule&&this.init(entryModule)
  }
  init<T>(entryModule: Type<T>) {
    this.bindModule(entryModule);
    this.initLoading()
    this.filterTypeInstance()
  }
  protected filterTypeInstance(){
     this.instances.forEach((value:Type<any>,key)=>{
      // console.log("filterTypeInstance",key,value,isFun(key) && isNotBaseType(key.name), isController(key))
      if(isFun(key) && isNotBaseType(key.name)){
         isController(key) &&  this.controllerInstance.push(value)
         isModule(key) && this.modulesInstance.push(value)
      }
     })
  }

  getControllerInstance(){
    return this.controllerInstance;
  }
  getModulesInstance(){
    return this.modulesInstance;
  }

    //模块绑定
  public bindModule<T>(module: Type<T>) {
    if (!isModule(module)) {
      throw new Error(` cannot  imports [${getTokenName(module)}] using  [${getTokenName( module )}]， ${getTokenName(module)} is not module `);
    }
    const provider = { provide: module, useClass: module }
    setInjectable(module); //标志为可注入依赖
    this.bind(provider);
    this.bindLoadModule(provider);
  }
  private bindLoadModule<T>(provider: ClassProvider<T>) {
        let meataData = getModuleMeataParams(provider.useClass);
        if (!meataData) return;
        this.addProviders(meataData.providers || [])
        this.bindModuleLoadControllers(meataData.controllers || []);
        this.bindModuleLoadImports(meataData.imports || []);
  }

  private bindModuleLoadImports<T>(imports: Array<Type<T>>) {
    if (Array.isArray(imports)) {
      imports.forEach((itme) => this.bindModule(itme));
    }
  }
  private bindModuleLoadControllers<T>(providers: Type<T>[]) {
    if (Array.isArray(providers)) {
      providers.forEach((itme) => {
        setController(itme); //标志位控制器
        setInjectable(itme); //标志为可注入依赖
        this.bind({ provide: itme, useClass: itme });
      });
    }
  }

}


import "reflect-metadata";
import { InjectKey, InjectableKey, Provider, Type, isValueProvider,isInjectable, DesignParamtypes, isClassProvider } from "./util";

/**
 * 这是一个装饰器
 * @Inject 是构造函数参数的注入器
 * @param token 
 * @returns 
 */
export function Inject(token:any) {
    return function (target: any, perperity: string, index: number) {
      Reflect.defineMetadata( InjectKey, token, target, `index-${index}`);
    };
  }
  
/**
 * 这是一个类装饰器
 * @Injectable 标注该类是可以交给容器进行实例化,控制反转的
 * @returns 
 */
export const Injectable = () => {
  return function (target: any) {
    Reflect.defineMetadata(InjectableKey, true, target);
  };
};

/**
 * 控制反转（Ioc）和依赖注入（DI）
 * 一个依赖注入的容器
 */
export class Container{

    /**
     * 缓存已经完成提供者在容器中实例化的创建
     */
    private instanceMap=new Map<string|Type<any>, any>();
    /**
     * 缓存要加入的依赖类(提供者)
     */
    private providerMap = new Map<string|Type<any>, Type<any>>();

    constructor(providers:Array<Provider<any>>=[]){
        this.init(providers)
    }
    /**
     * 初始化
     * @param providers 
     * @returns 
     */
    private init(providers:Array<Provider<any>>=[]){
        providers.forEach(item=>this.add(item))
        this.loading()
        return this
       
    }

      /**
     * 获取构造函数的参数
     */
      private getConstructorParam<T>(target:Type<T>){
        let args = Reflect.getMetadata(DesignParamtypes, target) || [] 
        return args.map((item: any,index:number)=>{
            const injectMedate = Reflect.getMetadata(InjectKey, target, `index-${index}`);
            //如果不是inject注入就是其他类型的注入,要考虑原始类型： [Function: String]、[Function: Number]...
            let paramsToken = injectMedate == undefined ? item : injectMedate; 
            if(paramsToken===undefined) return paramsToken
            return this.get(paramsToken)
        })
    }
    /**
     * 对容器中 类(提供者)实例化
     * @param provider 
     * @returns 
     */
    private injectWidthClassProvider(key:string|Type<any>,target:Type<any>) {
        
        let args = this.getConstructorParam(target);
        let instance = Reflect.construct(target, args);
        this.instanceMap.set(key, instance);
        return instance;
      }
 
    /**
     * 根据 注入容器的 类型获取对应的数据
     * @param key 
     * @returns 
     */

    /**
     * 加载容器中的对象(提供者)
     * @returns 
     */
    public loading(){
        this.providerMap.forEach((_,key)=>this.get(key))
        this.providerMap.clear()
        return this
    }

    /**
     * 添加要创建实例化的对象(提供者)
     * @param value 
     */
    public add<T>(value:Provider<T>){
       
        if(isValueProvider(value)){
            this.instanceMap.set(value.provide,value.useValue)
        }else if(isInjectable(value)){
            this.providerMap.set(value as Type<T>,value as Type<T>)
        }else if(isClassProvider(value)){
            this.providerMap.set(value.provide,value.useClass)
        }
        return this
    }
  

    public get<T>(key:string|Type<T>){
        
        if (this.instanceMap.has(key)) {
          return this.instanceMap.get(key);;
        }
        if(this.providerMap.has(key) && isInjectable(this.providerMap.get(key))){
            return this.injectWidthClassProvider(key,this.providerMap.get(key))

        }
      
        const errlog = `cannot  Provider ${key} is not injectable`
        throw new Error(errlog)
        
    }
    /**
     * 获取所有的实例
     * @returns 
     */
    public getInstance(){
        return this.instanceMap;
    }
}




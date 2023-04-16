## 用typescript 实现一个精简版的IOC 

分两部分: 概念篇和实践篇

### 概念： 
> Ioc: 控制反转, Inversion of Control的缩写，开发者不需要关心对象的过程，交给容器处理
>  Di:  依赖注入，Dependency Injection的缩写，容器创建对象实例时，同时为这个对象注入它所依赖的属性 

 1、本质：这是一种思想,依赖注入（DI）和控制反转（IoC）是从不同的角度描述的同一件事情，就是指通过引入IoC容器，利用依赖关系注入的方式，实现对象之间的解耦

 2、举例：你是一名租客要租房子，IOC就相当于房屋中介，他负责管理所有的房源，他给你提供，你要找的所有已经登记的房源对象的信息。你如果需要什么就会提供什么。

 3、 代表库：
 -  inversify
 -  nestjs(nodejs框架)
 -  Angular(前端框架)
----

### 实践：
 前提: 需要安装 reflect-metadata 依赖库
 核心: 两个装饰器,一个容器,
 - Inject:  是装饰器,是构造函数参数的注入器
 - Injectable : 是装饰器, 用于注入相关类构造函数的依赖项的元数据
 - Container: 管理对象实例化的容器

1、先声明一些常量、类型和工具方法

>  util.ts
```typescript

/*************** 常量声明************************* */

// 声明 依赖注入(DI)的 key
export const InjectKey = "INJECT_METADATA_KEY"; 


// 声明要将类进行控制反转的 key
export const InjectableKey = "INJECTABLE_METADATA_KEY"; 


// 内置的获取构造函数的参数
export const DesignParamtypes = "design:paramtypes";


/******************ts类型声明********************** */

/**
 * 类声明
 */
export interface Type<T> extends Function {
    new (...args:any[]):T
}

export interface ValueProvider<T> {
    provide:string|Type<T>
    useValue:any
}
export interface ClassProvider<T> {
    provide:string|Type<T>
    useClass:Type<T>
}

/**
 * 三种类型的写法
 */
export type Provider<T> = Type<T>|ValueProvider<T> | ClassProvider<T>


/*************** 工具方法************************* */
/**
 * 判定是控制反转的提供者(类)
 * @param target 
 * @returns 
 */
export const isInjectable = (target:any)=>{
    return typeof target ==="function" && Reflect.getMetadata(InjectableKey, target)
}

/**
 * 判断是否是 { provide,useClass }类型的写法
 * @param arg 
 * @returns 
 */
export function isClassProvider<T>(arg:unknown):arg is ClassProvider<T>{
    return (arg as any).useClass !==undefined
}

/**
 *判断是否是 { provide,useValue } 类型的写法
 * @param arg 
 * @returns 
 */
export function isValueProvider<T>(arg:unknown):arg is ValueProvider<T>{
    return (arg as any).useValue !==undefined
}

```

2、Inject 实现
``` typescript
/**
 * 这是一个装饰器
 * @Inject 是构造函数参数的注入器
 * @param token 
 * @returns 
 */
export function Inject(token: any) {
    return function (target: any, perperity: string, index: number) {
      Reflect.defineMetadata( InjectKey, token, target, `index-${index}`);
    };
  }

```
3、Injectable 实现
``` typescript
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
```
4、Container 实现
``` typescript

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

```

5、 测试用法
``` typescript 

@Injectable()
class A{
    constructor(@Inject("api") private api:string,/** b:number **/){
        console.log("----实例化A:")
        console.log("a-api",this.api)
     }
}

@Injectable()
class B{
     constructor( @Inject("AA") private a:A, @Inject("api") private api:string){
        console.log("----实例化B:")
        console.log("B:insA",this.a)
        console.log("B:api",this.api)

     }
}
@Injectable()
class C{
     constructor(private b:B,@Inject("api") private api:string){
        console.log("----实例化C:")
        console.log("C:insB",this.b)
        console.log("C:api",this.api)
     }
}

let contaner = new Container(
    [
        C,B,
        {provide:"AA",useClass:A},
        {provide:"api",useValue:123}
    ])

contaner.add({provide:'a',useValue:"12345"}).loading()
/**
 * log: 
 *  ----实例化A:
    a-api 123
    ----实例化B:
    B:insA A { api: 123 }
    B:api 123
    ----实例化C:
    C:insB B { a: A { api: 123 }, api: 123 }
    C:api 123
    contaner: Container {
    instanceMap: Map(5) {
        'api' => 123,
        'AA' => A { api: 123 },
        [class B] => B { a: [A], api: 123 },
        [class C] => C { b: [B], api: 123 },
        'a' => '12345'
    },
    providerMap: Map(0) {}
    }
 */
console.log("contaner:",contaner)

```

-----
总结：

1、能初步了解关于 IOC的一些知识

2、通过学习用ts 实现一个ioc的小dome，核心是能通过容器能把对象的实例化 和对象的参数注入交给容器处理 

3、认识到有关于ioc的一些npm库


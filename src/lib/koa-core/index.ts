

import {Container,Type} from "../ts-ioc"
import Koa from "koa"
import koaRouter from "koa-router"
import { ResigerRouters } from "../koa-router-decorator"


interface IKoaNestOption {
    Irouter:koaRouter.IRouterOptions,
    [key:string]:any
}

export class KoaNestTs<T> {

    private iocInstance:Container<T>

    private koaInstance:Koa

    private routerInstance:koaRouter

    private middleWareQuence: Array<Koa.Middleware> = [];


    constructor(appModule:Type<T>, options:IKoaNestOption){
        const {Irouter} = options || {}
        this.iocInstance = new Container(appModule)
        this.routerInstance = new koaRouter(Irouter)
        this.koaInstance = new Koa()
        this.init()

    }

   

    // 加载路由
    private loadRoutes() {
        const ctrInstance = this.iocInstance.getControllerInstance();
        [...ctrInstance.values()].forEach((itme) =>
          ResigerRouters(
            this.koaInstance,
            itme,
            {
                midwares:[],
                golbalGuards:[] ,
                pipesQuence:[] 
            
            }
          )
        );

        this.koaInstance.use(this.routerInstance.routes());
    }
    public getKoa() {
        return this.koaInstance
    }
    public getRouter() {
        return this.routerInstance
    }

    public getIoc() {
        return this.iocInstance;
    }
    
     
    //添加全局中间件
    public use(...middleware: Array<Koa.Middleware>) {
        this.middleWareQuence = [...this.middleWareQuence, ...middleware];
    }
    // 监听错误响应
    appError() {
        this.koaInstance.on("error", this.httpExceptionFilter);
    }

     // 错误处理
    private httpExceptionFilter =  async (error:Error,ctx:Koa.DefaultContext)=>{
        ctx.body =  {message:error.message?error.message:error,status:false,success:false,path: ctx.url,}
    }

    //成功响应处理
    private httpResponseInterceptor = async (ctx:Koa.DefaultContext,next: Function)=>{
        if (ctx.response.is("text/plain") || ctx.response.is("json")) {
        
            ctx.body =  { timestamp: new Date(), code: 200, data: ctx.body, status: true, message: "success"};
        }
    }

    // 设置第一个中间，可以捕获全局响应和错误处理
    private setFirstMiddleware=()=>{
        return   async (ctx: Koa.DefaultContext, next: Function) => {
            try {
              await next();
              this.httpResponseInterceptor(ctx,next)
            } catch (error) {
              ctx.app.emit("error", error, ctx);
            }
          };
      }
      init(){

        // 加载全局中间件
        this.koaInstance.use(this.setFirstMiddleware())
        this.middleWareQuence.forEach((middleware:Koa.Middleware)=>this.koaInstance.use(middleware) )
        // 加载路由
        this.loadRoutes()
        this.appError()
     }
      listen(port: number, host?: string | Function, callback?: Function) {
        this.init();
        if (typeof host == "function") {
          callback = host;
          host = "0.0.0.0";
        }
        this.koaInstance.listen(port, host, callback && callback());
      }
      public static create<T>(appModule: Type<T>, option?: IKoaNestOption) {
        return new this(appModule, option);
      }

      

}
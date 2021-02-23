
import { Container, Type } from "./Ioc"
import Koa from "koa"
import KoaRouter from 'koa-router';
import { IGuardFn, ResigerRouters } from "./routerDecorator";
import { HttpExceptionFilter, IExceptionsFilter } from "./Filter/http.exceptions.filter";
import { httpResponseInterceptor, IResponseInterceptor } from "./Interceptor/http.response.interceptor";

interface KoaNestTsOpt {

}

export class KoaNestTs<T>{
    private koaApp: Koa
    private koaRouter: KoaRouter
    private Ioc: Container
    private middleWareQuence: Array<Koa.Middleware> = []
    private guardQuence:Array<IGuardFn> =[]
    private exceptionsFilterQuence: Array<IExceptionsFilter> = [HttpExceptionFilter]
    private responseInterceptorQuence: Array<IResponseInterceptor> = [httpResponseInterceptor]

    constructor(appModule: Type<T>, option?: KoaNestTsOpt) {
        this.Ioc = new Container()
        this.Ioc.bindModule(appModule)
        this.koaApp = new Koa()
        this.koaRouter = new KoaRouter()

    }
    private loadRoutes() {
      
        const ctrInstance = this.Ioc.getControllerInstance();
        [...ctrInstance.values()].forEach(itme=>ResigerRouters(this.koaRouter, itme,[],this.guardQuence));
        this.koaApp.use(this.koaRouter.routes())
    }
    public getKoa() {
        return this.koaApp
    }
    public getRouter() {
        return this.koaRouter
    }

    public getIoc() {
        return this.Ioc
    }
    public setGlobalPrefix(prefix: string) {
        this.koaRouter.prefix(prefix)
    }

    //添加全局中间件
    public use(...fn: Array<Koa.Middleware>) {
        this.middleWareQuence = [...this.middleWareQuence,...fn]
    }
    //添加全局守卫
    public setGlobalGuard(...fn:Array<IGuardFn>){
        this.guardQuence = [...this.guardQuence,...fn]
    }

    // 添加全局响应拦截器
    public setGlobalResponseInterceptor(...fn: Array<IResponseInterceptor>) { 
        this.responseInterceptorQuence = [...this.responseInterceptorQuence,...fn]
    }

    //添加全局异常拦截器
    public setGlobalExceptionsFilter(...fn: Array<IExceptionsFilter>) {
        this.exceptionsFilterQuence = [...this.exceptionsFilterQuence,...fn]
    }
    private setfirstMiddlWare() {
        const firstMiddlWare = async (ctx: Koa.DefaultContext, next: Function) => {
            try {
                await next()
            } catch (error) {
                ctx.app.emit('error', error, ctx);
            }
        }
        const responseInterceptorMiddlWare = async (ctx: Koa.DefaultContext, next: Function) => {
            await next()
            this.responseInterceptorQuence.forEach(itme=>itme(ctx))
        }
        this.middleWareQuence.push(firstMiddlWare)
        this.middleWareQuence.push(responseInterceptorMiddlWare)
    }
    init() {
        this.setfirstMiddlWare();
        this.middleWareQuence.forEach(itme => this.koaApp.use(itme))
        this.loadRoutes()
        this.appError();
    }
    appError(){
        this.koaApp.on("error",(err,ctx)=> this.exceptionsFilterQuence.forEach(itme=>itme(ctx,err)))
    }
    listen(port: number, host?: string | Function, callback?: Function) {
        this.init()
        if (typeof host == "function") {
            callback = host;
            host = "0.0.0.0"
        }
        this.koaApp.listen(port, host, callback && callback())
    }
    public static create<T>(appModule: Type<T>, option?: KoaNestTsOpt) {
        return new KoaNestTs(appModule, option)
    }

}






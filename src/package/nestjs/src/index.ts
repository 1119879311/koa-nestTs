import { Container, Type } from '@by/ioc';
import Koa from 'koa';
import koaRouter from 'koa-router';
import { Pipe, ResigerRouters, IGuard } from '@by/router';
import { HttpExceptionFilter, IExceptionsFilter } from './exception-filters/http-exception-filter';
export * from './Logger';
export * from './exception-filters/http-exceptions';
export type IResponseInterceptor = (ctx: Koa.DefaultContext) => unknown;
interface IKoaNestOption {
  prefix?: string;
  routerOptions?: koaRouter.IRouterOptions;
  [key: string]: any;
}

export class KoaNestTs<T> {
  private iocInstance: Container<T>; // ioc 容器实例

  private koaInstance: Koa; // koa 实例

  private routerInstance: koaRouter; // 路由实例

  private middleWareQuence: Array<Koa.Middleware> = []; // 全局中间件

  private pipeQuence: Array<Pipe> = []; // 全局管道

  private guardQuence: Array<IGuard> = []; // 全局守卫

  private exceptionsFilterQuence: Array<IExceptionsFilter> = [HttpExceptionFilter]; // 全局异常拦截器(中间件)

  private responseInterceptorQuence: Array<IResponseInterceptor> = []; // 全局响应拦截器(中间件)

  constructor(appModule: Type<T>, options: IKoaNestOption = {}) {
    const { routerOptions = {} } = options || {};
    this.iocInstance = new Container(appModule);
    this.routerInstance = new koaRouter({ ...routerOptions, prefix: options.prefix });
    this.koaInstance = new Koa();
  }
  private init() {
    this.appError();
    // 加载全局中间件
    this.koaInstance.use(this.setFirstMiddleware());
    this.middleWareQuence.forEach((middleware: Koa.Middleware) => this.koaInstance.use(middleware));
    // 加载路由
    this.loadRoutes();
  }

  // 设置第一个中间，可以捕获全局响应和错误处理
  private setFirstMiddleware = () => {
    return async (ctx: Koa.DefaultContext, next: Function) => {
      try {
        ctx.requestId = Math.random();
        await next();
        this.responseInterceptorQuence.forEach((itme) => itme(ctx));
      } catch (error) {
        ctx.app.emit('error', error, ctx);
      }
    };
  };
  // 加载路由
  private loadRoutes() {
    const ctrInstance = this.iocInstance.getControllerInstance();
    ctrInstance.forEach((itme) =>
      ResigerRouters(this.routerInstance, itme, {
        guards: this.guardQuence,
        pipes: this.pipeQuence,
      }),
    );

    this.koaInstance.use(this.routerInstance.routes());
  }

  // 监听错误响应
  private appError() {
    this.koaInstance.on('error', (error: Error, ctx: Koa.DefaultContext) => {
      this.exceptionsFilterQuence.forEach((itme) => itme(ctx, error));
    });
  }

  public listen(port: number, host?: string | Function, callback?: Function) {
    this.init();
    if (typeof host == 'function') {
      callback = host;
      host = '0.0.0.0';
    }
    this.koaInstance.listen(port, host, callback && callback());
  }

  public getKoa() {
    return this.koaInstance;
  }
  public getRouter() {
    return this.routerInstance;
  }

  public getIoc() {
    return this.iocInstance;
  }
  //添加全局中间件
  public use(...middleware: Array<Koa.Middleware>) {
    this.middleWareQuence = [...this.middleWareQuence, ...middleware];
  }

  //添加全局守卫
  public setGlobalGuard(...fn: Array<IGuard>) {
    this.guardQuence = this.guardQuence.concat(fn);
  }

  // 添加全局管道
  public setGlobalPip(...fn: Array<Pipe>) {
    this.pipeQuence = this.pipeQuence.concat(fn);
  }

  //添加全局异常拦截器
  public setGlobalExceptionsFilter(...fn: Array<IExceptionsFilter>) {
    this.exceptionsFilterQuence = this.exceptionsFilterQuence.concat(fn);
  }
  // 添加全局响应拦截器
  public setGlobalResponseInterceptor(...fn: Array<IResponseInterceptor>) {
    this.responseInterceptorQuence = this.responseInterceptorQuence.concat(fn);
  }

  public static create<T>(appModule: Type<T>, option?: IKoaNestOption) {
    return new this(appModule, option);
  }
}

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Ioc_1 = require("./Ioc");
const koa_1 = __importDefault(require("koa"));
const koa_router_1 = __importDefault(require("koa-router"));
const routerDecorator_1 = require("./routerDecorator");
const http_exceptions_filter_1 = require("./Filter/http.exceptions.filter");
const http_response_interceptor_1 = require("./Interceptor/http.response.interceptor");
class KoaNestTs {
    constructor(appModule, option) {
        this.middleWareQuence = [];
        this.guardQuence = [];
        this.exceptionsFilterQuence = [http_exceptions_filter_1.HttpExceptionFilter];
        this.responseInterceptorQuence = [http_response_interceptor_1.httpResponseInterceptor];
        this.Ioc = new Ioc_1.Container();
        this.Ioc.bindModule(appModule);
        this.koaApp = new koa_1.default();
        this.koaRouter = new koa_router_1.default();
    }
    loadRoutes() {
        const ctrInstance = this.Ioc.getControllerInstance();
        [...ctrInstance.values()].forEach(itme => routerDecorator_1.ResigerRouters(this.koaRouter, itme, [], this.guardQuence));
        this.koaApp.use(this.koaRouter.routes());
    }
    getKoa() {
        return this.koaApp;
    }
    getRouter() {
        return this.koaRouter;
    }
    getIoc() {
        return this.Ioc;
    }
    setGlobalPrefix(prefix) {
        this.koaRouter.prefix(prefix);
    }
    //添加全局中间件
    use(...fn) {
        this.middleWareQuence = [...this.middleWareQuence, ...fn];
    }
    //添加全局守卫
    setGlobalGuard(...fn) {
        this.guardQuence = [...this.guardQuence, ...fn];
    }
    // 添加全局响应拦截器
    setGlobalResponseInterceptor(...fn) {
        this.responseInterceptorQuence = [...this.responseInterceptorQuence, ...fn];
    }
    //添加全局异常拦截器
    setGlobalExceptionsFilter(...fn) {
        this.exceptionsFilterQuence = [...this.exceptionsFilterQuence, ...fn];
    }
    setfirstMiddlWare() {
        const firstMiddlWare = async (ctx, next) => {
            try {
                await next();
            }
            catch (error) {
                ctx.app.emit('error', error, ctx);
            }
        };
        const responseInterceptorMiddlWare = async (ctx, next) => {
            await next();
            this.responseInterceptorQuence.forEach(itme => itme(ctx));
        };
        this.middleWareQuence.push(firstMiddlWare);
        this.middleWareQuence.push(responseInterceptorMiddlWare);
    }
    init() {
        this.setfirstMiddlWare();
        this.middleWareQuence.forEach(itme => this.koaApp.use(itme));
        this.loadRoutes();
        this.appError();
    }
    appError() {
        this.koaApp.on("error", (err, ctx) => this.exceptionsFilterQuence.forEach(itme => itme(ctx, err)));
    }
    listen(port, host, callback) {
        this.init();
        if (typeof host == "function") {
            callback = host;
            host = "0.0.0.0";
        }
        this.koaApp.listen(port, host, callback && callback());
    }
    static create(appModule, option) {
        return new KoaNestTs(appModule, option);
    }
}
exports.KoaNestTs = KoaNestTs;

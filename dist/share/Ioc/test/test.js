"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const test_HttpServer_1 = require("./test.HttpServer");
const test_UserServer_1 = require("./test.UserServer");
const test_app_url_1 = require("./test.app_url");
const test_controller_1 = require("./test.controller");
const koa_router_1 = __importDefault(require("koa-router"));
const routerDecorator_1 = require("../../routerDecorator");
let rotuer = new koa_router_1.default({ prefix: "/api" });
console.log("test.ts:", test_app_url_1.APP_URL);
let userApp = class userApp {
    constructor() {
        console.log("userApp init....");
    }
};
userApp = __decorate([
    index_1.Module({
        providers: [
            test_HttpServer_1.HttpServer,
            test_UserServer_1.UserServer,
            {
                provide: test_app_url_1.APP_URL,
                useFactory: () => "http://www.baidu.com"
            }
        ], controllers: [test_controller_1.UserController]
    }),
    __metadata("design:paramtypes", [])
], userApp);
const container = new index_1.Container();
container.bind({ provide: userApp, useClass: userApp });
container.get(userApp);
let allRouters = container.getRouter();
console.log(allRouters);
function loadRouter(app) {
    [...allRouters.values()].forEach(itme => routerDecorator_1.ResigerRouter(rotuer, itme));
    app.use(rotuer.routes());
}
exports.loadRouter = loadRouter;
// container.bind({
//     provide:APP_URL,
//     // useValue:"http://www.baidu.com"
//     useFactory:()=>"http://www.baidu.com"
// })
// container.bind({provide:HttpServer,useClass:HttpServer})
// container.bind({provide:UserServer,useClass:UserServer})
// let userServer = container.get(UserServer)
// console.log("获取:",userServer,container.get(HttpServer))
// userServer.getUrl()

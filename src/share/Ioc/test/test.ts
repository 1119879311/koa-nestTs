
import "reflect-metadata";
import { Container, Module } from "../index";
import { HttpServer } from "./test.HttpServer";
import { UserServer } from "./test.UserServer";
import { APP_URL } from "./test.app_url";
import { UserController } from "./test.controller";
import koaRouter from "koa-router";
import { ResigerRouter } from "../../routerDecorator";

let rotuer = new koaRouter({ prefix: "/api" });

console.log("test.ts:", APP_URL);
@Module({
  providers: [
    HttpServer,
    UserServer,
    {
      provide: APP_URL,
      useFactory: () => "http://www.baidu.com",
    },
  ],
  controllers: [UserController],
})
class userApp {
  constructor() {
    console.log("userApp init....");
  }
}

const container = new Container();
container.bind({ provide: userApp, useClass: userApp });
container.get(userApp);

function getClassParams(target: object) {
  // console.log("1",Reflect.getMetadata(SCOPE_OPTIONS_METADATA, target))
 
  return Reflect.getMetadata("design:paramtypes", target) || [];
}

console.log("----desing:paramtypes:---HttpServer-----",getClassParams(HttpServer))
console.log("----desing:paramtypes:--UserServer------",getClassParams(UserServer))
console.log("----desing:paramtypes:---UserController-----",getClassParams(UserController))
// let allRouters = container.getRouter()
// console.log(allRouters)

export function loadRouter(app: any) {
  // [...allRouters.values()].forEach(itme=>ResigerRouter(rotuer,itme))
  // app.use(rotuer.routes())
}
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


import "reflect-metadata";
import { Container, Module,ContainerBase } from "../../index";
import { HttpServer } from "./test.HttpServer";
import { UserServer } from "./test.UserServer";
import { APP_URL } from "./test.app_url";
import { UserController } from "./test.controller";


// console.log("test.ts:", APP_URL);
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




function test1(){
  console.log("start--------------------------")
  let container = new ContainerBase()
  container.addProviders<any>([
    HttpServer,
    UserServer,
    {
      provide: APP_URL,
      useFactory: () => "http://www.baidu.com",
    },
    // UserController
  ])
  container.initLoading()
  let ins = container.getInstances()
  ins.forEach((val,key)=>{

      console.log("get-ins",key,val)
  })
  console.log("end--------------------------")

}

// test1()
test2()
function test2(){
  console.log("start--------------------------")

  const container = new Container();
  container.init(userApp);
  // console.log("userApp:",container.get(userApp))
  container.initLoading()
  let ins = container.getInstances()
  ins.forEach((val,key)=>{
  
      console.log("get-ins",key,val)
  })
  console.log("end--------------------------")

}
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

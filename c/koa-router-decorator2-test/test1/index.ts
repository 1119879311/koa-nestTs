import {ResigerRouter,} from "koa-router-decorator2";
import koaRouter from "koa-router";
import Koa from "koa"
import { setGolbalGuards, setGolbalMiddleware, UserController, Validation } from "./Controller";

const app = new Koa()
let rotuer = new koaRouter({
  prefix: "/api",
});


/**一个http服务请求的执行顺序
 *全局中间件--setGolbalMiddleware
  类中间件--ClassMiddleware
  方法中间件--MethondMiddleware
  全局守卫 useAuthGuards { useConfig: { userId: '1', userName: '123' } } 12
  类守卫 ClassGuards { useConfig: { userId: '1', userName: '123' } }
  方法守卫 MethondGuard { useConfig: { userId: '1', userName: '123' } } 这是元数据
  管道 Validation-apply: [ { value: { id: '12' }, type: [class useDto] } ]
  路由层:getbefore state: { useConfig: { userId: '1', userName: '123' } } query: { id: '12' }
 * 
 */


 // 注册控制器
  ResigerRouter(rotuer, UserController,{
    midwares:[setGolbalMiddleware], // 中间件
    guards:[setGolbalGuards], // 守卫
    pipes:[ new Validation() ] // 管道: 一般用与请求的参数默认设置，转换，验证
  });
  
  // 错误处理
  const HttpExceptionFilter =  async (error:Error,ctx:Koa.DefaultContext)=>{
    ctx.body =  {message:error.message?error.message:error,status:false,success:false,path: ctx.url,}
  }

  //响应处理
  const HttpResponseInterceptor = async (ctx:Koa.DefaultContext)=>{
    if (ctx.response.is("text/plain") || ctx.response.is("json")) {
      
      ctx.body = await { timestamp: new Date(), code: 200, data: ctx.body, status: true, message: "success"};
    }
  }
  
  // 设置第一个中间，可以捕获全局响应和错误处理
  const firstMiddlWare = async (ctx:Koa.DefaultContext,next:Function)=>{
    try {
      await next();
      HttpResponseInterceptor(ctx) ;//响应处理
    } catch (error) {
      ctx.app.emit("error", error, ctx); // 错误处理
    }
  }

  app.use(firstMiddlWare)
  app.use(rotuer.routes()); // 使用路由中间
  app.listen( 8080,()=>{
    console.log("server is run in prot 8080")
  } )
  app.on("error", HttpExceptionFilter)


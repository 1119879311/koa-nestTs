
import {Module} from "ioc-typescript"
import { UserModule } from "./User/user.module";
import {KoaNestTs} from "../index"
import Koa from "koa"
import { IContextOption, IGuard, Pipe } from "koa-router-decorator2";
@Module({
  imports: [UserModule],
})
export class appModule {}
// 中间件,设置全局 参数
// const 
const setGolbalStateMiddleware = async(ctx:Koa.DefaultContext,next:Function)=>{
  console.log("全局中间件--setGolbalStateMiddleware")
  ctx.state.useConfig = {
     userId:"1",
     userName:"123"
  }
  // throw new Error("全局中间件--setGolbalStateMiddleware 错误")
  await next()
}

// 守卫,验证用户合法性
const golbalAuthGuards:IGuard = async (option)=>{
  const {ctx } = option
  console.log("全局守卫 useAuthGuards" ,ctx.state,ctx.query.id)
  // throw new Error("全局守卫 useAuthGuards 错误")
  // return await ctx.query.id===ctx.state.useConfig.userId
  return true
}


// 管道：参数的转换，设置默认值，校验
class  Validation extends Pipe {
  apply(option: IContextOption): void | Promise<void> {
     console.log("管道 Validation-apply:", option.getArgs())
    //  throw new Error("管道 Validation-apply: 参数有误")
  }
  
}

function inint(){
  const app = KoaNestTs.create( appModule,{  prefix: "/adminConsole" })
  app.use(setGolbalStateMiddleware)
  app.setGlobalGuard(golbalAuthGuards)
  app.setGlobalPip(new Validation())
  app.listen(8080,()=>{
    console.log("app is runing in prot 8080")
  })
  
}

inint()

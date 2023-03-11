import {
  Controller,
  GET,
  Query,
  Ctx,
  Guard,
  Pipe,
  IContextOption,
  IGuard,
  Use,
  setMetadata,
} from "../../../koa-router-decorator";
import Koa from "koa"
import { UserServer } from "./user.serves";


class useDto{
  id:string="12"
  name:string="name"

}

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

const ClassMiddleware = async(ctx:Koa.DefaultContext,next:Function)=>{
  console.log("类中间件--ClassMiddleware")
  throw new Error("类中间件--ClassMiddleware 错误")
 
  await next()
}

const MethondMiddleware = async(ctx:Koa.DefaultContext,next:Function)=>{
  console.log("方法中间件--MethondMiddleware")
  // throw new Error("方法中间件--MethondMiddleware 错误")
  await next()
}


// 守卫,验证用户合法性
const useAuthGuards:IGuard = async (option)=>{
  const {ctx } = option
  console.log("全局守卫 useAuthGuards" ,ctx.state,ctx.query.id)
  // throw new Error("全局守卫 useAuthGuards 错误")
  return await ctx.query.id===ctx.state.useConfig.userId
}


// 类的守卫

const ClassGuard:IGuard = async (option)=>{
  const {ctx } = option
  console.log("类守卫 ClassGuards" ,ctx.state)
  // throw new Error("类守卫 ClassGuards 错误")
 
  return true
}
// 方法的守卫
const MethondGuard:IGuard = async (option)=>{
  const {ctx,get } = option
  console.log("方法守卫 MethondGuard" ,ctx.state ,get("apiName"))
  // throw new Error("方法守卫 MethondGuard 错误")
 
  return true
}

// 管道：参数的转换，设置默认值，校验
class  Validation extends Pipe {
  apply(option: IContextOption): void | Promise<void> {
     console.log("管道 Validation-apply:", option.getArgs())
    //  throw new Error("管道 Validation-apply: 参数有误")
  }
  
}


class db {
  name: string;
  constructor() {
    this.name = "小明";
  }
}
@Use(ClassMiddleware)
@Guard(ClassGuard)
@Controller("user")
export class UserController extends db {
  a: number;
  constructor(private usererver: UserServer) {
    super();
    this.a = 123456;
  }

  // @GET()
  // list(@Query() query: any, @Ctx() ctx: any) {
  //   console.log(this.a, this.name);
  //   console.log("getbefore");
  //   ctx.body = 12123;
  //   console.log("getnext");
  //   return 123132
  // }
  @setMetadata("apiName",'这是元数据')
  @Use(MethondMiddleware)
  @Guard(MethondGuard)
  @GET("list")
  save(@Query() query: useDto, @Ctx() ctx: any,@Query("id") id: string,) {
    // console.log(this.a, this.name,query);
    console.log("路由层:getbefore","state:",ctx.state,"query:",query);
    // ctx.body =123132
    // ctx.response.status = 503;
    // throw new Error("user error");
    return this.usererver.find() + this.getd()
  }
  getd() {
    return "lallalla";
  }
}

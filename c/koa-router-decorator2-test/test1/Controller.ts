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
  } from "koa-router-decorator2";
  import Koa from "koa"

  // DTO
  class useDto{
    id:string="12"
    name:string="name"
  
  }
  // 中间件,设置全局 参数
  // const 
  export const setGolbalMiddleware = async(ctx:Koa.DefaultContext,next:Function)=>{
    console.log("全局中间件--setGolbalMiddleware")
    ctx.state.useConfig = {
       userId:"1",
       userName:"123"
    }
    // throw new Error("全局中间件--setGolbalMiddleware 错误")
    await next()
  }
  
  //类中间件--ClassMiddleware
  export const ClassMiddleware = async(ctx:Koa.DefaultContext,next:Function)=>{
    console.log("类中间件--ClassMiddleware")
    // throw new Error("类中间件--ClassMiddleware 错误")
   
    await next()
  }
  
  //方法中间件--MethondMiddleware
  export const MethondMiddleware = async(ctx:Koa.DefaultContext,next:Function)=>{
    console.log("方法中间件--MethondMiddleware")
    // throw new Error("方法中间件--MethondMiddleware 错误")
    await next()
  }
  
  
  // 全局守卫
  export const setGolbalGuards:IGuard = async (option)=>{
    const {ctx } = option
    console.log("全局守卫 useAuthGuards" ,ctx.state,ctx.query.id)
    // throw new Error("全局守卫 useAuthGuards 错误")
    return true
    // return await ctx.query.id===ctx.state.useConfig.userId
  }
  
  
  // 类的守卫
  
  export const ClassGuard:IGuard = async (option)=>{
    const {ctx } = option
    console.log("类守卫 ClassGuards" ,ctx.state)
    // throw new Error("类守卫 ClassGuards 错误")
   
    return true
  }
  // 方法的守卫
  export const MethondGuard:IGuard = async (option)=>{
    const {ctx,get } = option
    console.log("方法守卫 MethondGuard" ,ctx.state ,get("apiName"))
    // throw new Error("方法守卫 MethondGuard 错误")
   
    return true
  }
  
  // 管道:作用参数的转换，设置默认值，校验
  export class  Validation extends Pipe {
    apply(option: IContextOption): void | Promise<void> {
       console.log("管道 Validation-apply:", option.getArgs())
      //  throw new Error("管道 Validation-apply: 参数有误")
    }
    
  }
  
  @Use(ClassMiddleware)
  @Guard(ClassGuard)
  @Controller("/user")
  export  class UserController  {
   
    @setMetadata("apiName",'这是元数据')
    @Use(MethondMiddleware)
    @Guard(MethondGuard)
    @GET("list")
    list(@Query() query: useDto, @Ctx() ctx: any,@Query("id") id: string,) {
   
      console.log("路由层:getbefore","state:",ctx.state,"query:",query);
      return this.getd()
    }
    getd() {
      return "lallalla";
    }
  }
  
  

  
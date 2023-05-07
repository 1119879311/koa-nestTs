import { Controller, GET, Query, Ctx, Guard, Pipe, IContextOption, IGuard, Use, setMetadata, Cookie } from '@by/router';
import Koa from 'koa';
import { UserServer } from './user.serves';
import * as Cookies from 'cookies';

class useDto {
  id: string = '12';
  name: string = 'name';
}

const ClassMiddleware = async (ctx: Koa.DefaultContext, next: Function) => {
  console.log('类中间件--ClassMiddleware');
  // throw new Error("类中间件--ClassMiddleware 错误")

  await next();
};

const MethondMiddleware = async (ctx: Koa.DefaultContext, next: Function) => {
  console.log('方法中间件--MethondMiddleware');
  // throw new Error("方法中间件--MethondMiddleware 错误")
  await next();
};

// 类的守卫

const ClassGuard: IGuard = async (option) => {
  const { ctx } = option;
  console.log('类守卫 ClassGuards', ctx.state);
  // throw new Error("类守卫 ClassGuards 错误")

  return true;
};
// 方法的守卫
const MethondGuard: IGuard = async (option) => {
  const { ctx, get } = option;
  console.log('方法守卫 MethondGuard', ctx.state, get('apiName'));
  return true;
  // throw new Error('方法守卫 MethondGuard 错误');
};

class db {
  name: string;
  constructor() {
    this.name = '小明';
  }
}
@setMetadata('apiName', '这是元数据class')
@Use(ClassMiddleware)
@Guard(ClassGuard)
@Controller('user')
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
  @setMetadata('apiName', '这是元数据')
  @Use(MethondMiddleware)
  @Guard(MethondGuard)
  @GET('list')
  save(@Query() query: useDto, @Ctx() ctx: any, @Query('id') id: string) {
    // console.log(this.a, this.name,query);
    console.log('路由层:getbefore', 'state:', ctx.state, 'query:', query, ctx.cookies.get('id'));
    // ctx.body =123132
    // ctx.response.status = 503;
    // throw new Error("user error");
    return this.usererver.find() + this.getd();
  }
  @GET('setCookies')
  setCookies(@Cookie() cookie: Cookies, @Ctx() ctx: Koa.DefaultContext) {
    console.log('ctx.state.useConfig', ctx.state.useConfig);
    cookie.set('userInfo', JSON.stringify(ctx.state.useConfig));
    return '设置cokie';
  }
  @GET('getCookies')
  getCookies(@Cookie() cookie: Cookies) {
    return cookie.get('userInfo') || {};
  }
  getd() {
    return 'lallalla';
  }
}

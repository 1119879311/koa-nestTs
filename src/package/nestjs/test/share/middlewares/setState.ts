import Koa from 'koa';
export const setStateMiddleware = async (ctx: Koa.Context, next: Function) => {
  console.log('全局中间件--setGolbalStateMiddleware');
  ctx.state.useConfig = {
    userId: '1',
    userName: '123',
  };
  // throw new Error("全局中间件--setGolbalStateMiddleware 错误")
  await next();
};

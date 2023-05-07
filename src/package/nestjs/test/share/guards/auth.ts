import { IContextOption, IGuard, Pipe } from '@by/router';
// 守卫,验证用户合法性
export const authGuards: IGuard = async (option) => {
  const { ctx, get } = option;
  console.log('全局守卫 useAuthGuards', ctx.state, ctx.query.id, get('apiName', true));
  // throw new Error("全局守卫 useAuthGuards 错误")
  // return await ctx.query.id===ctx.state.useConfig.userId
  return true;
};

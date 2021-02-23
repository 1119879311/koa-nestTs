
import Koa from "koa"
//正常响应拦截
export type IResponseInterceptor =(ctx:Koa.DefaultContext)=> void|any|Promise<any>
export const httpResponseInterceptor = async (ctx:Koa.DefaultContext)=>{
    if(ctx.response.is('text/plain')||ctx.response.is('json')){
        ctx.body ={
            statusCode: 200, 
            data: ctx.body, 
            status:true,
            message:'操作成功'
        }
    }
}
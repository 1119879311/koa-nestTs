import { HttpExceptions } from "../Exceptions/http.exceptions";
import { Logger } from "../Logger";
import Koa from "koa"
export type IExceptionsFilter = (ctx:Koa.DefaultContext,error:Error|HttpExceptions)=> void|any|Promise<any>
export const HttpExceptionFilter:IExceptionsFilter  = async (ctx:Koa.DefaultContext,error: Error|HttpExceptions)=>{
    const logStr = `${error.stack}`;
    Logger.error(logStr)
    if(error instanceof HttpExceptions){
        ctx.status = error.getStatus()
        ctx.body = await {
            data:null,
            status:false,
            statusCode:error.getStatus(),
            message:error.message
        }
    }else{
        ctx.body = await {
            data:null,
            status:false,
            statusCode:500,
            message:error.message?error.message:error
        }
    }
}
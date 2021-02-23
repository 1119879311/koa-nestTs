import { Logger } from "../Logger";

export let LoggerMwareInfo = (async (ctx:any,next:Function)=>{//捕获正常请求日志
    //过滤静态资源 .ico .jpg,.jpeg,.png,.svg,.gif,.mp3,.mp4
    if(/.(ico|png|jpg|jpeg|gif|svg|pm3|pm4)+$/.test(ctx.request.url)) {
    }else{
        try {
            const logStr = ` ${getClientIp(ctx.request)}  ${ctx.request.method} ${ctx.request.url} ${ctx.protocol}://${ctx.host}`;
            Logger.info(logStr)   
            await next()
        } catch (error) {
            const logStr = `[${getClientIp(ctx.request)}] [error] : ${error.stack}`;
            Logger.error(logStr)
            throw error
        }
    }   
})

 function getClientIp(req:any){
    
     return req.headers['x-forwarded-for'] || req.headers['x-real-ip']||req.ip
 }



"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("../Logger");
exports.LoggerMwareInfo = (async (ctx, next) => {
    //过滤静态资源 .ico .jpg,.jpeg,.png,.svg,.gif,.mp3,.mp4
    if (/.(ico|png|jpg|jpeg|gif|svg|pm3|pm4)+$/.test(ctx.request.url)) {
    }
    else {
        try {
            const logStr = ` ${getClientIp(ctx.request)}  ${ctx.request.method} ${ctx.request.url} ${ctx.protocol}://${ctx.host}`;
            Logger_1.Logger.info(logStr);
            await next();
        }
        catch (error) {
            const logStr = `[${getClientIp(ctx.request)}] [error] : ${error.stack}`;
            Logger_1.Logger.error(logStr);
            throw error;
        }
    }
});
function getClientIp(req) {
    return req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.ip;
}

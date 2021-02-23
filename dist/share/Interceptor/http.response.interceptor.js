"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpResponseInterceptor = async (ctx) => {
    if (ctx.response.is('text/plain') || ctx.response.is('json')) {
        ctx.body = {
            statusCode: 200,
            data: ctx.body,
            status: true,
            message: '操作成功'
        };
    }
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpResponseInterceptor = void 0;
const httpResponseInterceptor = async (ctx) => {
    if (ctx.response.is("text/plain") || ctx.response.is("json")) {
        ctx.body = {
            timestamp: new Date(),
            code: 200,
            data: ctx.body,
            status: true,
            message: "success",
            path: ctx.url,
        };
    }
};
exports.httpResponseInterceptor = httpResponseInterceptor;

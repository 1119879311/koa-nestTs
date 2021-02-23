"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_exceptions_1 = require("../Exceptions/http.exceptions");
const Logger_1 = require("../Logger");
exports.HttpExceptionFilter = async (ctx, error) => {
    const logStr = `${error.stack}`;
    Logger_1.Logger.error(logStr);
    if (error instanceof http_exceptions_1.HttpExceptions) {
        ctx.status = error.getStatus();
        ctx.body = await {
            data: null,
            status: false,
            statusCode: error.getStatus(),
            message: error.message
        };
    }
    else {
        ctx.body = await {
            data: null,
            status: false,
            statusCode: 500,
            message: error.message ? error.message : error
        };
    }
};

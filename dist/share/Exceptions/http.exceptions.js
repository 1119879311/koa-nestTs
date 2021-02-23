"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Util_1 = require("../Util");
const http_status_1 = require("./http-status");
// type It = Record<string,any>
class HttpExceptions extends Error {
    constructor(response, statusCode) {
        super();
        this.response = response;
        this.statusCode = statusCode;
        this.init();
    }
    /**
     * name
     */
    init() {
        if (Util_1.isString(this.response)) {
            this.message = this.response;
        }
        else if (Util_1.isObject(this.response) && Util_1.isString(this.response.message)) {
            this.message = this.response.message;
        }
        else {
            this.message = "SERVER IS ERROR";
            this.statusCode = http_status_1.HttpStatus.INTERNAL_SERVER_ERROR;
        }
    }
    /**
     * name
     */
    getResponse() {
        this.response;
    }
    /**
     * name
     */
    getStatus() {
        return this.statusCode;
    }
    /**
     * 创建错误信息
     */
    static createBody(message, statusCode) {
        return { message, statusCode };
    }
}
exports.HttpExceptions = HttpExceptions;

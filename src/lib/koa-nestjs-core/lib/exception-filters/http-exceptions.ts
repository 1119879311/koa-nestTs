import { isObject, isString } from "../util"
import {HttpStatus} from "./http-status"
// type It = Record<string,any>
export class HttpExceptions extends Error{
    constructor(
        private readonly response:string|Record<string,any>,
        private  statusCode:number

    ){
        super()
        this.init()
    }
    /**
     * name
     */
    
    public init() {
        if(isString(this.response)){
            this.message = this.response
        }else if(isObject(this.response)&& isString((this.response as Record<string,any>).message)){
            this.message = (this.response as Record<string, any>).message;
        }else{
            this.message="Server Exception"
            this.statusCode = HttpStatus.INTERNAL_SERVER_ERROR
        }

    }
    /**
     * name
     */
    public getResponse() {
        this.response;
    }
    /**
     * name
     */
    public getStatus() {
        return this.statusCode
    }

    /**
     * 创建错误信息
     */
    public static createBody(
        message:string,
        statusCode:number,
    ) {
        return { message,statusCode}
    }
}
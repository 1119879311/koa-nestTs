import "reflect-metadata";
import {Controller,GET,Query,Ctx,setMetadata} from "@by/router";
import {Inject,Injectable} from "../../src"
import { UserServer } from "./test.UserServer";
class db{
    name:string
    constructor(){
        this.name = "小明"
    }
}


@Injectable()
// @Controller("/A")
export class UserController extends db{
    a:number
    constructor(
       private userService:UserServer
    ){
        super()
        this.a = 123456
    }

    @GET()
    list(@Query() query:any,@Ctx() ctx:any){

        throw new Error("路由级错误....")
    //    try {
    //     let result =  this.userService.getUrl()
    //     console.log(this.a,this.name)
    //     console.log("getbefore")
    //     ctx.body = result
    //     console.log("getnext")
    //    } catch (error) {
    //         console.log(error)
    //    }    
       
        // return 123132
    }
    @GET("save/:id")
    save(@Query() query:any,@Ctx() ctx:any){
        console.log(this.a,this.name)
        console.log("getbefore")
        // ctx.body =123132
        ctx.response.status=503
        throw new Error("user error")
        console.log("getnext")
        
        // return 123132
    }
    getd(){
        return "lallalla"
    }
}



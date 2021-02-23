import {Controller,GET,GetRouters,Query,Ctx,ResigerRouter} from "../index"
import  koaRouter from "koa-router"

let rotuer = new koaRouter({
    prefix:'/api'
})

class db{
    name:string
    constructor(){
        this.name = "小明"
    }
}


@Controller("/A")
class A extends db{
    a:number
    constructor(){
        super()
        this.a = 123456
    }

    @GET()
    list(@Query() query:any,@Ctx() ctx:any){
        console.log(this.a,this.name)
        console.log("getbefore")
        ctx.body = 12123;
        console.log("getnext")
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

export function testContorller(app:any){
    ResigerRouter( rotuer, GetRouters(A))
    console.log("121212")
    app.use(rotuer.routes())
}




import { Controller, GET, setMetadata, Use } from "koa-router-decorator2";
import { UserServer } from "./user.serves";



async  function middelare(ctx:any,next:Function){
    console.log("121212")
    ctx.body= await "拦截啦"
   await next()
  
}

// @Guard(authUser)
@Use(middelare)
@Controller()
export class UserController{
    constructor(
        private userServer:UserServer
    ){}
    @Use(middelare)
    @setMetadata("Perssions",'list')
    @GET("/list")
    find(){
       
        // throw new Error("server is error")
        return this.userServer.find();
    }
}
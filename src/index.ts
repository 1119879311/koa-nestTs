
import {KoaNestTs} from "./share"
import {LoggerMwareInfo} from "./share/Middleware"
import koaBodyParser from "koa-bodyparser"
import {Logger} from "./share/Logger"
import { IGuardFn} from "./share/routerDecorator"
import { appModule } from "./modules/app.module"


//守卫
const authUser:IGuardFn = function(opt){
    console.log(opt.get("Perssions"),'以获取元数据')
    throw new Error("token is errors")
    // return true
}

const App = KoaNestTs.create(appModule)
App.setGlobalGuard(authUser);//全局守卫
App.use(LoggerMwareInfo,koaBodyParser()) ;//全局中间件
App.listen(3001,()=>{
    Logger.info("app is runing in prot 3001")
})









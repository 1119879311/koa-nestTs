
import {Module} from "../../ts-ioc"
import { UserModule } from "./User/user.module";
import {KoaNestTs} from "../index"

@Module({
  imports: [UserModule],
})
export class appModule {}


function inint(){
  const app = KoaNestTs.create( appModule,{  prefix: "/adminConsole" })
  app.listen(8080,()=>{
    console.log("app is runing in prot 8080")
  })
  
}

inint()

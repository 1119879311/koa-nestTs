// import { POST } from "src/share/RouterDecorator.all";
import { Auth } from "../../share/Decorator";
import { Perssions, PERSSIONSKEY } from "../../share/Decorator";
import {
  Controller,
  GET,
  setMetadata,
  Use,
  Query,
  IGuard,
  Guard,
  POST,
  GetContext,
  Header,
  Ctx
} from "../../share/routerDecorator";
import { AddUserDto } from "./dto/add.user.dto";
import { UserServer } from "./user.serves";
class Q {}
// @Guard(authUser)
// @Use(middelare)
// @Auth()
// @setMetadata("per-group", "user")
@Controller("spc")
export class UserController {
  constructor(private userServer: UserServer) {}
  // @Guard(authUser)
  // @Use(middelare)
  // @setMetadata("Perssions", "list")
  @Auth("list")
  @GET()
  list(@Header() headers: Record<string, any>,@Ctx() ctx: any,@Query("name") name: string,@Query() query:Q) {
    // @GetContext(PERSSIONSKEY, true) perssions: string // @Query("name") name: string // @Query() query: AddUserDto,
    // throw new Error("server is error")
    // console.log("headers", headers);
    // return this.userServer.find();
    ctx.render("index",{title:"title"})
  }
}

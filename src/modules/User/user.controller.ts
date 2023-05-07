// import { POST } from "src/share/RouterDecorator.all";
// import { Auth } from "../../share/Decorator";
// import { Perssions, PERSSIONSKEY } from "../../share/Decorator";
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
} from "@by/router";
import { AddUserDto } from "./dto/add.user.dto";
import { UserServer } from "./user.serves";
import { Auth } from "@/share/decorators";
import { authGuard } from "@/share/guards/auth.guard";

@Guard(authGuard)
@Auth()
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
  list(@Header() headers: Record<string, any>,@Ctx() ctx: any,@Query("name") name: string,@Query() query:AddUserDto) {
    // @GetContext(PERSSIONSKEY, true) perssions: string // @Query("name") name: string // @Query() query: AddUserDto,
    // throw new Error("server is error")
    // console.log("headers", headers);
    // return this.userServer.find();
    ctx.render("index",{title:"title"})
  }
}

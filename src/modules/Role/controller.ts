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
  GetContext,
} from "../../share/routerDecorator";

@Controller("Role")
export class RoleController {
  @Auth("list")
  @GET()
  find(@Query("name") name: string) {
    // throw new Error("server is error");
    return "role";
  }
}

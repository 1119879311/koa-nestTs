import { Injectable, forwardRef } from "../../share/Ioc";
import { UserServer } from "./user.serves";

@Injectable()
export class SqlServer {
  constructor() {}
  find() {
    console.log("this is SqlServer");
  }
}

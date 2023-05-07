import { Injectable, forwardRef } from "@by/ioc";
import { UserServer } from "./user.serves";

@Injectable()
export class SqlServer {
  constructor() {}
  find() {
    console.log("this is SqlServer");
  }
}

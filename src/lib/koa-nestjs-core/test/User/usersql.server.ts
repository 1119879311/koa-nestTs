import { Injectable } from "../../../ts-ioc";

// import { UserServer } from "./user.serves";

@Injectable()
export class SqlServer {
  constructor() {}
  find() {
    console.log("this is SqlServer");
    return "this is SqlServer"
  }
}

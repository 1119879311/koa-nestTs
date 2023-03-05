import { Injectable } from "../../share/Ioc";
import { SqlServer } from "./usersql.server";

@Injectable()
export class UserServer {
  constructor(private sqlServer: SqlServer) {}
  find(optoin: Record<string, any> = {}) {
    return 111;
  }
}

import { Injectable } from "ioc-typescript";
import { SqlServer } from "./usersql.server";

@Injectable()
export class UserServer {
  constructor(private sqlServer: SqlServer) {}
  find(optoin: Record<string, any> = {}) {
    return this.sqlServer.find()
  }
}

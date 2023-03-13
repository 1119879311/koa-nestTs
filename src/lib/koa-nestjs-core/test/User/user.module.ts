import { forwardRef, Module } from "ioc-typescript";
import { UserController } from "./user.controller";
import { UserServer } from "./user.serves";
import { SqlServer } from "./usersql.server";

@Module({
  controllers: [UserController],
  providers: [UserServer, SqlServer],
})
export class UserModule {}

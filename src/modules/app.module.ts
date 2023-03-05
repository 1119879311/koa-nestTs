import { RoleModule } from "./Role/module";
import { Module } from "../share/Ioc";
import { UserModule } from "./User/user.module";

@Module({
  imports: [UserModule, RoleModule],
})
export class appModule {}

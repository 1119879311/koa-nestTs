import { Module } from "@by/ioc";
import { UserModule } from "./User/user.module";

@Module({
  imports: [UserModule],
})
export class appModule {}

import { Module } from "../share/Ioc";
import { UserModule } from "./User/user.module";

@Module({
    imports:[UserModule]
})
export class appModule{}
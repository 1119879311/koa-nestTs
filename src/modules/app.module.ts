import { Module } from "ioc-typescript";
import { UserModule } from "./User/user.module";

@Module({
    imports:[UserModule]
})
export class appModule{}
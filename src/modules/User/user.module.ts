import { Module } from "../../share/Ioc";
import { UserController } from "./user.controller";
import { UserServer } from "./user.serves";

@Module({
    controllers:[UserController],
    providers:[UserServer]
 })
export class UserModule{}
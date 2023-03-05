import { RoleController } from "./controller";
import { forwardRef, Module } from "../../share/Ioc";

@Module({
  controllers: [RoleController],
  providers: [],
})
export class RoleModule {}

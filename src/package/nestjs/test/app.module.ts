import { Module } from '@by/ioc';
import { UserModule } from './modules/user/user.module';
@Module({
  imports: [UserModule],
})
export class appModule {}

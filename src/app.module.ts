import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/infra/user.module';
import { ConfigsModule } from './config/config.module';
@Module({
  imports: [ConfigsModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

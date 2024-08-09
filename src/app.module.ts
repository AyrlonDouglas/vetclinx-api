import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/infra/user.module';
import { ConfigsModule } from './config/config.module';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    ConfigsModule,
    UserModule,
    MongooseModule.forRoot(
      'mongodb+srv://ayrlon:Ayrlon42@cluster0.hr63a.mongodb.net/VetCaseHub?retryWrites=true&w=majority&appName=Cluster0',
    ),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

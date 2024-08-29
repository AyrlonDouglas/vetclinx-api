import { Module } from '@nestjs/common';
import { MongoDBModule } from './mongoDB.module';

@Module({
  imports: [MongoDBModule],
})
export class DatabaseModule {}

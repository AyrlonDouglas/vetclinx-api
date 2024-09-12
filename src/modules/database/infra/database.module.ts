import { Module } from '@nestjs/common';
import { MongoDBModule } from './mongoDB.module';

@Module({
  imports: [...MongoDBModule],
  exports: [...MongoDBModule],
})
export class DatabaseModule {}

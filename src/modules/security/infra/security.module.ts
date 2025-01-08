import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 30000, limit: 50, blockDuration: 30000 }]),
  ],
})
export class SecurityModule {}

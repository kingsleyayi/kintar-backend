import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { SeederService } from './seeder.service';

@Module({
  imports: [ConfigModule, UsersModule],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}

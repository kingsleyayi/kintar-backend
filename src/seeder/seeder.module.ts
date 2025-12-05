import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { CatalogsModule } from '../catalogs/catalogs.module';
import { CurrenciesModule } from '../currencies/currencies.module';
import { SeederService } from './seeder.service';
import { StartupSeeder } from './startup-seeder.provider';

@Module({
  imports: [ConfigModule, UsersModule, CatalogsModule, CurrenciesModule],
  providers: [SeederService, StartupSeeder],
  exports: [SeederService, StartupSeeder],
})
export class SeederModule {}

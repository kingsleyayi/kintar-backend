import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeederService } from './seeder.service';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'error', 'warn'],
  });

  const logger = new Logger('CatalogSeeder');
  try {
    const seeder = appContext.get(SeederService);
    logger.log('Seeding catalogs...');
    await seeder.seedCatalogs();
    logger.log('Catalogs ready.');
  } catch (error) {
    logger.error('Catalog seeding failed', error);
  } finally {
    await appContext.close();
  }
}

bootstrap();

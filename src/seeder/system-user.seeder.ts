import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeederService } from './seeder.service';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'error', 'warn'],
  });

  const logger = new Logger('Seeder');
  try {
    const seeder = appContext.get(SeederService);
    const config = appContext.get(ConfigService);
    logger.log('Running system user seeder...');
    const user = await seeder.seedSystemUser();
    logger.log(`System user ready: ${user.email}`);
    logger.log('You can log in with the configured system credentials to fetch a token.');
    logger.log(
      `JWT expires in: ${config.get<string>('JWT_EXPIRES_IN') ?? 'default'}`,
    );
  } catch (error) {
    logger.error('Seeding failed', error);
  } finally {
    await appContext.close();
  }
}

bootstrap();

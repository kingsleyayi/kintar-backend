import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { SeederService } from './seeder.service';

@Injectable()
export class StartupSeeder implements OnApplicationBootstrap {
  private readonly logger = new Logger(StartupSeeder.name);

  constructor(private readonly seederService: SeederService) {}

  async onApplicationBootstrap(): Promise<void> {
    try {
      this.logger.log('Running startup seed checks...');
      await this.seederService.seedOnStartup();
      this.logger.log('Startup seed checks complete.');
    } catch (error) {
      this.logger.error('Startup seeding failed', error);
    }
  }
}

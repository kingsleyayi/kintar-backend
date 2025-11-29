import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @ApiOkResponse({
    schema: {
      properties: {
        status: { type: 'string' },
        timestamp: { type: 'string' },
      },
    },
  })
  getHealth(): Record<string, string> {
    return this.appService.getHealth();
  }
}

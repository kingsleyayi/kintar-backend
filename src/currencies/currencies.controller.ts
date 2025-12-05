import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrenciesService } from './currencies.service';
import { CurrencyResponseDto } from './dto/currency-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Currencies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Get()
  @ApiOkResponse({ type: [CurrencyResponseDto] })
  async findAll(): Promise<CurrencyResponseDto[]> {
    return this.currenciesService.findAll();
  }
}

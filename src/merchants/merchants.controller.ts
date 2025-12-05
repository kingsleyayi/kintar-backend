import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { MerchantsService } from './merchants.service';
import { MerchantResponseDto } from './dto/merchant-response.dto';
import { UpdateDisplayCurrencyDto } from './dto/update-display-currency.dto';

@ApiTags('Merchants')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('merchants')
export class MerchantsController {
  constructor(private readonly merchantsService: MerchantsService) {}

  @Get('me')
  @ApiOkResponse({ type: MerchantResponseDto })
  async getMine(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<MerchantResponseDto> {
    if (!user.merchantId) {
      throw new BadRequestException('merchantId missing on user token');
    }

    const merchant = await this.merchantsService.findById(user.merchantId);
    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    return this.merchantsService.toResponseDto(merchant);
  }

  @Patch('me/display-currency')
  @ApiOkResponse({ type: MerchantResponseDto })
  async updateDisplayCurrency(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateDisplayCurrencyDto,
  ): Promise<MerchantResponseDto> {
    if (!user.merchantId) {
      throw new BadRequestException('merchantId missing on user token');
    }

    return this.merchantsService.updateDisplayCurrency(
      user.merchantId,
      dto.displayCurrency,
    );
  }
}

import { ApiProperty } from '@nestjs/swagger';

export class CurrencyResponseDto {
  @ApiProperty({ example: 'NGN' })
  code: string;

  @ApiProperty({ example: 'Nigerian Naira' })
  name: string;

  @ApiProperty({ example: '₦' })
  symbol: string;
}

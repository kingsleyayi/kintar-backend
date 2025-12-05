import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';

export class UpdateDisplayCurrencyDto {
  @ApiProperty({ description: 'ISO currency code', example: 'NGN' })
  @IsString()
  @Length(3, 3)
  @Matches(/^[A-Za-z]{3}$/i, {
    message: 'displayCurrency must be a 3-letter currency code',
  })
  displayCurrency: string;
}

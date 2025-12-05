import { ApiProperty } from '@nestjs/swagger';

export class MerchantResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  ownerId?: string;

  @ApiProperty({ required: false })
  displayCurrency?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

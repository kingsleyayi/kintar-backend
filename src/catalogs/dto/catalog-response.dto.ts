import { ApiProperty } from '@nestjs/swagger';
import { CatalogCategory } from '../catalog-category.type';

export class CatalogResponseDto {
  @ApiProperty({ enum: ['livestock', 'crops', 'machinery'] })
  category: CatalogCategory;

  @ApiProperty()
  key: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  badgeIcon?: string;

  @ApiProperty({ required: false })
  badgeLabel?: string;

  @ApiProperty({ type: [Object] })
  metrics: Array<{ label: string; value: string }>;

  @ApiProperty()
  coverageValue: number;

  @ApiProperty()
  coverageLabel: string;

  @ApiProperty({ type: [String] })
  chips: string[];

  @ApiProperty()
  actionLabel: string;

  @ApiProperty()
  order: number;
}

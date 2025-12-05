import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  CatalogCategory,
  CatalogCategoryEnum,
} from '../../catalogs/catalog-category.type';

export class CatalogSummaryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  key: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: Object.values(CatalogCategoryEnum) })
  category: CatalogCategory;
}

export class BatchResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  catalogId: string;

  @ApiProperty({ enum: ['livestock', 'crops', 'machinery'] })
  category: CatalogCategory;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: Date })
  startDate: Date;

  @ApiPropertyOptional({ example: 'active' })
  status?: string;

  @ApiPropertyOptional()
  notes?: string;

  @ApiPropertyOptional({ type: Object })
  livestockDetails?: Record<string, unknown>;

  @ApiPropertyOptional({ type: Object })
  cropDetails?: Record<string, unknown>;

  @ApiPropertyOptional({ type: Object })
  machineryDetails?: Record<string, unknown>;

  @ApiPropertyOptional()
  createdBy?: string;

  @ApiProperty()
  merchantId: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiPropertyOptional({ type: CatalogSummaryDto })
  catalog?: CatalogSummaryDto;
}

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

export class OutputTypeResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: Object.values(CatalogCategoryEnum) })
  category: CatalogCategory;

  @ApiPropertyOptional()
  catalogId?: string;

  @ApiPropertyOptional()
  unit?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional()
  createdBy?: string;

  @ApiPropertyOptional({ type: () => CatalogSummaryDto })
  catalog?: CatalogSummaryDto;

  @ApiProperty()
  merchantId: string;
}

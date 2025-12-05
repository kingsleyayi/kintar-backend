import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CatalogCategory } from '../../catalogs/catalog-category.type';

export class CreateOutputTypeDto {
  @ApiProperty({ example: 'Table eggs' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ enum: ['livestock', 'crops', 'machinery'] })
  @IsOptional()
  category?: CatalogCategory;

  @ApiPropertyOptional({ description: 'Optional link to a catalog' })
  @IsOptional()
  @IsMongoId()
  catalogId?: string;

  @ApiPropertyOptional({ example: 'crates' })
  @IsOptional()
  @IsString()
  unit?: string;
}

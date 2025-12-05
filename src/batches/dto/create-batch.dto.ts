import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class LivestockDetailsDto {
  @ApiPropertyOptional({ example: 1200 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  headcount?: number;

  @ApiPropertyOptional({ example: 'Ross 308' })
  @IsOptional()
  @IsString()
  breed?: string;
}

export class CropDetailsDto {
  @ApiPropertyOptional({ example: 4.5, description: 'Area in hectares' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  areaHectares?: number;

  @ApiPropertyOptional({ example: 'North Field' })
  @IsOptional()
  @IsString()
  plotName?: string;
}

export class MachineryDetailsDto {
  @ApiPropertyOptional({ example: 'John Deere X9' })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({ example: 'SN-12345-ABCDE' })
  @IsOptional()
  @IsString()
  serialNumber?: string;
}

export class CreateBatchDto {
  @ApiProperty({ description: 'Catalog identifier for this batch' })
  @IsMongoId()
  catalogId: string;

  @ApiProperty({ example: 'Poultry — January Group' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '2025-01-15', format: 'date' })
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({ example: 'Layers with IoT hydration sensors' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ type: LivestockDetailsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => LivestockDetailsDto)
  livestockDetails?: LivestockDetailsDto;

  @ApiPropertyOptional({ type: CropDetailsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CropDetailsDto)
  cropDetails?: CropDetailsDto;

  @ApiPropertyOptional({ type: MachineryDetailsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => MachineryDetailsDto)
  machineryDetails?: MachineryDetailsDto;
}

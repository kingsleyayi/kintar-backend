import { Controller, Get, Param, ParseEnumPipe, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CatalogCategory } from './catalog-category.type';
import { CatalogsService } from './catalogs.service';
import { CatalogResponseDto } from './dto/catalog-response.dto';

@ApiTags('Catalogs')
@Controller('catalogs')
export class CatalogsController {
  constructor(private readonly catalogsService: CatalogsService) {}

  @Get()
  @ApiOperation({ summary: 'List all catalog items, optionally filtered by category' })
  @ApiOkResponse({ type: [CatalogResponseDto] })
  async findAll(
    @Query('category', new ParseEnumPipe(['livestock', 'crops', 'machinery'], { optional: true }))
    category?: CatalogCategory,
  ): Promise<CatalogResponseDto[]> {
    if (category) {
      return this.catalogsService.findByCategory(category);
    }
    return this.catalogsService.findAll();
  }

  @Get(':category')
  @ApiOperation({ summary: 'List catalog items for a category' })
  @ApiOkResponse({ type: [CatalogResponseDto] })
  async findByCategory(
    @Param('category', new ParseEnumPipe(['livestock', 'crops', 'machinery']))
    category: CatalogCategory,
  ): Promise<CatalogResponseDto[]> {
    return this.catalogsService.findByCategory(category);
  }
}

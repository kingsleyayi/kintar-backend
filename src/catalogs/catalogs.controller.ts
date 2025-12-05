import { Controller, Get, Param, ParseEnumPipe, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CatalogCategory, CatalogCategoryEnum } from './catalog-category.type';
import { CatalogsService } from './catalogs.service';
import { CatalogResponseDto } from './dto/catalog-response.dto';

@ApiTags('Catalogs')
@Controller('catalogs')
export class CatalogsController {
  constructor(private readonly catalogsService: CatalogsService) {}

  @Get()
  @ApiOperation({
    summary: 'List all catalog items, optionally filtered by category',
  })
  @ApiOkResponse({ type: [CatalogResponseDto] })
  async findAll(
    @Query(
      'category',
      new ParseEnumPipe(Object.values(CatalogCategoryEnum), {
        optional: true,
      }),
    )
    category?: CatalogCategory,
  ): Promise<CatalogResponseDto[]> {
    const catalogs = category
      ? await this.catalogsService.findByCategory(category)
      : await this.catalogsService.findAll();

    return catalogs.map((catalog) =>
      this.catalogsService.toResponse(catalog),
    ) as CatalogResponseDto[];
  }

  @Get(':category')
  @ApiOperation({ summary: 'List catalog items for a category' })
  @ApiOkResponse({ type: [CatalogResponseDto] })
  async findByCategory(
    @Param('category', new ParseEnumPipe(Object.values(CatalogCategoryEnum)))
    category: CatalogCategory,
  ): Promise<CatalogResponseDto[]> {
    const catalogs = await this.catalogsService.findByCategory(category);
    return catalogs.map((catalog) =>
      this.catalogsService.toResponse(catalog),
    ) as CatalogResponseDto[];
  }
}

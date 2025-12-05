import {
  Body,
  Controller,
  Get,
  ParseEnumPipe,
  Query,
  UseGuards,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import {
  CatalogCategory,
  CatalogCategoryEnum,
} from '../catalogs/catalog-category.type';
import { CreateOutputTypeDto } from './dto/create-output-type.dto';
import { OutputTypeResponseDto } from './dto/output-type-response.dto';
import { OutputTypesService } from './output-types.service';

@ApiTags('Output Types')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('output-types')
export class OutputTypesController {
  constructor(private readonly outputTypesService: OutputTypesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new output type' })
  @ApiOkResponse({ type: OutputTypeResponseDto })
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateOutputTypeDto,
  ): Promise<OutputTypeResponseDto> {
    if (!user.merchantId) {
      throw new Error('merchantId missing on user token');
    }
    return this.outputTypesService.create(dto, user.userId, user.merchantId);
  }

  @Get()
  @ApiOperation({ summary: 'List output types for the current user' })
  @ApiOkResponse({ type: [OutputTypeResponseDto] })
  async findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query(
      'category',
      new ParseEnumPipe(Object.values(CatalogCategoryEnum), {
        optional: true,
      }),
    )
    category?: CatalogCategory,
    @Query('catalogId') catalogId?: string,
  ): Promise<OutputTypeResponseDto[]> {
    return this.outputTypesService.findAllForUser(user.userId, {
      category,
      catalogId,
    });
  }
}

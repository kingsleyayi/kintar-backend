import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CatalogsService } from '../catalogs/catalogs.service';
import { CatalogCategory } from '../catalogs/catalog-category.type';
import { Catalog } from '../catalogs/schemas/catalog.schema';
import { CreateOutputTypeDto } from './dto/create-output-type.dto';
import {
  CatalogSummaryDto,
  OutputTypeResponseDto,
} from './dto/output-type-response.dto';
import { OutputType, OutputTypeDocument } from './schemas/output-type.schema';

@Injectable()
export class OutputTypesService {
  constructor(
    @InjectModel(OutputType.name)
    private readonly outputTypeModel: Model<OutputTypeDocument>,
    private readonly catalogsService: CatalogsService,
  ) {}

  async create(
    dto: CreateOutputTypeDto,
    createdBy: string,
    merchantId?: string,
  ): Promise<OutputTypeResponseDto> {
    if (!merchantId) {
      throw new BadRequestException('merchantId is required');
    }

    const resolved = await this.resolveCategoryAndCatalog(dto);

    const outputType = await this.outputTypeModel.create({
      name: dto.name.trim(),
      category: resolved.category,
      catalogId: resolved.catalogId,
      unit: dto.unit?.trim(),
      createdBy: new Types.ObjectId(createdBy),
      merchantId: new Types.ObjectId(merchantId),
    });

    return this.toResponse(outputType, resolved.catalog);
  }

  async findAllForUser(
    userId: string,
    filters?: { category?: CatalogCategory; catalogId?: string },
  ): Promise<OutputTypeResponseDto[]> {
    if (!filters?.catalogId && !filters?.category) {
      // no change
    }
    const query: Record<string, unknown> = {
      createdBy: userId,
      merchantId: { $exists: true },
    };
    if (filters?.category) query.category = filters.category;
    if (filters?.catalogId) query.catalogId = filters.catalogId;

    const items = await this.outputTypeModel
      .find(query)
      .populate('catalogId')
      .sort({ createdAt: -1 })
      .exec();

    return items.map((item) => {
      const catalog = this.extractPopulatedCatalog(item);
      return this.toResponse(item, catalog);
    });
  }

  private async resolveCategoryAndCatalog(dto: CreateOutputTypeDto): Promise<{
    category: CatalogCategory;
    catalogId?: Types.ObjectId;
    catalog?: Catalog;
  }> {
    if (!dto.catalogId && !dto.category) {
      throw new BadRequestException(
        'Provide either a category or a catalogId.',
      );
    }

    if (dto.catalogId) {
      const catalog = await this.catalogsService.findById(dto.catalogId);
      if (!catalog) {
        throw new NotFoundException('Catalog not found');
      }

      if (dto.category && dto.category !== catalog.category) {
        throw new BadRequestException(
          'Category does not match the selected catalog.',
        );
      }

      return {
        category: catalog.category,
        catalogId: new Types.ObjectId(dto.catalogId),
        catalog,
      };
    }

    // No catalog, category must exist
    return { category: dto.category as CatalogCategory };
  }

  private toResponse(
    outputType: OutputTypeDocument,
    catalog?: Catalog,
  ): OutputTypeResponseDto {
    type RawOutput = OutputType & {
      _id?: Types.ObjectId | string;
      id?: Types.ObjectId | string;
      catalogId?:
        | Types.ObjectId
        | (Catalog & {
            _id?: Types.ObjectId | string;
            id?: Types.ObjectId | string;
          });
      createdAt?: Date;
      updatedAt?: Date;
    };

    const raw = outputType.toObject() as RawOutput;
    const catalogSummary = this.buildCatalogSummary(raw, catalog);

    return {
      id: raw._id?.toString?.() ?? raw.id?.toString?.() ?? '',
      name: raw.name,
      category: raw.category,
      catalogId:
        raw.catalogId?.toString?.() ??
        (typeof raw.catalogId === 'object'
          ? raw.catalogId?._id?.toString?.()
          : undefined),
      unit: raw.unit,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      createdBy: raw.createdBy?.toString?.(),
      merchantId: raw.merchantId?.toString?.() ?? '',
      catalog: catalogSummary,
    };
  }

  private buildCatalogSummary(
    output: {
      catalogId?:
        | Types.ObjectId
        | (Catalog & {
            _id?: Types.ObjectId | string;
            id?: Types.ObjectId | string;
          });
    },
    catalog?: Catalog & {
      _id?: Types.ObjectId | string;
      id?: Types.ObjectId | string;
    },
  ): CatalogSummaryDto | undefined {
    const catalogSource =
      catalog ??
      (output.catalogId &&
      typeof output.catalogId === 'object' &&
      'key' in output.catalogId
        ? (output.catalogId as Catalog & {
            _id?: Types.ObjectId | string;
            id?: Types.ObjectId | string;
          })
        : undefined);

    if (!catalogSource) return undefined;

    return {
      id:
        catalogSource._id?.toString?.() ?? catalogSource.id?.toString?.() ?? '',
      key: catalogSource.key,
      name: catalogSource.name,
      category: catalogSource.category,
    };
  }

  private extractPopulatedCatalog(outputType: OutputTypeDocument):
    | (Catalog & {
        _id?: Types.ObjectId | string;
        id?: Types.ObjectId | string;
      })
    | undefined {
    const catalogCandidate = outputType.catalogId as unknown;
    if (
      catalogCandidate &&
      typeof catalogCandidate === 'object' &&
      'key' in catalogCandidate
    ) {
      return catalogCandidate as Catalog & {
        _id?: Types.ObjectId | string;
        id?: Types.ObjectId | string;
      };
    }
    return undefined;
  }
}

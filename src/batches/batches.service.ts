import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CatalogsService } from '../catalogs/catalogs.service';
import { CatalogCategoryEnum } from '../catalogs/catalog-category.type';
import { Catalog } from '../catalogs/schemas/catalog.schema';
import { CreateBatchDto } from './dto/create-batch.dto';
import { BatchResponseDto, CatalogSummaryDto } from './dto/batch-response.dto';
import { Batch, BatchDocument, BatchStatus } from './schemas/batch.schema';

@Injectable()
export class BatchesService {
  constructor(
    @InjectModel(Batch.name)
    private readonly batchModel: Model<BatchDocument>,
    private readonly catalogsService: CatalogsService,
  ) {}

  async create(
    dto: CreateBatchDto,
    createdBy: string,
    merchantId?: string,
  ): Promise<BatchResponseDto> {
    const catalog = await this.catalogsService.findById(dto.catalogId);
    if (!catalog) {
      throw new NotFoundException('Catalog not found');
    }

    const batch = await this.batchModel.create({
      catalogId: new Types.ObjectId(dto.catalogId),
      category: catalog.category,
      name: dto.name.trim(),
      startDate: new Date(dto.startDate),
      status: BatchStatus.Active,
      notes: dto.notes,
      livestockDetails:
        catalog.category === CatalogCategoryEnum.Livestock
          ? dto.livestockDetails
          : undefined,
      cropDetails:
        catalog.category === CatalogCategoryEnum.Crops
          ? dto.cropDetails
          : undefined,
      machineryDetails:
        catalog.category === CatalogCategoryEnum.Machinery
          ? dto.machineryDetails
          : undefined,
      createdBy: new Types.ObjectId(createdBy),
      merchantId: merchantId ? new Types.ObjectId(merchantId) : undefined,
    });

    return this.toResponse(batch, catalog);
  }

  async findAllForUser(userId: string): Promise<BatchResponseDto[]> {
    const batches = await this.batchModel
      .find({ createdBy: userId })
      .populate('catalogId')
      .sort({ createdAt: -1 })
      .exec();

    return batches.map((batch) => {
      const catalog = this.extractPopulatedCatalog(batch);
      return this.toResponse(batch, catalog);
    });
  }

  private toResponse(
    batch: BatchDocument,
    catalog?: Catalog,
  ): BatchResponseDto {
    type RawBatch = Batch & {
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

    const raw = batch.toObject() as RawBatch;
    const catalogSummary = this.buildCatalogSummary(raw, catalog);

    return {
      id: raw._id?.toString?.() ?? raw.id?.toString?.(),
      catalogId:
        raw.catalogId?.toString?.() ??
        raw.catalogId?._id?.toString?.() ??
        undefined,
      category: raw.category,
      name: raw.name,
      startDate: raw.startDate,
      status: raw.status,
      notes: raw.notes,
      livestockDetails: raw.livestockDetails,
      cropDetails: raw.cropDetails,
      machineryDetails: raw.machineryDetails,
      createdBy: raw.createdBy?.toString?.(),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      merchantId: raw.merchantId?.toString?.() ?? '',
      catalog: catalogSummary,
    };
  }

  private buildCatalogSummary(
    batch: {
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
      (typeof batch.catalogId === 'object' &&
      batch.catalogId &&
      'key' in batch.catalogId
        ? (batch.catalogId as Catalog & {
            _id?: Types.ObjectId | string;
            id?: Types.ObjectId | string;
          })
        : undefined);

    if (!catalogSource) {
      return undefined;
    }

    return {
      id: catalogSource._id?.toString?.() ?? catalogSource.id?.toString?.(),
      key: catalogSource.key,
      name: catalogSource.name,
      category: catalogSource.category,
    };
  }

  private extractPopulatedCatalog(batch: BatchDocument):
    | (Catalog & {
        _id?: Types.ObjectId | string;
        id?: Types.ObjectId | string;
      })
    | undefined {
    const catalogCandidate = batch.catalogId as unknown;

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

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CatalogCategory } from './catalog-category.type';
import { Catalog, CatalogDocument } from './schemas/catalog.schema';

@Injectable()
export class CatalogsService {
  constructor(
    @InjectModel(Catalog.name)
    private readonly catalogModel: Model<CatalogDocument>,
  ) {}

  async findById(id: string): Promise<Catalog | null> {
    return this.catalogModel.findById(id).lean();
  }

  async count(): Promise<number> {
    return this.catalogModel.estimatedDocumentCount();
  }

  async findAll(): Promise<Catalog[]> {
    return this.catalogModel.find().sort({ order: 1, name: 1 }).lean();
  }

  async findByCategory(category: CatalogCategory): Promise<Catalog[]> {
    return this.catalogModel
      .find({ category })
      .sort({ order: 1, name: 1 })
      .lean();
  }

  async upsertMany(entries: Catalog[]): Promise<void> {
    const ops = entries.map((entry) =>
      this.catalogModel.updateOne(
        { category: entry.category, key: entry.key },
        { $set: entry },
        { upsert: true },
      ),
    );
    await Promise.all(ops);
  }

  private isMongooseDocument(
    catalog: CatalogDocument | Catalog,
  ): catalog is CatalogDocument {
    return typeof (catalog as CatalogDocument).toObject === 'function';
  }

  toResponse(
    catalog:
      | CatalogDocument
      | (Catalog & {
          _id?: Types.ObjectId | string;
          id?: Types.ObjectId | string;
          createdAt?: Date;
          updatedAt?: Date;
        }),
  ) {
    type RawCatalog = Catalog & {
      _id?: Types.ObjectId | string;
      id?: Types.ObjectId | string;
      createdAt?: Date;
      updatedAt?: Date;
    };

    const raw = (
      this.isMongooseDocument(catalog) ? catalog.toObject() : catalog
    ) as RawCatalog;

    return {
      id: raw._id?.toString?.() ?? raw.id?.toString?.(),
      category: raw.category,
      key: raw.key,
      name: raw.name,
      description: raw.description,
      badgeIcon: raw.badgeIcon,
      badgeLabel: raw.badgeLabel,
      metrics: raw.metrics,
      coverageValue: raw.coverageValue,
      coverageLabel: raw.coverageLabel,
      chips: raw.chips,
      actionLabel: raw.actionLabel,
      order: raw.order,
    };
  }
}

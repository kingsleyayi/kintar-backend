import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CatalogCategory } from './catalog-category.type';
import { Catalog, CatalogDocument } from './schemas/catalog.schema';

@Injectable()
export class CatalogsService {
  constructor(
    @InjectModel(Catalog.name)
    private readonly catalogModel: Model<CatalogDocument>,
  ) {}

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
}

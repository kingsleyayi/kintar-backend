import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CatalogCategory, CatalogCategoryEnum } from '../catalog-category.type';

export type CatalogDocument = HydratedDocument<Catalog>;

@Schema({ timestamps: true })
export class Catalog {
  @Prop({
    required: true,
    enum: Object.values(CatalogCategoryEnum),
  })
  category: CatalogCategory;

  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop()
  badgeIcon?: string;

  @Prop()
  badgeLabel?: string;

  @Prop({ type: [{ label: String, value: String }], default: [] })
  metrics: Array<{ label: string; value: string }>;

  @Prop({ default: 0 })
  coverageValue: number;

  @Prop({ default: '' })
  coverageLabel: string;

  @Prop({ type: [String], default: [] })
  chips: string[];

  @Prop({ default: 'New group' })
  actionLabel: string;

  @Prop({ default: 0 })
  order: number;
}

export const CatalogSchema = SchemaFactory.createForClass(Catalog);

CatalogSchema.index({ category: 1, key: 1 }, { unique: true });

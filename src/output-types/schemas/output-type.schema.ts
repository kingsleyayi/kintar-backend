import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  CatalogCategory,
  CatalogCategoryEnum,
} from '../../catalogs/catalog-category.type';
import { Catalog } from '../../catalogs/schemas/catalog.schema';
import { User } from '../../users/schemas/user.schema';

export type OutputTypeDocument = HydratedDocument<OutputType>;

@Schema({ timestamps: true })
export class OutputType {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({
    required: true,
    enum: Object.values(CatalogCategoryEnum),
  })
  category: CatalogCategory;

  @Prop({ type: Types.ObjectId, ref: Catalog.name })
  catalogId?: Types.ObjectId;

  @Prop()
  unit?: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Merchant', required: true })
  merchantId: Types.ObjectId;
}

export const OutputTypeSchema = SchemaFactory.createForClass(OutputType);

OutputTypeSchema.index(
  { createdBy: 1, category: 1, name: 1, catalogId: 1 },
  { unique: false },
);

import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  CatalogCategory,
  CatalogCategoryEnum,
} from '../../catalogs/catalog-category.type';
import { Catalog } from '../../catalogs/schemas/catalog.schema';
import { User } from '../../users/schemas/user.schema';

export type BatchDocument = HydratedDocument<Batch>;

export enum BatchStatus {
  Active = 'active',
  Completed = 'completed',
  Archived = 'archived',
}

@Schema({ timestamps: true })
export class Batch {
  @Prop({ type: Types.ObjectId, ref: Catalog.name, required: true })
  catalogId: Types.ObjectId;

  @Prop({
    required: true,
    enum: Object.values(CatalogCategoryEnum),
  })
  category: CatalogCategory;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ enum: BatchStatus, default: BatchStatus.Active })
  status: BatchStatus;

  @Prop()
  notes?: string;

  @Prop({
    _id: false,
    type: {
      headcount: { type: Number },
      breed: { type: String },
    },
  })
  livestockDetails?: {
    headcount?: number;
    breed?: string;
  };

  @Prop({
    _id: false,
    type: {
      areaHectares: { type: Number },
      plotName: { type: String },
    },
  })
  cropDetails?: {
    areaHectares?: number;
    plotName?: string;
  };

  @Prop({
    _id: false,
    type: {
      model: { type: String },
      serialNumber: { type: String },
    },
  })
  machineryDetails?: {
    model?: string;
    serialNumber?: string;
  };

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Merchant', required: true })
  merchantId: Types.ObjectId;
}

export const BatchSchema = SchemaFactory.createForClass(Batch);

BatchSchema.index({ catalogId: 1, name: 1 });

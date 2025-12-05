import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type MerchantDocument = HydratedDocument<Merchant>;

@Schema({ timestamps: true })
export class Merchant {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  ownerId?: Types.ObjectId;

  @Prop({
    trim: true,
    uppercase: true,
    minlength: 3,
    maxlength: 3,
    default: 'NGN',
  })
  displayCurrency?: string;
}

export const MerchantSchema = SchemaFactory.createForClass(Merchant);

MerchantSchema.index({ name: 1 }, { unique: true });

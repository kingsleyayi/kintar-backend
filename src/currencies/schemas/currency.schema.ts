import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CurrencyDocument = HydratedDocument<Currency>;

@Schema({ timestamps: true })
export class Currency {
  @Prop({
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    minlength: 3,
    maxlength: 3,
  })
  code: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  symbol: string;
}

export const CurrencySchema = SchemaFactory.createForClass(Currency);

CurrencySchema.index({ code: 1 }, { unique: true });

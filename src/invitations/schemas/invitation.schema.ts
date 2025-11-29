import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type InvitationDocument = HydratedDocument<Invitation>;

export enum InvitationStatus {
  Pending = 'pending',
  Accepted = 'accepted',
  Expired = 'expired',
}

@Schema({ timestamps: true })
export class Invitation {
  @Prop({ required: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, select: false })
  tokenHash: string;

  @Prop({ type: Date, required: true, expires: 0 })
  expiresAt: Date;

  @Prop({ enum: InvitationStatus, default: InvitationStatus.Pending })
  status: InvitationStatus;

  @Prop({ type: Date })
  acceptedAt?: Date;

  @Prop({ type: String, ref: User.name, required: true })
  invitedBy: string;
}

export const InvitationSchema = SchemaFactory.createForClass(Invitation);

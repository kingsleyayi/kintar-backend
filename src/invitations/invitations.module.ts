import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { InvitationsService } from './invitations.service';
import { InvitationsController } from './invitations.controller';
import { Invitation, InvitationSchema } from './schemas/invitation.schema';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { MerchantsModule } from '../merchants/merchants.module';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Invitation.name, schema: InvitationSchema },
    ]),
    UsersModule,
    NotificationsModule,
    AuthModule,
    MerchantsModule,
  ],
  controllers: [InvitationsController],
  providers: [InvitationsService],
})
export class InvitationsModule {}
